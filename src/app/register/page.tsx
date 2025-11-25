"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Leaf, ArrowRight, Heart, Check, Users } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [formError, setFormError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setFormError("");

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setFormError("Passwords do not match.");
      setIsLoading(false);
      return;
    }

    // Validate password strength
    if (formData.password.length < 6) {
      setFormError("Password must be at least 6 characters.");
      setIsLoading(false);
      return;
    }

    try {
      // TODO: Replace with actual API call when backend is ready
      // For now, simulate registration success
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      setSuccess(true);
      setTimeout(() => {
        router.push("/login?registered=true");
      }, 2000);
    } catch (err) {
      setFormError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6" style={{ background: 'linear-gradient(to bottom right, var(--sage-100), var(--cream-100), var(--rose-100))' }}>
        <div className="w-20 h-20 rounded-full bg-sage-500 flex items-center justify-center mb-4 animate-bounce">
          <Check className="w-10 h-10 text-white" />
        </div>
        <h1
          className="text-2xl font-medium text-forest-900 mb-2"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          Welcome to ThriveMenu!
        </h1>
        <p className="text-gray-600">
          Redirecting you to sign in...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(to bottom right, var(--sage-100), var(--cream-100), var(--rose-100))' }}>
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-32 h-32 bg-sage-200 rounded-full opacity-40 blur-3xl" />
        <div className="absolute bottom-40 left-10 w-40 h-40 bg-rose-200 rounded-full opacity-40 blur-3xl" />
        <div className="absolute top-1/3 left-1/4 w-48 h-48 bg-terracotta-100 rounded-full opacity-20 blur-3xl" />
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
              Join ThriveMenu
            </h1>
            <p className="text-gray-600">
              Start your journey to healthier, happier meals
            </p>
          </div>

          {/* Error Message */}
          {formError && (
            <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-300 text-rose-700 text-sm">
              {formError}
            </div>
          )}

          {/* Register Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/50">
              {/* Name Field */}
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-forest-700 mb-1.5"
                >
                  Your name
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-sage-400 focus:border-transparent transition-all text-gray-900"
                  placeholder="Christine"
                />
              </div>

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
                  placeholder="your@email.com"
                />
              </div>

              {/* Password Field */}
              <div className="mb-4">
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
                    placeholder="At least 6 characters"
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

              {/* Confirm Password Field */}
              <div className="mb-6">
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-forest-700 mb-1.5"
                >
                  Confirm password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({ ...formData, confirmPassword: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-sage-400 focus:border-transparent transition-all text-gray-900"
                  placeholder="••••••••"
                />
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
                    Create account
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Login Link */}
          <p className="text-center mt-6 text-gray-600">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-sage-600 font-medium hover:text-sage-700 transition-colors"
            >
              Sign in
            </Link>
          </p>

          {/* Features Preview */}
          <div className="mt-8 grid grid-cols-3 gap-3">
            <div className="text-center p-3 rounded-xl bg-white/50">
              <Leaf className="w-6 h-6 text-sage-600 mx-auto mb-1" />
              <p className="text-xs text-gray-600">240+ Recipes</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-white/50">
              <Heart className="w-6 h-6 text-rose-500 mx-auto mb-1" />
              <p className="text-xs text-gray-600">Health Focused</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-white/50">
              <Users className="w-6 h-6 text-sage-600 mx-auto mb-1" />
              <p className="text-xs text-gray-600">Family Friendly</p>
            </div>
          </div>

          {/* Quote */}
          <div className="mt-8 text-center">
            <p
              className="text-sm text-gray-500 italic"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              &quot;Food is the foundation of true health&quot;
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

