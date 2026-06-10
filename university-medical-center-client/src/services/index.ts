/**
 * services/index.ts
 *
 * Central barrel export for the entire service layer.
 * Import any service function from "@/services" throughout the application.
 */

// ── Auth ────────────────────────────────────────────────────────────────────
export {
  register,
  login,
  logout,
  changePassword,
  createDoctor,
  updateDoctorProfile,
} from "./auth.service";

// ── Student ─────────────────────────────────────────────────────────────────
export {
  getMyProfile as getStudentProfile,
  updateMyProfile as updateStudentProfile,
  getAllStudents,
  updateStudent,
  deleteStudent,
} from "./student.service";

// ── Doctor ──────────────────────────────────────────────────────────────────
export {
  getMyProfile as getDoctorProfile,
  updateMyProfile as updateDoctorMyProfile,
  getAllDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
} from "./doctor.service";

// ── Visit ───────────────────────────────────────────────────────────────────
export {
  createVisit,
  getVisits,
  getVisitById,
  updateVisit,
  deleteVisit,
} from "./visit.service";

// ── Prescription ─────────────────────────────────────────────────────────────
export {
  createPrescription,
  getDoctorPrescriptions,
  getMyPrescriptions,
  getAllPrescriptions,
  getPrescriptionById,
  cancelPrescription,
} from "./prescription.service";

// ── Medicine ─────────────────────────────────────────────────────────────────
export {
  createMedicine,
  getAllMedicines,
  getMedicineById,
  updateMedicine,
  deleteMedicine,
  increaseStock,
  decreaseStock,
} from "./medicine.service";

// ── Notification ──────────────────────────────────────────────────────────────
export {
  getMyNotifications,
  getAllNotifications,
  markAllAsRead,
  markAsRead,
  getUnreadCount,
  deleteNotification,
} from "./notification.service";
