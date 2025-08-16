import React, { useState } from 'react';
import TaskList from './TaskList';
import TaskForm from './TaskForm';

function formatDate(iso) {
  if (!iso) return '-';
  const d = new Date(iso);
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yy = d.getFullYear();
  const hh = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  return `${dd}/${mm}/${yy} ${hh}:${min}`;
}

export default function ProjectList({
  projects,
  user,
  allUsers,
  onDelete,          // (projectId) => void
  onUpdateProject,   // (projectId, patchedProjectObj) => void  (opsional jika dipakai)
  onUpdateTasks,     // (projectId, updatedTasks) => void
  onEditProject,     // (projectObj) => void (untuk buka modal edit project di parent)
}) {
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [currentProjectId, setCurrentProjectId] = useState(null);
  const [editingTask, setEditingTask] = useState(null);

  const mustLogin = (msg = 'Anda harus login untuk melakukan aksi ini') => {
    alert(msg);
    return false;
  };

  const openAddTask = (projectId) => {
    if (!user) return mustLogin('Anda harus login untuk menambah tugas');
    setCurrentProjectId(projectId);
    setEditingTask(null);
    setShowTaskForm(true);
  };

  const openEditTask = (projectId, task) => {
    if (!user) return mustLogin('Anda harus login untuk mengedit tugas');
    setCurrentProjectId(projectId);
    setEditingTask(task);
    setShowTaskForm(true);
  };

  const closeTaskForm = () => {
    setShowTaskForm(false);
    setEditingTask(null);
    setCurrentProjectId(null);
  };

  const saveTask = (task) => {
    if (!user) return mustLogin('Anda harus login untuk menyimpan tugas');
    const project = projects.find((p) => p.id === currentProjectId);
    if (!project) return;

    let updatedTasks;
    if (editingTask && task.id) {
      // Update existing
      updatedTasks = project.tasks.map((t) =>
        t.id === task.id ? { ...t, ...task } : t
      );
    } else {
      // Create new
      const newTask = {
        ...task,
        id: Date.now(), // sementara di FE; saat sudah connect BE, ganti pakai id dari server
        owner_name: user.username,
        isPrivate: !!task.isPrivate,
        createdAt: new Date().toISOString(),
      };
      updatedTasks = [newTask, ...(project.tasks || [])];
    }

    onUpdateTasks(currentProjectId, updatedTasks);
    closeTaskForm();
  };

  const deleteTask = (projectId, taskId) => {
    if (!user) return mustLogin('Anda harus login untuk menghapus tugas');
    if (!window.confirm('Hapus tugas ini?')) return;
    const project = projects.find((p) => p.id === projectId);
    if (!project) return;
    const updatedTasks = (project.tasks || []).filter((t) => t.id !== taskId);
    onUpdateTasks(projectId, updatedTasks);
  };

  if (!projects?.length) {
    return <p className="text-gray-400">Tidak ada project untuk ditampilkan.</p>;
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 items-start">
      {projects.map((project) => {
        const tasks = project.tasks || [];

        // Filter visibilitas task
        const visibleTasks = tasks.filter((task) => {
          if (!user) return !task.isPrivate; // guest hanya lihat public
          if (!task.isPrivate) return true;  // user login bisa lihat public
          // Private: hanya owner task atau member task
          return (
            task.owner_name === user.username ||
            (task.members && task.members.includes(user.username))
          );
        });

        const canEditProject = !!user && user.username === project.owner_name;

        return (
          <section key={project.id} className="bg-gray-800 rounded-2xl p-5 shadow-lg">
            <header className="flex justify-between items-start mb-4">
              <div className="min-w-0">
                <h3 className="text-xl font-bold truncate">{project.title}</h3>
                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400 mt-1">
                  <span>{project.isPrivate ? 'Private' : 'Public'}</span>
                  <span>•</span>
                  <span>Owner: {project.owner_name}</span>
                  <span>•</span>
                  <span className="whitespace-nowrap">
                    Created: {formatDate(project.createdAt)}
                  </span>
                  <span>•</span>
                  <span>{visibleTasks.length} task</span>
                </div>
              </div>

              <div className="flex gap-2 items-center shrink-0">
                {canEditProject && (
                  <>
                    <button
                      onClick={() => onEditProject(project)}
                      title="Edit Project"
                      className="p-2 rounded hover:bg-white/5"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => onDelete(project.id)}
                      title="Delete Project"
                      className="p-2 rounded hover:bg-red-600/20 text-red-400"
                    >
                      🗑️
                    </button>
                  </>
                )}
              </div>
            </header>

            {user && (
              <div className="mb-4">
                <button
                  onClick={() => openAddTask(project.id)}
                  className="text-sm bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded-md"
                >
                  + Add Task
                </button>
              </div>
            )}

            <TaskList
              tasks={visibleTasks}
              user={user}
              projectOwner={project.owner_name}  // ⬅ penting: kasih ke TaskList
              onEdit={(task) => openEditTask(project.id, task)}
              onDelete={(taskId) => deleteTask(project.id, taskId)}
            />

            {showTaskForm && currentProjectId === project.id && (
              <TaskForm
                task={editingTask}
                allUsers={allUsers}
                onSave={saveTask}
                onCancel={closeTaskForm}
              />
            )}
          </section>
        );
      })}
    </div>
  );
}