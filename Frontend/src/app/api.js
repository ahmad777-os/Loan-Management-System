import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error) => {
  failedQueue.forEach((prom) =>
    error ? prom.reject(error) : prom.resolve()
  );
  failedQueue = [];
};

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;

    if (
      error.response?.status === 401 &&
      error.response?.data?.code === "TOKEN_EXPIRED" &&
      !original._retry
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => api(original))
          .catch((err) => Promise.reject(err));
      }

      original._retry = true;
      isRefreshing = true;

      try {
        await api.post("/auth/refresh");
        processQueue(null);
        return api(original);
      } catch (err) {
        processQueue(err);
        window.location.href = "/login";
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export const authService = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  logout: () => api.post("/auth/logout"),
  getMe: () => api.get("/auth/me"),
  changePassword: (data) => api.put("/auth/change-password", data),
};

export const applicantService = {
  register: (data) => api.post("/applicants/register", data),
  getMyProfile: () => api.get("/applicants/me"),
  getAll: (params) => api.get("/applicants/all", { params }),
  getById: (id) => api.get(`/applicants/${id}`),
  update: (id, data) => api.patch(`/applicants/${id}`, data),
};

export const loanService = {
  apply: (data) => api.post("/loans/apply", data),
  getMyLoans: (params) => api.get("/loans/my", { params }),
  getAll: (params) => api.get("/loans/all", { params }),
  getPending: (params) => api.get("/loans/pending", { params }),
  getStats: () => api.get("/loans/stats"),
  getById: (id) => api.get(`/loans/${id}`),
  evaluateEligibility: (id) => api.get(`/loans/eligibility/${id}`),
  updateStatus: (id, data) => api.patch(`/loans/status/${id}`, data),
  downloadApprovalLetter: (id) =>
    api.get(`/loans/approval-letter/${id}`, { responseType: "blob" }),
};

export const adminService = {
  getDashboard: () => api.get("/admin/dashboard"),
  createOfficer: (data) => api.post("/admin/officers", data),
  getOfficers: () => api.get("/admin/officers"),
  toggleUserStatus: (id, data) => api.patch(`/admin/users/${id}/status`, data),
  updateUserFinancials: (id, data) =>
    api.patch(`/admin/users/${id}/financials`, data),
  getAuditLogs: (params) => api.get("/admin/audit-logs", { params }),
};

export const installmentService = {
  getMy: () => api.get("/installments/my"),
  getByLoan: (loanId) => api.get(`/installments/${loanId}`),
  markPaid: (id) => api.put(`/installments/pay/${id}`),
  getOverdue: () => api.get("/installments/overdue/all"),
};

export const notificationService = {
  getAll: (params) => api.get("/notifications", { params }),
  markRead: (id) => api.patch(`/notifications/${id}/read`),
  markAllRead: () => api.patch("/notifications/read-all"),
  delete: (id) => api.delete(`/notifications/${id}`),
};

export default api;