# Product Requirements Document (PRD)
**Project Name:** University Medical Center (Backend)

---

## 1. Project Overview
The University Medical Center backend is a RESTful API built with Node.js, Express.js, TypeScript, and Prisma ORM using a PostgreSQL database. It serves as the core system for managing a university's medical facility. The system manages three main entities: Students (acting as patients), Doctors, and Administrators. The backend provides features for user authentication, profile management, medical visits, prescription generation, medicine inventory tracking, and system notifications. The architecture follows a clean, modular pattern where each functional domain is encapsulated within its own module.

## 2. Problem Statement
The backend aims to digitalize and streamline the university medical center's operations. It solves the problem of manually tracking student medical visits, managing doctor profiles, maintaining medicine inventory, and keeping a record of medical prescriptions. By providing role-based access to these functionalities, it ensures secure and structured handling of medical records within the university ecosystem.

## 3. Goals & Scope
**Goals:**
*   Provide a robust authentication and authorization mechanism using JWT.
*   Enable role-based operations for Admins, Doctors, and Students.
*   Track medical visits and record patient vitals.
*   Allow doctors to issue prescriptions to students with specific medicines and dosages.
*   Maintain and track medicine inventory stock levels.
*   Notify users of system events (e.g., low stock, prescription updates).

**Scope:**
*   Only covers functionalities explicitly present in the source code (User Management, Student/Doctor Profiles, Medicine Inventory, Visits, Prescriptions, and Notifications).

## 4. User Roles
The system utilizes role-based access control (RBAC) with the following roles extracted from the `Role` enum:
1.  **ADMIN**: Has comprehensive control over the system. Can manage (create/update/delete) Doctors, Students, Medicines, Visits, Prescriptions, and System Notifications.
2.  **DOCTOR**: Can manage their own profile, create and update medical visits, generate prescriptions for students, and cancel prescriptions.
3.  **STUDENT**: Acts as the patient. Can register, manage their own profile, and view their medical visit history, prescriptions, and personal notifications.

## 5. Core Features
*Note: This list is strictly based on the implemented modules found in the codebase.*

*   **Authentication & Authorization:**
    *   JWT-based login and token refresh.
    *   Role-based access enforcement (Middleware checking for ADMIN, DOCTOR, or STUDENT).
    *   Mandatory password change enforcement (e.g., first login).
    *   User status management (Active, Blocked, Inactive).
*   **User & Profile Management:**
    *   Student registration and profile management (Department, Session, Blood Group).
    *   Doctor creation (by Admin) and profile updates (Specialization, Qualification).
*   **Medical Visit Management:**
    *   Recording of patient encounters (Visit) linking a Student and a Doctor.
    *   Capturing clinical vitals (Chief complaint, blood pressure, temperature, weight, pulse rate).
*   **Prescription Generation:**
    *   Doctors can create prescriptions linked to a specific visit.
    *   Includes diagnosis, advice, and optional image attachments.
    *   Prescriptions can be associated with multiple medicines (with dosage, duration, and quantity instructions).
    *   Prescriptions can be cancelled with a provided reason.
*   **Medicine Inventory:**
    *   CRUD operations for medicines (Name, Manufacturer, Expiry Date, Unit Price).
    *   Stock management (Increase/Decrease stock).
    *   Minimum stock threshold tracking.
*   **Notification System:**
    *   In-app notifications for users (Unread count, Mark as read).
    *   Notification types cover events like Medicine Low Stock, Out of Stock, Prescription Created/Cancelled, Visit Created, and System Alerts.

## 6. API Documentation Summary
APIs are structured around their respective modules.

### Auth & User APIs (`/users`)
*   `POST /users/register` - Register a new user (typically a student).
*   `POST /users/create-doctor` - Admin creation of a doctor account.
*   `POST /users/login` - User login to obtain JWT.
*   `POST /users/refresh-token` - Refresh expired access token.
*   `POST /users/logout` - Logout user.
*   `PATCH /users/change-password` - Change user password.
*   `PATCH /users/update-doctor-profile` - Doctor updating their specific profile details.

### Student APIs (`/students`)
*   `GET /students/profile` - Get the logged-in student's profile.
*   `PATCH /students/profile` - Update the logged-in student's profile.
*   `GET /students/` - (Admin) Get all students.
*   `PATCH /students/:id` - (Admin) Update a student.
*   `DELETE /students/:id` - (Admin) Delete a student.

### Doctor APIs (`/doctors`)
*   `GET /doctors/profile` - Get the logged-in doctor's profile.
*   `PATCH /doctors/profile` - Update the logged-in doctor's profile.
*   `GET /doctors/` - (Admin) Get all doctors.
*   `GET /doctors/:id` - (Admin) Get a specific doctor.
*   `PATCH /doctors/:id` - (Admin) Update a doctor.
*   `DELETE /doctors/:id` - (Admin) Delete a doctor.

