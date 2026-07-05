# University Medical Center Backend

A modern, robust REST API for the University Medical Center platform, enabling seamless patient(student) management, doctor scheduling, medicine inventory, and administrative oversight.

## 📖 Table of Contents
- [About The Project](#about-the-project)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation & Setup](#installation--setup)
- [Environment Variables](#environment-variables)
- [Folder Structure](#folder-structure)
- [Dependencies](#dependencies)
- [Live API](#live-api)
- [Contact](#contact)

## About The Project
University Medical Center Backend is a comprehensive RESTful API built to power the medical center management platform. It handles secure user authentication, role-based access control, database interactions for doctors and patients(student) and medicine inventory management. The architecture is modular and scalable, utilizing Express.js, TypeScript, and Prisma ORM.

## Features
- **Role-based authorization** (Admin, Doctor, Student)
- **Secure authentication** with JWT & HTTP-only cookies
- **Advanced database management** using Prisma ORM with PostgreSQL
- **Comprehensive management modules** for Doctors, Patients/Students, Medicines, Prescriptions, and Visits
- **Centralized error handling** and API response formatting
- **Request validation** using Zod
- **Clean architecture** and modular folder structure
- **Email notifications** integrated via Nodemailer

## Tech Stack
**Core**
- Node.js
- Express.js
- TypeScript

**Database & ORM**
- PostgreSQL
- Prisma

**Authentication & Security**
- JSON Web Tokens (JWT)
- bcrypt (Password Hashing)
- cors
- cookie-parser

**Utilities & Validation**
- Zod
- Nodemailer

## Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/samir-web2526/university-medical-center-server.git
   ```

2. **Navigate to the project folder**
   ```bash
   cd university-medical-center-server
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Setup environment variables**
   Create a `.env` file in the root directory and add the required environment variables (see Environment Variables section).

5. **Generate Prisma Client & Run Migrations**
   ```bash
   npm run generate
   npm run migrate
   ```

6. **Seed the Admin User (Optional)**
   ```bash
   npm run seed
   ```

7. **Run the development server**
   ```bash
   npm run dev
   ```

## Environment Variables
Create a `.env` file and configure the following variables:

```env
# Server
NODE_ENV="development"
PORT=5000
FRONTEND_URL="http://localhost:3000"

# Database
DATABASE_URL="postgresql://your_username:your_password@localhost:5432/your_database_name"

# JWT Auth
ACCESS_TOKEN_SECRET="your_access_token_secret"
ACCESS_TOKEN_EXPIRES_IN="86400000"
REFRESH_TOKEN_SECRET="your_refresh_token_secret"
REFRESH_TOKEN_EXPIRES_IN="604800000"

# Admin Seed Info
ADMIN_EMAIL="admin@gmail.com"
ADMIN_PASSWORD="securepassword"
ADMIN_NAME="Admin"
ADMIN_PHONE="0123456789"
```

| Variable Name | Description |
|---|---|
| `NODE_ENV` | Environment (development/production) |
| `PORT` | Port number for the server |
| `DATABASE_URL` | PostgreSQL database connection URL |
| `FRONTEND_URL` | Allowed frontend origin for CORS |
| `ACCESS_TOKEN_SECRET` | Secret key for signing access tokens |
| `REFRESH_TOKEN_SECRET` | Secret key for signing refresh tokens |

*(Only key variables described, see `.env` block for full list)*

## Folder Structure
```
university-medical-center-server/
│
├── prisma/
│   ├── schema/              # Prisma schema files (e.g. user.prisma)
│   └── migrations/          # Database migrations
│
├── src/
│   ├── app/
│   │   ├── errorHelpers/    # Global error handlers
│   │   ├── middlewares/     # Express middlewares (auth, validation)
│   │   ├── routes/          # API route definitions
│   │   └── utils/           # Utility functions
│   │
│   ├── modules/
│   │   ├── Blog/
│   │   ├── Complaint/
│   │   ├── Doctor/
│   │   ├── Medicine/
│   │   ├── Notification/
│   │   ├── Ocr/
│   │   ├── Prescription/
│   │   ├── PrescriptionMedicine/
│   │   ├── Student/
│   │   ├── User/
│   │   └── Visit/
│   │
│   ├── config/              # Configuration (env vars)
│   ├── seedAdmin/           # Admin seeder script
│   └── server.ts            # Application entry point
│
├── .env
├── package.json
└── tsconfig.json
```

## Dependencies
```json
"dependencies": {
    "@prisma/adapter-pg": "^7.8.0",
    "@prisma/client": "^7.8.0",
    "bcrypt": "^6.0.0",
    "cookie-parser": "^1.4.7",
    "cors": "^2.8.6",
    "dotenv": "^17.4.2",
    "express": "^5.2.1",
    "http-status": "^2.1.0",
    "jsonwebtoken": "^9.0.3",
    "nodemailer": "^8.0.11",
    "pg": "^8.21.0",
    "zod": "^4.4.3"
}
```

## Live API
🔗 **Base URL:** [https://university-medical-center-server.vercel.app/](https://university-medical-center-server.vercel.app/)

## Contact
- **Portfolio:** [https://portfolio-kappa-weld-92.vercel.app/](https://portfolio-kappa-weld-92.vercel.app/)
- **Email:** baishnabsamir26@gmail.com
