// src/app/features/auth/authSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api";

export interface User {
  id: string;
  username: string;
  email: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

// Describing the structure of possible API error responses
interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
    status?: number;
  };
  message?: string;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
};

const getErrorMessage = (error: unknown): string => {
  if (error && typeof error === "object" && "response" in error) {
    const apiError = error as ApiError;
    return apiError.response?.data?.message || "An error occurred";
  }
  if (error && typeof error === "object" && "message" in error) {
    return (error as { message: string }).message; // Extract message from Error object
  }
  if (typeof error === "string") {
    return error;
  }
  return "An unexpected error occurred";
};

// ✅ Signup
export const signup = createAsyncThunk(
  "auth/signup",
  async (
    {
      username,
      email,
      password,
      passwordConfirm,
    }: { username: string; email: string; password: string; passwordConfirm: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await API.post("/auth/signup", {
        username,
        email,
        password,
        passwordConfirm,
      });

      console.log("Signup response:", res.data);
      
      // Check if it's a duplicate email error
      if (res.data.message && res.data.message.toLowerCase().includes("user already exists")) {
        return rejectWithValue("User with this email already exists");
      }
      
      // Server sends JWT in cookie, just return success message
      return { message: "Signup successful", token: res.data.token };
    } catch (error: unknown) {
      console.log("Signup error:", error);
      
      // Check if it's a duplicate email error
      if (error && typeof error === "object" && "response" in error) {
        const apiError = error as ApiError;
        if (apiError.response?.status === 400 || apiError.response?.status === 409) {
          const message = apiError.response.data?.message || "";
          if (message.toLowerCase().includes("email") && 
              (message.toLowerCase().includes("exists") || 
               message.toLowerCase().includes("already") ||
               message.toLowerCase().includes("taken"))) {
            return rejectWithValue("User with this email already exists");
          }
        }
      }
      
      return rejectWithValue(getErrorMessage(error) || "Signup failed");
    }
  }
);

// ✅ Login
export const login = createAsyncThunk(
  "auth/login",
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await API.post("/auth/login", { email, password });
      console.log("Login response:", res.data);
      
      // Server sends JWT in cookie, just return success message
      return { message: "Login successful", token: res.data.token };
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error) || "Login failed");
    }
  }
);

// ✔ Logout
export const logout = createAsyncThunk("auth/logout", async (_, { rejectWithValue }) => {
  try {
    await API.post("/auth/logout");
    return null;
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error) || "Logout failed");
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetAuthState: (state) => {
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state) => {
        state.loading = false;
        // For signup, we don't set user data since JWT is in cookie
        // User will be null until they make an authenticated request or login
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state) => {
        state.loading = false;
        // For login, we don't set user data since JWT is in cookie
        // User will be null until they make an authenticated request
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(logout.fulfilled, (state) => {
        state.user = null;
      });
  },
});

export const { resetAuthState } = authSlice.actions;
export default authSlice.reducer;
