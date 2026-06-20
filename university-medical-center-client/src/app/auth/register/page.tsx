"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Building2 } from "lucide-react"
import { register } from "@/services/auth.service"
import Image from "next/image"
import logo from "@/assets/images/logo.png"
import bgImage from "@/assets/images/register.webp"

type FormState = {
  fullName: string
  email: string
  password: string
  confirmPassword: string
  studentId: string
  department: string
  session: string
  bloodGroup: string
  contactNumber: string
  presentAddress: string
  permanentAddress: string
  guardianNumber: string
}

type FieldErrors = Partial<Record<keyof FormState, string>>

export default function RegisterPage() {
  const router = useRouter()

  const [form, setForm] = useState<FormState>({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    studentId: "",
    department: "",
    session: "",
    bloodGroup: "",
    contactNumber: "",
    presentAddress: "",
    permanentAddress: "",
    guardianNumber: "",
  })
  const [errors, setErrors] = useState<FieldErrors>({})
  const [serverError, setServerError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  function validate(): boolean {
    const newErrors: FieldErrors = {}

    if (!form.fullName.trim()) {
      newErrors.fullName = "Full name is required"
    } else if (form.fullName.trim().length < 2) {
      newErrors.fullName = "Full name must be at least 2 characters"
    }

    if (!form.email) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Enter a valid email address"
    }

    if (!form.studentId.trim()) newErrors.studentId = "Student ID is required"
    if (!form.department.trim()) newErrors.department = "Department is required"
    if (!form.session.trim()) newErrors.session = "Session is required"

    if (!form.password) {
      newErrors.password = "Password is required"
    } else if (form.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
    }

    if (!form.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password"
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
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
      const { data, error } = await register({
        name: form.fullName,
        email: form.email,
        password: form.password,
        role: "STUDENT",
        student: {
          studentId: form.studentId,
          department: form.department,
          session: form.session,
          bloodGroup: form.bloodGroup || undefined,
          contactNumber: form.contactNumber || undefined,
          presentAddress: form.presentAddress || undefined,
          permanentAddress: form.permanentAddress || undefined,
          guardianNumber: form.guardianNumber || undefined,
        },
      })
      if (error || !data) {
        setServerError(error || "Registration failed. Please try again.")
        return
      }
      router.push("/auth/login")
    } catch {
      setServerError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      {/* Card with background image */}
      <div className="relative w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden">
        <Image
          src={bgImage}
          alt=""
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />

        {/* Form content */}
        <div className="relative z-10 p-10">
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm mb-4">
              <Image src={logo} alt="UMC Logo" width={40} height={40} className="rounded-lg" />
            </div>
            <h1 className="text-2xl font-bold text-white">Create Account</h1>
            <p className="text-sm text-white/70 mt-1">Sign up for a UMC account</p>
          </div>

        {serverError && (
          <div className="mb-5 rounded-lg bg-red-500/20 backdrop-blur-sm border border-red-300/30 px-4 py-3 text-sm text-red-100">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <Field id="fullName" label="Full Name" error={errors.fullName}>
            <input
              id="fullName"
              name="fullName"
              type="text"
              autoComplete="name"
              value={form.fullName}
              onChange={handleChange}
              placeholder="e.g. Farhan Ahmed"
              className={inputCn(!!errors.fullName)}
            />
          </Field>

          <Field id="email" label="Email Address" error={errors.email}>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@umc.edu.bd"
              className={inputCn(!!errors.email)}
            />
          </Field>

          <Field id="studentId" label="Student ID" error={errors.studentId}>
            <input
              id="studentId"
              name="studentId"
              type="text"
              value={form.studentId}
              onChange={handleChange}
              placeholder="e.g. 2021-1-60-001"
              className={inputCn(!!errors.studentId)}
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field id="department" label="Department" error={errors.department}>
              <input
                id="department"
                name="department"
                type="text"
                value={form.department}
                onChange={handleChange}
                placeholder="e.g. CSE"
                className={inputCn(!!errors.department)}
              />
            </Field>

            <Field id="session" label="Session" error={errors.session}>
              <input
                id="session"
                name="session"
                type="text"
                value={form.session}
                onChange={handleChange}
                placeholder="e.g. 2021-22"
                className={inputCn(!!errors.session)}
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field
              id="bloodGroup"
              label={<>Blood Group <span className="text-white/40 font-normal">(optional)</span></>}
            >
              <select
                id="bloodGroup"
                name="bloodGroup"
                value={form.bloodGroup}
                onChange={handleChange}
                className={inputCn(false)}
              >
                <option value="">Select</option>
                <option value="A_POSITIVE">A+</option>
                <option value="A_NEGATIVE">A−</option>
                <option value="B_POSITIVE">B+</option>
                <option value="B_NEGATIVE">B−</option>
                <option value="AB_POSITIVE">AB+</option>
                <option value="AB_NEGATIVE">AB−</option>
                <option value="O_POSITIVE">O+</option>
                <option value="O_NEGATIVE">O−</option>
              </select>
            </Field>

            <Field
              id="contactNumber"
              label={<>Contact <span className="text-white/40 font-normal">(optional)</span></>}
            >
              <input
                id="contactNumber"
                name="contactNumber"
                type="tel"
                value={form.contactNumber}
                onChange={handleChange}
                placeholder="01XXXXXXXXX"
                className={inputCn(false)}
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field id="presentAddress" label={<>Present Address <span className="text-white/40 font-normal">(optional)</span></>}>
              <input
                id="presentAddress"
                name="presentAddress"
                type="text"
                value={form.presentAddress}
                onChange={handleChange}
                placeholder="e.g. Dhaka"
                className={inputCn(false)}
              />
            </Field>

            <Field id="permanentAddress" label={<>Permanent Address <span className="text-white/40 font-normal">(optional)</span></>}>
              <input
                id="permanentAddress"
                name="permanentAddress"
                type="text"
                value={form.permanentAddress}
                onChange={handleChange}
                placeholder="e.g. Sylhet"
                className={inputCn(false)}
              />
            </Field>
          </div>

          <Field id="guardianNumber" label={<>Guardian Number <span className="text-white/40 font-normal">(optional)</span></>}>
            <input
              id="guardianNumber"
              name="guardianNumber"
              type="tel"
              value={form.guardianNumber}
              onChange={handleChange}
              placeholder="01XXXXXXXXX"
              className={inputCn(false)}
            />
          </Field>

          <Field id="password" label="Password" error={errors.password}>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                value={form.password}
                onChange={handleChange}
                placeholder="Min. 8 characters"
                className={inputCn(!!errors.password) + " pr-10"}
              />
              <EyeToggle open={showPassword} onToggle={() => setShowPassword((v) => !v)} />
            </div>
          </Field>

          <Field id="confirmPassword" label="Confirm Password" error={errors.confirmPassword}>
            <div className="relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirm ? "text" : "password"}
                autoComplete="new-password"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter your password"
                className={inputCn(!!errors.confirmPassword) + " pr-10"}
              />
              <EyeToggle open={showConfirm} onToggle={() => setShowConfirm((v) => !v)} />
            </div>
          </Field>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-[#0b5394] hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {loading ? "Creating account…" : "Create Account"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-white/60">
          Already have an account?{" "}
          <Link href="/auth/login" className="font-medium text-white hover:underline">
            Sign in
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

function inputCn(hasError: boolean) {
  return `w-full rounded-lg border px-3 py-2.5 text-sm text-white placeholder-white/40 outline-none transition focus:ring-2 focus:ring-white/50 bg-white/10 border-white/20 ${
    hasError ? "ring-2 ring-red-400 border-red-400" : ""
  }`
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string
  label: React.ReactNode
  error?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-xs font-medium text-white/80 mb-1">
        {label}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-red-300">{error}</p>}
    </div>
  )
}

function EyeToggle({ open, onToggle }: { open: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      tabIndex={-1}
      className="absolute inset-y-0 right-3 flex items-center text-white/50 hover:text-white/80"
      aria-label={open ? "Hide password" : "Show password"}
    >
      {open ? (
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
  )
}
