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

// ✅ Get current user (check auth status)
export const getCurrentUser = createAsyncThunk(
  "auth/getCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const res = await API.get("/users/me"); // Endpoint to get current user info
      console.log("Current user response:", res.data);
      
      // Return user data from response
      if (res.data.user) {
        return res.data.user as User;
      } else if (res.data.data && res.data.data.user) {
        return res.data.data.user as User;
      } else if (res.data.id && res.data.email) {
        return res.data as User;
      }
      
      return null;
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error) || "Failed to get user info");
    }
  }
);

// ✅ Refresh Token
export const refreshToken = createAsyncThunk(
  "auth/refreshToken",
  async (_, { rejectWithValue }) => {
    try {
      const res = await API.post("/auth/refresh-token");
      console.log("Refresh token response:", res.data);
      
      // Return success message - actual tokens are in HTTP-only cookies
      return { message: "Token refreshed successfully" };
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error) || "Token refresh failed");
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

      // Get current user
      .addCase(getCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.user = null; // Clear user if auth check fails
      })

      // Refresh token
      .addCase(refreshToken.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(refreshToken.fulfilled, (state) => {
        state.loading = false;
        // Token refreshed successfully - no state changes needed as tokens are in cookies
      })
      .addCase(refreshToken.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.user = null; // Clear user if refresh fails
      })

      .addCase(logout.fulfilled, (state) => {
        state.user = null;
      });
  },
});

export const { resetAuthState } = authSlice.actions;
export default authSlice.reducer;
