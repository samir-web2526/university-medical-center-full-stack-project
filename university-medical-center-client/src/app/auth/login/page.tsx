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

export default function LoginPage() {
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

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      {/* Card with background image */}
      <div className="relative w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden">
        <Image
          src={bgImage}
          alt=""
          fill
          className="object-cover scale-150"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />

        {/* Form content */}
        <div className="relative z-10 p-10">
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm mb-4">
              <Image src={logo} alt="UMC Logo" width={40} height={40} className="rounded-lg" />
            </div>
            <h1 className="text-2xl font-bold text-white">Welcome back</h1>
            <p className="text-sm text-white/70 mt-1">Sign in to your UMC account</p>
          </div>

        {serverError && (
          <div className="mb-4 rounded-lg bg-red-500/20 backdrop-blur-sm border border-red-300/30 px-4 py-3 text-sm text-red-100">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-1">
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
              className={`w-full rounded-lg border px-3 py-2.5 text-sm text-white placeholder-white/40 outline-none transition focus:ring-2 focus:ring-white/50 bg-white/10 border-white/20 ${
                errors.email ? "ring-2 ring-red-400 border-red-400" : ""
              }`}
            />
            {errors.email && <p className="mt-1 text-xs text-red-300">{errors.email}</p>}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="password" className="block text-sm font-medium text-white/80">
                Password
              </label>
              <Link href="/auth/forgot-password" className="text-xs text-white/60 hover:text-white/80 hover:underline">
                Forgot password?
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
                placeholder="••••••••"
                className={`w-full rounded-lg border px-3 py-2.5 pr-10 text-sm text-white placeholder-white/40 outline-none transition focus:ring-2 focus:ring-white/50 bg-white/10 border-white/20 ${
                  errors.password ? "ring-2 ring-red-400 border-red-400" : ""
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute inset-y-0 right-3 flex items-center text-white/50 hover:text-white/80"
                tabIndex={-1}
              >
                {showPassword ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9-4-9-7s4-7 9-7c1.07 0 2.1.18 3.06.51M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
            {errors.password && <p className="mt-1 text-xs text-red-300">{errors.password}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-[#0b5394] hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-white/60">
          Don&apos;t have an account?{" "}
          <Link href="/auth/register" className="font-medium text-white hover:underline">
            Create one
          </Link>
        </p>

        <div className="mt-4 pt-4 border-t border-white/10 text-center">
          <Link href="/" className="text-xs text-white/50 hover:text-white/80 hover:underline">
            ← Back to Home
          </Link>
        </div>
        </div>
      </div>
    </main>
  )
}
