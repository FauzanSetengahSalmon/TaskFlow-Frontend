// === utils/config.js ===
// Sesuaikan jika Apache XAMPP pakai port lain (mis. 8080)
export const API_BASE_URL = "http://192.168.137.1/taskflow-backend/api";

export const API_ENDPOINTS = {
  // Auth
  login: `${API_BASE_URL}/auth/login.php`,
  logout: `${API_BASE_URL}/auth/logout.php`,

  // Projects
  projects: `${API_BASE_URL}/projects/index.php`,
  projectDetail: (id) => `${API_BASE_URL}/projects/detail.php?id=${id}`,
  projectMembers: (id) => `${API_BASE_URL}/projects/members.php?id=${id}`,
  projectInvite: `${API_BASE_URL}/projects/invite.php`,

  // Tasks
  tasks: `${API_BASE_URL}/tasks/index.php`,
  taskDetail: (id) => `${API_BASE_URL}/tasks/detail.php?id=${id}`,

  // Public
  publicProjects: `${API_BASE_URL}/public/projects.php`,
  publicTasks: (projectId) => `${API_BASE_URL}/public/tasks.php?project_id=${projectId}`,
  publicTaskDetail: (id) => `${API_BASE_URL}/public/task_detail.php?id=${id}`,
};