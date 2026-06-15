"use client"

import { useState } from "react"
import Link from "next/link"
import { forgotPassword } from "@/services/auth.service"

type Status = "idle" | "loading" | "success" | "error"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [emailError, setEmailError] = useState("")
  const [serverMessage, setServerMessage] = useState("")
  const [status, setStatus] = useState<Status>("idle")

  function validate(): boolean {
    if (!email) {
      setEmailError("Email is required")
      return false
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Enter a valid email address")
      return false
    }
    setEmailError("")
    return true
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setStatus("loading")
    setServerMessage("")
    try {
      const { data, error } = await forgotPassword({ email })
      if (error || !data) {
        setServerMessage(error || "Something went wrong. Please try again.")
        setStatus("error")
        return
      }
      setServerMessage(data.message || "Reset link sent! Check your email.")
      setStatus("success")
    } catch {
      setServerMessage("Network error. Please try again.")
      setStatus("error")
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-yellow-100 mb-4">
            <svg className="w-7 h-7 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Forgot your password?</h1>
          <p className="text-sm text-gray-500 mt-1">
            Enter your email and we&apos;ll send you a reset link.
          </p>
        </div>

        {status === "success" ? (
          <div className="text-center space-y-4">
            <div className="rounded-lg bg-green-50 border border-green-200 px-4 py-4">
              <svg
                className="w-8 h-8 text-green-500 mx-auto mb-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-green-700 font-medium">{serverMessage}</p>
              <p className="text-xs text-green-600 mt-1">
                Didn&apos;t receive it? Check your spam folder.
              </p>
            </div>
            <Link
              href="/auth/login"
              className="inline-block text-sm font-medium text-blue-600 hover:underline"
            >
              ← Back to sign in
            </Link>
          </div>
        ) : (
          <>
            {status === "error" && serverMessage && (
              <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                {serverMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    setEmailError("")
                  }}
                  placeholder="you@university.edu"
                  className={`w-full rounded-lg border px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    emailError ? "border-red-400 bg-red-50" : "border-gray-300 bg-white"
                  }`}
                />
                {emailError && <p className="mt-1 text-xs text-red-600">{emailError}</p>}
              </div>

              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {status === "loading" ? "Sending…" : "Send reset link"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-500">
              Remembered your password?{" "}
              <Link href="/auth/login" className="font-medium text-blue-600 hover:underline">
                Sign in
              </Link>
            </p>
          </>
        )}
      </div>
    </main>
  )
}
