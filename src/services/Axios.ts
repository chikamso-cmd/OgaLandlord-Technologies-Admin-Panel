import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
  withCredentials: true,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});
console.log(api.defaults.baseURL);

export default api;

// request interceptors
// api.interceptors.request.use(
//   (config) => {
//     // Get token from localStorage
//     const token = localStorage.getItem("token");

//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }

//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    // If sending FormData, remove Content-Type header so browser sets it with proper boundary
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

const isAuthRequest = (url?: string) =>
  typeof url === "string" &&
  (url.includes("auth/login") || url.includes("auth/refresh"));

const redirectToLogin = () => {
  const user = localStorage.getItem("user");
  const userRole = user ? JSON.parse(user).role : null;
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  const loginUrl = userRole === "agent" ? "/agent/login" : "/tenant/login";
  if (!window.location.pathname.includes("/login")) {
    window.location.href = loginUrl;
  }
};

// response interceptors
// api.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   (error) => {
//     // Handle common errors globally
//     if (error.response) {
//       const { status } = error.response;

//       if (status === 401) {
//         console.log("Unauthorized - redirect to login");
//         //  logout user
//         window.location.href = "/login";
//       }

//       if (status === 403) {
//         console.log("Forbidden - no permission");
//       }

//       if (status === 500) {
//         console.log("Server error");
//       }
//     } else {
//       console.log("Network error");
//     }

//     return Promise.reject(error);
//   },
// );

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && isAuthRequest(originalRequest?.url)) {
      return Promise.reject(error);
    }

    if (error.response?.status !== 401 || originalRequest?._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;
    if (!originalRequest.headers) {
      originalRequest.headers = {};
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    isRefreshing = true;

    try {
      const res = await api.post("/auth/refresh");
      const newAccessToken = res.data.accessToken;
      localStorage.setItem("token", newAccessToken);
      api.defaults.headers.Authorization = `Bearer ${newAccessToken}`;
      processQueue(null, newAccessToken);
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return api(originalRequest);
    } catch (err) {
      processQueue(err, null);
      redirectToLogin();
      return Promise.reject(error);
    } finally {
      isRefreshing = false;
    }
  },
);

interface LoginResponse {
  email: string;
  password: string;
}
type agentSignInPayload = {
  name: string;
  phoneNo: string;
  email: string;
  password: string;
  confirmPassword: string;
  // idType:string;
  // idNo:string
};
type userSignInPayload = {
  name: string;
  phoneNo: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const SigninAgent: () => Promise<LoginResponse> = async () => {
  const payload = {
    email: "email",
    password: "password",
  };
  try {
    const response = await api.post(`/agent/auth/login`, payload);
    return response.data;
  } catch (error: string | any) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || "login failed");
    }
    console.error(
      "login error:",
      error.response?.data || error?.message || error,
    );
    throw error;
  }
};

export { SigninAgent };

// create customer
const AgentSignup = async (payload: agentSignInPayload) => {
  try {
    const response = await api.post(`/agent/auth/signup`, payload);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || "signup failed");
    }
    console.error(
      " error creating agent:",
      error.response?.data || error?.message || error,
    );
    throw error;
  }
};
export { AgentSignup };

// user signup
const userSignup = async (payload: userSignInPayload) => {
  try {
    const response = await api.post(`/auth/signup`, payload);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || "signup failed");
    }
    console.error(
      " error creating agent:",
      error.response?.data || error?.message || error,
    );
    throw error;
  }
};
export { userSignup };

// signup tenant
const SigninUser = async (payload: LoginResponse) => {
  try {
    const response = await api.post(`/auth/login`, payload);
    return response.data;
  } catch (error: string | any) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || "login failed");
    }
    console.error(
      "login error:",
      error.response?.data || error?.message || error,
    );
    throw error;
  }
};

export { SigninUser };

const requestPasswordReset = async (payload: { email: string }) => {
  try {
    const response = await api.post(`/auth/forgot-password`, payload);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Password reset request failed",
    );
  }
};

const resetPassword = async (payload: {
  token: string | null;
  password: string;
  confirmPassword: string;
}) => {
  try {
    const response = await api.post(`/auth/reset-password`, payload);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Password reset failed");
  }
};

export { requestPasswordReset, resetPassword };

// create customer
const VerifyOTP = async (payload: { email: "email"; otp: "code" }) => {
  // const payload = {};
  try {
    const response = await api.post(`/auth/verify-otp`, payload);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || "verification failed");
    }
    console.error(
      " error failed to verify email:",
      error.response?.data || error?.message || error,
    );
    throw error;
  }
};
export { VerifyOTP };
