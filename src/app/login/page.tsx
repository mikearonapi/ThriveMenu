"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Leaf, ArrowRight, Heart } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || searchParams.get("redirect") || "/";
  const error = searchParams.get("error");
  const registered = searchParams.get("registered");
  
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [formError, setFormError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setFormError("");

    try {
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setFormError("Invalid email or password. Please try again.");
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err) {
      setFormError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(to bottom right, var(--sage-100), var(--cream-100), var(--rose-100))' }}>
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-sage-200 rounded-full opacity-40 blur-3xl" />
        <div className="absolute bottom-40 right-10 w-40 h-40 bg-rose-200 rounded-full opacity-40 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-terracotta-100 rounded-full opacity-20 blur-3xl" />
      </div>

      <div className="flex-1 flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-md">
          {/* Logo & Welcome */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-sage-500 mb-4 shadow-lg">
              <Leaf className="w-8 h-8 text-white" />
            </div>
            <h1
              className="text-3xl font-medium text-forest-900 mb-2"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Welcome back
            </h1>
            <p className="text-gray-600">
              Sign in to continue your nourishing journey
            </p>
          </div>

          {/* Success Message */}
          {registered && (
            <div className="mb-6 p-4 rounded-xl bg-sage-50 border border-sage-300 text-sage-700 text-sm">
              Account created successfully! Please sign in with your email and password.
            </div>
          )}

          {/* Error Message */}
          {(error || formError) && (
            <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-300 text-rose-700 text-sm">
              {formError || "There was a problem signing in. Please try again."}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/50">
              {/* Email Field */}
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-forest-700 mb-1.5"
                >
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-sage-400 focus:border-transparent transition-all text-gray-900"
                  placeholder="christine@example.com"
                />
              </div>

              {/* Password Field */}
              <div className="mb-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-forest-700 mb-1.5"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-sage-400 focus:border-transparent transition-all text-gray-900"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Forgot Password */}
              <div className="text-right mb-6">
                <Link
                  href="/forgot-password"
                  className="text-sm text-sage-600 hover:text-sage-700 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-xl bg-sage-500 text-white font-medium flex items-center justify-center gap-2 hover:bg-sage-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-sage-500/25"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Sign in
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Demo Account Info */}
          <div className="mt-6 p-4 rounded-xl bg-sage-50 border border-sage-200">
            <p className="text-sm text-forest-700 font-medium mb-1">
              Demo Account
            </p>
            <p className="text-xs text-gray-600">
              Email: <span className="font-mono">christine@thrivemenu.com</span>
              <br />
              Password: <span className="font-mono">thrive123</span>
            </p>
          </div>

          {/* Register Link */}
          <p className="text-center mt-6 text-gray-600">
            New to ThriveMenu?{" "}
            <Link
              href="/register"
              className="text-sage-600 font-medium hover:text-sage-700 transition-colors"
            >
              Create an account
            </Link>
          </p>

          {/* Quote */}
          <div className="mt-8 text-center">
            <p
              className="text-sm text-gray-500 italic"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              &quot;Nourishing your family, one meal at a time&quot;
            </p>
            <div className="flex items-center justify-center gap-1 mt-2 text-terracotta-400">
              <Heart className="w-4 h-4 fill-current" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

