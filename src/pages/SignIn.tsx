import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../hooks";
import { login } from "../app/features/auth/authSlice";
import "react-toastify/dist/ReactToastify.css";

type LoginFormInputs = {
  email: string;
  password: string;
};

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.auth); 
  // , error
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();

  const onSubmit = (data: LoginFormInputs) => {
    dispatch(login(data))
      .unwrap()
      .then(() => {
        toast.success("Successfully signed in! 🎉");
        navigate("/play-xiangqi");
      })
      .catch((err) => {
        console.error("Login failed:", err);
        toast.error(err || "Login failed");
      });
  };

  return (
    <div className="w-200 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-[#fffbf2] shadow-lg rounded-xl p-8">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Sign In
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              {...register("email", {
                // required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Invalid email format",
                },
              })}
              className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
              placeholder="you@gmail.com"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 8, message: "Min 8 characters" },
                })}
                className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none pr-10"
                placeholder="••••••••"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-3 flex items-center"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* {error && <p className="text-red-600 mt-2 text-center">{error}</p>} */}

        <div className="text-center mt-4 text-sm text-gray-600">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-red-600 hover:underline">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}
