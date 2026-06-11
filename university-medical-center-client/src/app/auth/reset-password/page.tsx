"use client"

import { useState, Suspense } from "react"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
import { resetPassword } from "@/services/auth.service"

type Status = "idle" | "loading" | "success" | "error"

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token") ?? ""

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string }>({})
  const [serverMessage, setServerMessage] = useState("")
  const [status, setStatus] = useState<Status>("idle")

  function validate(): boolean {
    const newErrors: { password?: string; confirmPassword?: string } = {}
    if (!password) {
      newErrors.password = "Password is required"
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
    }
    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password"
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    if (!token) {
      setServerMessage("Invalid or missing reset token. Please request a new reset link.")
      setStatus("error")
      return
    }
    setStatus("loading")
    setServerMessage("")
    try {
      const { data, error } = await resetPassword({
  token,
  newPassword: password,
})
      if (error || !data) {
        setServerMessage(error || "Failed to reset password. Please try again.")
        setStatus("error")
        return
      }
      setStatus("success")
      setTimeout(() => router.push("/auth/login"), 2500)
    } catch {
      setServerMessage("Network error. Please try again.")
      setStatus("error")
    }
  }

  if (!token) {
    return (
      <div className="text-center space-y-4">
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-4">
          <p className="text-sm text-red-700 font-medium">No reset token found.</p>
          <p className="text-xs text-red-600 mt-1">Please request a new password reset link.</p>
        </div>
        <Link href="/auth/forgot-password" className="inline-block text-sm font-medium text-blue-600 hover:underline">
          Request a new link
        </Link>
      </div>
    )
  }

  if (status === "success") {
    return (
      <div className="text-center space-y-4">
        <div className="rounded-lg bg-green-50 border border-green-200 px-4 py-4">
          <svg className="w-8 h-8 text-green-500 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm text-green-700 font-medium">Password reset successfully!</p>
          <p className="text-xs text-green-600 mt-1">Redirecting you to sign in…</p>
        </div>
        <Link href="/auth/login" className="inline-block text-sm font-medium text-blue-600 hover:underline">
          Go to sign in →
        </Link>
      </div>
    )
  }

  return (
    <>
      {status === "error" && serverMessage && (
        <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {serverMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        {/* New Password */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            New password
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setErrors((prev) => ({ ...prev, password: undefined }))
              }}
              placeholder="Min. 8 characters"
              className={`w-full rounded-lg border px-3 py-2.5 pr-10 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.password ? "border-red-400 bg-red-50" : "border-gray-300 bg-white"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
              tabIndex={-1}
            >
              <EyeIcon open={showPassword} />
            </button>
          </div>
          {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
        </div>

        {/* Confirm Password */}
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
            Confirm new password
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirm ? "text" : "password"}
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value)
                setErrors((prev) => ({ ...prev, confirmPassword: undefined }))
              }}
              placeholder="Re-enter new password"
              className={`w-full rounded-lg border px-3 py-2.5 pr-10 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.confirmPassword ? "border-red-400 bg-red-50" : "border-gray-300 bg-white"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirm((v) => !v)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
              tabIndex={-1}
            >
              <EyeIcon open={showConfirm} />
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="mt-1 text-xs text-red-600">{errors.confirmPassword}</p>
          )}
        </div>

        {/* Password strength hint */}
        <ul className="text-xs text-gray-400 space-y-0.5 list-disc list-inside">
          <li className={password.length >= 8 ? "text-green-600" : ""}>At least 8 characters</li>
          <li className={/[A-Z]/.test(password) ? "text-green-600" : ""}>One uppercase letter</li>
          <li className={/[0-9]/.test(password) ? "text-green-600" : ""}>One number</li>
        </ul>

        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {status === "loading" ? "Resetting…" : "Reset password"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        <Link href="/auth/login" className="font-medium text-blue-600 hover:underline">
          ← Back to sign in
        </Link>
      </p>
    </>
  )
}

export default function ResetPasswordPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-blue-100 mb-4">
            <svg className="w-7 h-7 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Set new password</h1>
          <p className="text-sm text-gray-500 mt-1">Choose a strong password for your account.</p>
        </div>

        {/* useSearchParams must be wrapped in Suspense */}
        <Suspense fallback={<p className="text-center text-sm text-gray-400">Loading…</p>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </main>
  )
}

// ── Tiny inline icon component ─────────────────────────────────────────────────
function EyeIcon({ open }: { open: boolean }) {
  if (open) {
    return (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9-4-9-7s4-7 9-7c1.07 0 2.1.18 3.06.51M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" />
      </svg>
    )
  }
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  )
}
