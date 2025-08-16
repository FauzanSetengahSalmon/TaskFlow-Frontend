// === utils/api.js ===
/**
 * Helper HTTP minimalis berbasis fetch.
 * - Auto attach Authorization: Bearer <token> jika ada di localStorage.
 * - Lempar error jika response bukan 2xx, tapi tetap kembalikan JSON jika ada.
 */

async function request(method, url, body, extraHeaders = {}) {
  const headers = { "Content-Type": "application/json", ...extraHeaders };
  const token = localStorage.getItem("token");
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    credentials: "omit",
    mode: "cors",
  });

  let data = null;
  try { data = await res.json(); } catch (_) { /* ignore */ }

  if (!res.ok) {
    const message = (data && (data.message || data.error)) || `HTTP ${res.status}`;
    const err = new Error(message);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

export const apiGet = (url) => request("GET", url);
export const apiPost = (url, body) => request("POST", url, body);
export const apiPut = (url, body) => request("PUT", url, body);
export const apiDelete = (url) => request("DELETE", url);