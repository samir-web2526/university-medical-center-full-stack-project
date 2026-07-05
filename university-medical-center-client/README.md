# University Medical Center Frontend

A modern, full-stack medical center management platform designed to streamline patient(student) care, provide powerful management tools for administrators and doctors, and ensure seamless platform oversight.

## 📖 Table of Contents
- [About The Project](#about-the-project)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation & Setup](#installation--setup)
- [Environment Variables](#environment-variables)
- [Folder Structure](#folder-structure)
- [Dependencies](#dependencies)
- [Live Demo](#live-demo)
- [Contact](#contact)

## About The Project
University Medical Center is an intuitive healthcare management system that allows patients to seamlessly view medical records, and interact with doctors. The platform includes role-based dashboards, medicine and inventory management for administrators, and a modern responsive UI for an enhanced user experience across all devices.

## Features
- **Role-based dashboards** for Admin, Doctor, and Student
- **Advanced medicine inventory** and management system
- **Secure JWT-based authentication**
- **Fully responsive modern UI** with sleek animations
- **Form handling and robust validation**
- **Data visualization** using interactive charts
- **Protected routes** and intuitive navigation
- **Real-time appointments** and schedule management

## Tech Stack
**Frontend**
- Next.js 16
- React 19
- TypeScript
- Tailwind CSS v4

**UI & Libraries**
- Shadcn UI
- Radix UI
- Lucide React
- Recharts

**Form & Validation**
- React Hook Form
- Zod
- @hookform/resolvers

**Data Fetching & State**
- @tanstack/react-query

## Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/samir-web2526/university-medical-center-client.git
   ```

2. **Navigate to the project folder**
   ```bash
   cd university-medical-center-client
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Setup environment variables**
   Create a `.env` file in the root directory and add the following:
   ```env
   # App URL
   NEXT_PUBLIC_APP_URL="http://localhost:3000"

   # Backend API
   NEXT_PUBLIC_BACKEND_URL="http://localhost:5000"
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

## Environment Variables
| Variable Name | Description |
|---|---|
| `NEXT_PUBLIC_APP_URL` | Frontend application base URL |
| `NEXT_PUBLIC_BACKEND_URL` | Backend API base URL |

## Folder Structure
```
university-medical-center-client/
│
├── src/
│   ├── app/                 # Next.js App Router pages & layouts
│   ├── components/          # Reusable UI components & pages (e.g. Dashboard)
│   ├── hooks/               # Custom React hooks (e.g. useMedicineQueries)
│   ├── lib/                 # Utility functions and configurations
│   ├── services/            # API service functions
│   └── types/               # TypeScript definitions
│
├── public/                  # Static assets
├── package.json             # Dependencies and scripts
└── next.config.ts           # Next.js configuration
```

## Dependencies
```json
"dependencies": {
    "@hookform/resolvers": "^5.4.0",
    "@tanstack/react-query": "^5.101.0",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "jwt-decode": "^4.0.0",
    "lucide-react": "^1.17.0",
    "next": "16.2.9",
    "next-themes": "^0.4.6",
    "radix-ui": "^1.5.0",
    "react": "19.2.4",
    "react-dom": "19.2.4",
    "react-hook-form": "^7.78.0",
    "recharts": "^3.8.1",
    "shadcn": "^4.11.0",
    "sonner": "^2.0.7",
    "tailwind-merge": "^3.6.0",
    "tw-animate-css": "^1.4.0",
    "zod": "^4.4.3"
}
```

## Live Demo
🔗 **Live Site:** [https://university-medical-center-client.vercel.app/](https://university-medical-center-client.vercel.app/)

## Contact
- **Portfolio:** [https://portfolio-kappa-weld-92.vercel.app/](https://portfolio-kappa-weld-92.vercel.app/)
- **Email:** baishnabsamir26@gmail.com
