const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

interface FetchOptions extends RequestInit {
  skipAuth?: boolean;
}

export async function apiCall<T = any>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { skipAuth = false, ...fetchOptions } = options;

  const url = `${API_URL}${endpoint}`;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(fetchOptions.headers as Record<string, string> || {}),
  };

  // Add JWT token if not skipped
  if (!skipAuth) {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  const response = await fetch(url, {
    ...fetchOptions,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || `API Error: ${response.status}`);
  }

  return response.json();
}

export const api = {
  auth: {
    register: (data: {
      first_name: string;
      middle_name?: string;
      last_name: string;
      year: number;
      department: string;
      phone: string;
      email: string;
      address: string;
      status?: string;
      password: string;
    }) => apiCall("/api/auth/register", { method: "POST", body: JSON.stringify(data), skipAuth: true }),

    login: (data: { email: string; password: string; role: "member" | "librarian" }) =>
      apiCall<{ token: string; user: { id: string; email: string; role: string } }>(
        "/api/auth/login",
        { method: "POST", body: JSON.stringify(data), skipAuth: true }
      ),
  },

  members: {
    list: () => apiCall("/api/members", { method: "GET" }),
    get: (id: string) => apiCall(`/api/members/${id}`, { method: "GET" }),
    create: (data: any) => apiCall("/api/members", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: any) =>
      apiCall(`/api/members/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    delete: (id: string) => apiCall(`/api/members/${id}`, { method: "DELETE" }),
  },

  books: {
    list: () => apiCall("/api/books", { method: "GET" }),
    get: (id: string) => apiCall(`/api/books/${id}`, { method: "GET" }),
    create: (data: any) => apiCall("/api/books", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: any) =>
      apiCall(`/api/books/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    delete: (id: string) => apiCall(`/api/books/${id}`, { method: "DELETE" }),
  },

  authors: {
    list: () => apiCall("/api/authors", { method: "GET" }),
    get: (id: string) => apiCall(`/api/authors/${id}`, { method: "GET" }),
    create: (data: any) => apiCall("/api/authors", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: any) =>
      apiCall(`/api/authors/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    delete: (id: string) => apiCall(`/api/authors/${id}`, { method: "DELETE" }),
  },

  publishers: {
    list: () => apiCall("/api/publishers", { method: "GET" }),
    get: (id: string) => apiCall(`/api/publishers/${id}`, { method: "GET" }),
    create: (data: any) => apiCall("/api/publishers", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: any) =>
      apiCall(`/api/publishers/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    delete: (id: string) => apiCall(`/api/publishers/${id}`, { method: "DELETE" }),
  },

  borrows: {
    list: () => apiCall("/api/borrows", { method: "GET" }),
    get: (id: string) => apiCall(`/api/borrows/${id}`, { method: "GET" }),
    create: (data: any) => apiCall("/api/borrows", { method: "POST", body: JSON.stringify(data) }),
    return: (id: string, data?: any) => apiCall(`/api/borrows/${id}/return`, { method: "POST", body: JSON.stringify(data || {}) }),
    update: (id: string, data: any) =>
      apiCall(`/api/borrows/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    delete: (id: string) => apiCall(`/api/borrows/${id}`, { method: "DELETE" }),
  },

  librarians: {
    list: () => apiCall("/api/librarians", { method: "GET" }),
    get: (id: string) => apiCall(`/api/librarians/${id}`, { method: "GET" }),
    create: (data: any) => apiCall("/api/librarians", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: any) =>
      apiCall(`/api/librarians/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    delete: (id: string) => apiCall(`/api/librarians/${id}`, { method: "DELETE" }),
  },
};
