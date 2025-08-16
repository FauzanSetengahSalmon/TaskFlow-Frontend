import React, { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../utils/config'; // pastikan path sesuai
import { apiPost  } from '../utils/api'; // helper POST

export default function ProjectForm({ project, onSave, onCancel }) {
  const [title, setTitle] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (project) {
      setTitle(project.title || '');
      setIsPrivate(project.isPrivate === 1 || project.isPrivate === true);
    } else {
      setTitle('');
      setIsPrivate(false);
    }
  }, [project]);

  const submit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Judul project wajib diisi');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        title: title.trim(),
        isPrivate: isPrivate ? 1 : 0,
      };

      let res;
      if (project?.id) {
        // Edit project
        res = await apiPost(`${API_ENDPOINTS.projects}/${project.id}`, payload, 'PUT');
      } else {
        // Tambah project baru
        res = await apiPost(API_ENDPOINTS.projects, payload, 'POST');
      }

      if (res.success) {
        onSave(res.data); // update di frontend
        onCancel(); // tutup form
      } else {
        alert(res.message || 'Gagal menyimpan project');
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan koneksi ke server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <form
        onSubmit={submit}
        className="w-full max-w-lg bg-gray-800 rounded-2xl p-6 shadow-lg text-gray-100"
      >
        <h3 className="text-2xl font-bold mb-4">
          {project ? 'Edit Project' : 'Tambah Project'}
        </h3>

        <label className="block mb-3">
          <span className="text-sm font-medium">Judul Project</span>
          <input
            className="mt-2 w-full bg-gray-900 px-3 py-2 rounded-md outline-none focus:ring-2 focus:ring-indigo-500"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            autoFocus
          />
        </label>

        <label className="flex items-center gap-3 mb-4">
          <input
            type="checkbox"
            checked={isPrivate}
            onChange={(e) => setIsPrivate(e.target.checked)}
            className="h-4 w-4 rounded text-indigo-600"
          />
          <span className="text-sm">Private Project (hanya owner & anggota)</span>
        </label>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-md bg-gray-700 hover:bg-gray-600"
            disabled={loading}
          >
            Batal
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-500 font-semibold"
            disabled={loading}
          >
            {loading ? 'Menyimpan...' : 'Simpan'}
          </button>
        </div>
      </form>
    </div>
  );
}