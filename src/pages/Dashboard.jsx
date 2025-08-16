import React, { useEffect, useState } from "react";
import ProjectForm from "../components/ProjectForm";
import ProjectList from "../components/ProjectList";
import { API_ENDPOINTS } from "../utils/config";
import { apiGet, apiPost, apiPut, apiDelete } from "../utils/api";

export default function Dashboard({ user }) {
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editProject, setEditProject] = useState(null);

  // Ambil data project dari backend
  const fetchProjects = async () => {
    try {
      const data = await apiGet(API_ENDPOINTS.projects);
      if (data.success) {
        setProjects(data.projects);
      } else {
        console.warn("Gagal ambil project:", data.message);
      }
    } catch (err) {
      console.error("Gagal fetch projects:", err);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Tambah project
  const handleAdd = async (project) => {
    try {
      const data = await apiPost(API_ENDPOINTS.projects, project);
      if (data.success) {
        setProjects((prev) => [...prev, data.project]);
        setShowForm(false);
      }
    } catch (err) {
      console.error("Gagal tambah project:", err);
    }
  };

  // Edit project
  const handleUpdate = async (project) => {
    try {
      const data = await apiPut(`${API_ENDPOINTS.projects}?id=${project.id}`, project);
      if (data.success) {
        setProjects((prev) =>
          prev.map((p) => (p.id === project.id ? data.project : p))
        );
        setShowForm(false);
        setEditProject(null);
      }
    } catch (err) {
      console.error("Gagal update project:", err);
    }
  };

  // Hapus project
  const handleDelete = async (id) => {
    if (!window.confirm("Hapus project ini?")) return;
    try {
      const data = await apiDelete(`${API_ENDPOINTS.projects}?id=${id}`);
      if (data.success) {
        setProjects((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (err) {
      console.error("Gagal hapus project:", err);
    }
  };

  // Update task di dalam project
  const handleUpdateTasks = async (projectId, updatedTasks) => {
    try {
      const data = await apiPut(`${API_ENDPOINTS.tasks}?project_id=${projectId}`, {
        tasks: updatedTasks,
      });
      if (data.success) {
        setProjects((prev) =>
          prev.map((p) =>
            p.id === projectId ? { ...p, tasks: updatedTasks } : p
          )
        );
      }
    } catch (err) {
      console.error("Gagal update tasks:", err);
    }
  };

  return (
    <div className="p-6">
      <header className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Dashboard</h2>
        {user && (
          <button
            onClick={() => {
              setEditProject(null);
              setShowForm(true);
            }}
            className="bg-green-500 text-white px-3 py-1 rounded"
          >
            + Add Project
          </button>
        )}
      </header>

      {showForm && (
        <ProjectForm
          project={editProject}
          onSave={editProject ? handleUpdate : handleAdd}
          onCancel={() => {
            setEditProject(null);
            setShowForm(false);
          }}
        />
      )}

      <ProjectList
        projects={projects}
        user={user}
        allUsers={[]} // bisa diisi fetch user list dari BE
        onDelete={handleDelete}
        onUpdateTasks={handleUpdateTasks}
        onEditProject={(project) => {
          setEditProject(project);
          setShowForm(true);
        }}
      />
    </div>
  );
}