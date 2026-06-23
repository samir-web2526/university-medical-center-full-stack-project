"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { login } from "@/services/auth.service"
import Image from "next/image"
import logo from "@/assets/images/logo.png"
import bgImage from "@/assets/images/login1.jpg"

type FormState = {
  email: string
  password: string
}

type FieldErrors = Partial<Record<keyof FormState, string>>

export default function LoginPageClient() {
  const router = useRouter()

  const [form, setForm] = useState<FormState>({ email: "", password: "" })
  const [errors, setErrors] = useState<FieldErrors>({})
  const [serverError, setServerError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  function validate(): boolean {
    const newErrors: FieldErrors = {}
    if (!form.email) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Enter a valid email address"
    }
    if (!form.password) {
      newErrors.password = "Password is required"
    } else if (form.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setServerError("")
    if (!validate()) return
    setLoading(true)
    try {
      const { data, error } = await login({ email: form.email, password: form.password })
      if (error || !data) {
        setServerError(error || "Login failed. Please try again.")
        return
      }
      router.push("/dashboard")
    } catch {
      setServerError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setErrors((prev) => ({ ...prev, [e.target.name]: undefined }))
  }

  async function handleDummyLogin(role: "ADMIN" | "DOCTOR" | "STUDENT") {
    setServerError("")
    setLoading(true)
    const credentials = {
      ADMIN: { email: "admin@gmail.com", password: "admin123" },
      DOCTOR: { email: "nilima@gmail.com", password: "doctor@123" },
      STUDENT: { email: "samir@gmail.com", password: "samir123" },
    }
    try {
      const { data, error } = await login(credentials[role])
      if (error || !data) {
        setServerError(error || "Login failed. Please try again.")
        return
      }
      router.push("/dashboard")
    } catch {
      setServerError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .anim-fade-up { animation: fadeInUp 0.4s ease-out both; }
        .anim-d1 { animation-delay: 0.05s; }
        .anim-d2 { animation-delay: 0.1s; }
        .anim-d3 { animation-delay: 0.15s; }
        .anim-d4 { animation-delay: 0.2s; }
        .anim-d5 { animation-delay: 0.25s; }
        .input-medical {
          transition: all 0.2s ease;
          border: 1.5px solid #e2e8f0;
          background: #f8fafc;
        }
        .input-medical:focus {
          border-color: #0891b2;
          background: #fff;
          box-shadow: 0 0 0 3px rgba(8, 145, 178, 0.08);
        }
        .btn-medical {
          background: linear-gradient(135deg, #0891b2, #0e7490);
          transition: all 0.25s ease;
        }
        .btn-medical:hover {
          background: linear-gradient(135deg, #0e7490, #155e75);
          box-shadow: 0 4px 16px rgba(8, 145, 178, 0.3);
        }
        .btn-medical:active { transform: scale(0.98); }
        .dummy-btn {
          transition: all 0.25s ease;
          border: 1.5px solid transparent;
        }
        .dummy-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        .dummy-btn:active { transform: scale(0.97); }
      `}</style>

      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-cyan-50/30 to-gray-50 px-4 py-10">
        <div className="w-full max-w-sm">
          {/* Logo + Title */}
          <div className="text-center mb-8 anim-fade-up">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-cyan-50 border border-cyan-100 mb-4">
              <Image src={logo} alt="UMC Logo" width={36} height={36} className="rounded-lg" />
            </div>
            <h1 className="text-xl font-bold text-gray-800">Welcome back</h1>
            <p className="text-sm text-gray-500 mt-1">Sign in to your UMC account</p>
          </div>

          {/* Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 anim-fade-up anim-d1">
            {/* Error */}
            {serverError && (
              <div className="mb-4 rounded-lg bg-red-50 border border-red-100 px-3 py-2.5 text-sm text-red-600">
                {serverError}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              {/* Email */}
              <div className="anim-fade-up anim-d2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@university.edu"
                  className={`input-medical w-full rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 outline-none ${
                    errors.email ? "!border-red-400 !bg-red-50" : ""
                  }`}
                />
                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
              </div>

              {/* Password */}
              <div className="anim-fade-up anim-d3">
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="password" className="text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <Link href="/auth/forgot-password" className="text-xs text-cyan-600 hover:text-cyan-700">
                    Forgot?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Min 8 characters"
                    className={`input-medical w-full rounded-xl px-4 py-2.5 pr-11 text-sm text-gray-800 placeholder-gray-400 outline-none ${
                      errors.password ? "!border-red-400 !bg-red-50" : ""
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9-4-9-7s4-7 9-7c1.07 0 2.1.18 3.06.51M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
              </div>

              {/* Submit */}
              <div className="pt-1 anim-fade-up anim-d4">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-medical w-full rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Signing in...
                    </span>
                  ) : (
                    "Sign in"
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Dummy Login Buttons */}
          <div className="mt-4 bg-white rounded-2xl shadow-sm border border-gray-100 p-4 anim-fade-up anim-d5">
            <p className="text-xs text-gray-400 text-center mb-3 uppercase tracking-wider font-medium">Quick Login (Dev)</p>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleDummyLogin("ADMIN")}
                disabled={loading}
                className="dummy-btn rounded-xl px-3 py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-red-500 to-rose-500 disabled:opacity-50"
              >
                Admin
              </button>
              <button
                onClick={() => handleDummyLogin("DOCTOR")}
                disabled={loading}
                className="dummy-btn rounded-xl px-3 py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-500 disabled:opacity-50"
              >
                Doctor
              </button>
              <button
                onClick={() => handleDummyLogin("STUDENT")}
                disabled={loading}
                className="dummy-btn rounded-xl px-3 py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-500 disabled:opacity-50"
              >
                Student
              </button>
            </div>
          </div>

          {/* Footer */}
          <p className="mt-5 text-center text-sm text-gray-500 anim-fade-up anim-d5">
            Don&apos;t have an account?{" "}
            <Link href="/auth/register" className="font-medium text-cyan-600 hover:text-cyan-700">
              Create one
            </Link>
          </p>

          <div className="mt-4 text-center anim-fade-up anim-d5">
            <Link href="/" className="text-xs text-gray-400 hover:text-cyan-600 transition-colors inline-flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}
