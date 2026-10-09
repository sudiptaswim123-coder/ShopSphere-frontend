const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export async function apiRequest(path, options = {}) {
  const { headers, ...requestOptions } = options;
  const response = await fetch(`${API_URL}${path}`, {
    ...requestOptions,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  });
  const data = await response.json().catch(() => ({}));

  if (response.status === 401 && typeof window !== "undefined") {
    window.dispatchEvent(new Event("shopsphere:unauthorized"));
  }

  if (!response.ok) {
    throw new Error(data.message || "Request failed.");
  }

  return data;
}