### Visit APIs (`/visits`)
*   `POST /visits/` - (Doctor) Create a new visit record.
*   `GET /visits/` - Get visits (filtered by role).
*   `GET /visits/:id` - Get a specific visit.
*   `PATCH /visits/:id` - (Doctor) Update visit vitals/notes.
*   `DELETE /visits/:id` - (Admin) Delete a visit.

### Prescription APIs (`/prescriptions`)
*   `POST /prescriptions/` - (Doctor) Create a prescription.
*   `GET /prescriptions/doctor-prescriptions` - (Doctor) Get prescriptions written by the doctor.
*   `GET /prescriptions/my-prescriptions` - (Student) Get prescriptions for the student.
*   `GET /prescriptions/` - (Admin) Get all prescriptions.
*   `GET /prescriptions/:id` - Get a specific prescription.
*   `PATCH /prescriptions/:id/cancel` - (Doctor) Cancel a prescription.

### Medicine APIs (`/medicines`)
*   `POST /medicines/` - (Admin) Add new medicine.
*   `GET /medicines/` - View all medicines.
*   `GET /medicines/:id` - View single medicine details.
*   `PATCH /medicines/:id` - (Admin) Update medicine details.
*   `DELETE /medicines/:id` - (Admin) Delete medicine.
*   `PATCH /medicines/:id/increase-stock` - (Admin) Increase stock quantity.
*   `PATCH /medicines/:id/decrease-stock` - (Admin) Decrease stock quantity.

### Notification APIs (`/notifications`)
*   `GET /notifications/my-notifications` - Get user's notifications.
*   `GET /notifications/all` - (Admin) Get all system notifications.
*   `PATCH /notifications/mark-all-as-read` - Mark all user notifications as read.
*   `PATCH /notifications/mark-as-read/:id` - Mark specific notification as read.
*   `GET /notifications/unread-count` - Get count of unread notifications.
*   `DELETE /notifications/:id` - (Admin) Delete a notification.

## 7. Database Schema Overview
The database uses PostgreSQL via Prisma.
*   **User**: Base model for authentication (`email`, `password`, `role`, `status`). Has one-to-one relations with `Student` and `Doctor`.
*   **Student**: Extends User (`studentId`, `department`, `session`, `bloodGroup`). Has many-to-one relations with `Visit` and `Prescription`.
*   **Doctor**: Extends User (`specialization`, `qualification`). Has many-to-one relations with `Visit` and `Prescription`.
*   **Visit**: Represents an encounter. Links `Student` and `Doctor`. Stores `chiefComplaint`, `bloodPressure`, `temperature`, `notes`. Has a one-to-one relation with `Prescription`.
*   **Prescription**: Links to a `Visit`. Stores `diagnosis`, `advice`, and `status` (ACTIVE/CANCELLED). Has a one-to-many relation with `PrescriptionMedicine`.
*   **Medicine**: Inventory item (`name`, `dosageForm`, `strength`, `stockQuantity`, `minimumStock`).
*   **PrescriptionMedicine**: Join/Pivot table resolving many-to-many between `Prescription` and `Medicine`. Stores context like `dosage`, `duration`, `quantity`, and `instructions`.
*   **Notification**: Stores alerts (`title`, `message`, `type`, `isRead`). Links to a `User`.

## 8. System Architecture
*   **Language/Framework:** Node.js with Express.js and TypeScript.
*   **Database:** PostgreSQL interacted via Prisma ORM.
*   **Pattern:** Layered Modular Architecture. Each logical domain (User, Student, Doctor, Visit, Prescription, Medicine, Notification) is a module containing:
    *   `*.route.ts`: API endpoint definitions.
    *   `*.controller.ts`: Request/Response handling.
    *   `*.service.ts`: Core business logic and database queries.
    *   `*.validation.ts`: Zod schemas for request validation.
*   **Middleware:** Global error handling, Zod validation middleware (`validateRequest`), and Authentication/Authorization middleware (`checkAuth`).

## 9. Workflows
1.  **Patient Visit Workflow**: A Student visits the medical center. A Doctor records the encounter by creating a `Visit`, documenting vitals and complaints.
2.  **Prescription Workflow**: Following a Visit, the Doctor creates a `Prescription` associated with that Visit. The doctor attaches specific `Medicine` records to the prescription using `PrescriptionMedicine` to define dosages. If an error occurs, the Doctor can cancel the Prescription.
3.  **Inventory Workflow**: Admins add new `Medicine` to the database. They update stock by using the dedicated increase/decrease stock endpoints as inventory is consumed or restocked. Notifications trigger based on stock thresholds.
4.  **Notification Workflow**: The system alerts users (Admin, Doctor, or Student) for events such as a newly created prescription, low medicine stock, or prescription cancellations.

