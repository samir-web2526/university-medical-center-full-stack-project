"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { register } from "@/services/auth.service"
import Image from "next/image"
import logo from "@/assets/images/logo.png"

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

export default function RegisterPageClient() {
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

    if (form.contactNumber && !/^\d{11}$/.test(form.contactNumber)) {
      newErrors.contactNumber = "Contact number must be exactly 11 digits"
    }

    if (form.guardianNumber && !/^\d{11}$/.test(form.guardianNumber)) {
      newErrors.guardianNumber = "Guardian number must be exactly 11 digits"
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
        .select-medical {
          transition: all 0.2s ease;
          border: 1.5px solid #e2e8f0;
          background: #f8fafc;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E");
          background-position: right 0.5rem center;
          background-repeat: no-repeat;
          background-size: 1.5em 1.5em;
          padding-right: 2.5rem;
        }
        .select-medical:focus {
          border-color: #0891b2;
          background-color: #fff;
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
      `}</style>

      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-cyan-50/30 to-gray-50 px-4 py-10">
        <div className="w-full max-w-lg">
          {/* Logo + Title */}
          <div className="text-center mb-6 anim-fade-up">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-cyan-50 border border-cyan-100 mb-4">
              <Image src={logo} alt="UMC Logo" width={36} height={36} className="rounded-lg" />
            </div>
            <h1 className="text-xl font-bold text-gray-800">Create Account</h1>
            <p className="text-sm text-gray-500 mt-1">Fill in the details to get started</p>
          </div>

          {/* Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 anim-fade-up anim-d1">
            {/* Error */}
            {serverError && (
              <div className="mb-4 rounded-lg bg-red-50 border border-red-100 px-3 py-2.5 text-sm text-red-600">
                {serverError}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-3.5">
              {/* Full Name */}
              <Field id="fullName" label="Full Name" error={errors.fullName}>
                <input id="fullName" name="fullName" type="text" autoComplete="name" value={form.fullName} onChange={handleChange} placeholder="e.g. Farhan Ahmed" className={inputCn(!!errors.fullName)} />
              </Field>

              {/* Email */}
              <Field id="email" label="Email Address" error={errors.email}>
                <input id="email" name="email" type="email" autoComplete="email" value={form.email} onChange={handleChange} placeholder="you@umc.edu.bd" className={inputCn(!!errors.email)} />
              </Field>

              {/* Student ID */}
              <Field id="studentId" label="Student ID" error={errors.studentId}>
                <input id="studentId" name="studentId" type="text" value={form.studentId} onChange={handleChange} placeholder="e.g. 2021-1-60-001" className={inputCn(!!errors.studentId)} />
              </Field>

              {/* Dept + Session */}
              <div className="grid grid-cols-2 gap-3">
                <Field id="department" label="Department" error={errors.department}>
                  <input id="department" name="department" type="text" value={form.department} onChange={handleChange} placeholder="e.g. CSE" className={inputCn(!!errors.department)} />
                </Field>
                <Field id="session" label="Session" error={errors.session}>
                  <input id="session" name="session" type="text" value={form.session} onChange={handleChange} placeholder="e.g. 2021-22" className={inputCn(!!errors.session)} />
                </Field>
              </div>

              {/* Blood + Contact */}
              <div className="grid grid-cols-2 gap-3">
                <Field id="bloodGroup" label={<>Blood Group <span className="text-gray-400 font-normal">(opt)</span></>}>
                  <select id="bloodGroup" name="bloodGroup" value={form.bloodGroup} onChange={handleChange} className="select-medical w-full rounded-xl px-4 py-2.5 text-sm text-gray-800 outline-none">
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
                <Field id="contactNumber" label={<>Contact <span className="text-gray-400 font-normal">(opt)</span></>}>
                  <input id="contactNumber" name="contactNumber" type="tel" value={form.contactNumber} onChange={handleChange} placeholder="01XXXXXXXXX" className={inputCn(false)} maxLength={11} />
                </Field>
              </div>

              {/* Addresses */}
              <div className="grid grid-cols-2 gap-3">
                <Field id="presentAddress" label={<>Present Address <span className="text-gray-400 font-normal">(opt)</span></>}>
                  <input id="presentAddress" name="presentAddress" type="text" value={form.presentAddress} onChange={handleChange} placeholder="e.g. Dhaka" className={inputCn(false)} />
                </Field>
                <Field id="permanentAddress" label={<>Permanent Address <span className="text-gray-400 font-normal">(opt)</span></>}>
                  <input id="permanentAddress" name="permanentAddress" type="text" value={form.permanentAddress} onChange={handleChange} placeholder="e.g. Sylhet" className={inputCn(false)} />
                </Field>
              </div>

              {/* Guardian */}
              <Field id="guardianNumber" label={<>Guardian Number <span className="text-gray-400 font-normal">(opt)</span></>}>
                <input id="guardianNumber" name="guardianNumber" type="tel" value={form.guardianNumber} onChange={handleChange} placeholder="01XXXXXXXXX" className={inputCn(false)} maxLength={11} />
              </Field>

              {/* Password */}
              <Field id="password" label="Password" error={errors.password}>
                <div className="relative">
                  <input id="password" name="password" type={showPassword ? "text" : "password"} autoComplete="new-password" value={form.password} onChange={handleChange} placeholder="Min. 8 characters" className={inputCn(!!errors.password) + " !pr-11"} />
                  <button type="button" onClick={() => setShowPassword((v) => !v)} tabIndex={-1} className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors">
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
              </Field>

              {/* Confirm */}
              <Field id="confirmPassword" label="Confirm Password" error={errors.confirmPassword}>
                <div className="relative">
                  <input id="confirmPassword" name="confirmPassword" type={showConfirm ? "text" : "password"} autoComplete="new-password" value={form.confirmPassword} onChange={handleChange} placeholder="Re-enter your password" className={inputCn(!!errors.confirmPassword) + " !pr-11"} />
                  <button type="button" onClick={() => setShowConfirm((v) => !v)} tabIndex={-1} className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors">
                    {showConfirm ? (
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
              </Field>

              {/* Submit */}
              <div className="pt-1">
                <button type="submit" disabled={loading} className="btn-medical w-full rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-sm disabled:opacity-50 disabled:cursor-not-allowed">
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Creating account...
                    </span>
                  ) : (
                    "Create Account"
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Footer */}
          <p className="mt-5 text-center text-sm text-gray-500 anim-fade-up anim-d5">
            Already have an account?{" "}
            <Link href="/auth/login" className="font-medium text-cyan-600 hover:text-cyan-700">
              Sign in
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

function inputCn(hasError: boolean) {
  return `input-medical w-full rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 outline-none ${
    hasError ? "!border-red-400 !bg-red-50" : ""
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
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  )
}
