import React, { useState, useEffect } from 'react';

export default function TaskForm({ task, allUsers = [], onSave, onCancel }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('To Do');
  const [deadline, setDeadline] = useState('');
  const [members, setMembers] = useState([]);
  const [isPrivate, setIsPrivate] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title || '');
      setDescription(task.description || '');
      setStatus(task.status || 'To Do');
      setDeadline(task.deadline || '');
      setMembers(task.members || []);
      setIsPrivate(task.isPrivate || false);
    } else {
      setTitle('');
      setDescription('');
      setStatus('To Do');
      setDeadline('');
      setMembers([]);
      setIsPrivate(false);
    }
  }, [task]);

  const toggleMember = (username) => {
    setMembers((cur) => (cur.includes(username) ? cur.filter((m) => m !== username) : [...cur, username]));
  };

  const submit = (e) => {
    e.preventDefault();
    if (!title.trim()) return alert('Judul tugas wajib diisi');
    if (!deadline) return alert('Deadline wajib diisi');

    const payload = {
      ...task,
      title: title.trim(),
      description: description.trim(),
      status,
      deadline,
      members,
      isPrivate,
    };
    onSave(payload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <form onSubmit={submit} className="w-full max-w-lg bg-gray-800 p-6 rounded-2xl text-gray-100 shadow-xl">
        <h3 className="text-2xl font-bold mb-4">{task ? 'Edit Task' : 'Tambah Task'}</h3>

        <label className="block mb-3">
          <span className="text-sm font-medium">Judul Task</span>
          <input value={title} onChange={(e) => setTitle(e.target.value)} required autoFocus
            className="mt-2 w-full bg-gray-900 px-3 py-2 rounded-md outline-none focus:ring-2 focus:ring-indigo-500" />
        </label>

        <label className="block mb-3">
          <span className="text-sm font-medium">Deskripsi</span>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4}
            className="mt-2 w-full bg-gray-900 px-3 py-2 rounded-md outline-none focus:ring-2 focus:ring-indigo-500" />
        </label>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
          <label>
            <span className="text-sm font-medium">Status</span>
            <select value={status} onChange={(e) => setStatus(e.target.value)}
              className="mt-2 w-full bg-gray-900 px-3 py-2 rounded-md outline-none">
              <option>To Do</option>
              <option>On Progress</option>
              <option>Done</option>
            </select>
          </label>

          <label>
            <span className="text-sm font-medium">Deadline</span>
            <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} required
              className="mt-2 w-full bg-gray-900 px-3 py-2 rounded-md outline-none" />
          </label>
        </div>

        <label className="flex items-center gap-3 mb-3">
          <input type="checkbox" checked={isPrivate} onChange={() => setIsPrivate(!isPrivate)} className="h-4 w-4" />
          <span className="text-sm font-medium">Private</span>
        </label>

        <fieldset className="mb-4">
          <legend className="text-sm font-medium mb-2">Pilih anggota tugas</legend>
          <div className="flex flex-wrap gap-2">
            {allUsers.map((u) => {
              const active = members.includes(u.username);
              return (
                <button
                  type="button"
                  key={u.username}
                  onClick={() => toggleMember(u.username)}
                  className={`px-3 py-1 rounded-full text-sm ${active ? 'bg-indigo-600' : 'bg-gray-700 hover:bg-gray-600'}`}
                >
                  {u.username}
                </button>
              );
            })}
          </div>
        </fieldset>

        <div className="flex justify-end gap-3">
          <button type="button" onClick={onCancel} className="px-4 py-2 rounded-md bg-gray-700 hover:bg-gray-600">Cancel</button>
          <button type="submit" className="px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-500 font-semibold">Save</button>
        </div>
      </form>
    </div>
  );
}