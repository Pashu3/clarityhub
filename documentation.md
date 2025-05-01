Perfect. Let’s now lock in the **Project Documentation for ClarityHub v1** — from scratch — with all the essentials: introduction, features, modules, tech stack, and future scope.

---

# **ClarityHub – Project Documentation (v1)**

---

## **1. Introduction**

**ClarityHub** is an AI-powered internal dashboard that helps users derive insights from raw CSV data. The tool allows users to upload spreadsheets, query data in natural language, and view key visualizations — all in a clean, intuitive interface.

It is built for small teams, startups, analysts, and internal operators who want instant clarity from messy datasets.

---

## **2. Goals**
- Simplify data exploration using AI.
- Empower teams to extract insights from CSVs instantly.
- Offer a seamless dashboard experience for non-technical users.
- Create a scalable full-stack project to showcase advanced skills.

---

## **3. Core Features (MVP)**

### **a. User Authentication**
- JWT-based login/register system
- Role-based access: `user`, `admin`
- Password hashing with bcrypt

### **b. CSV Upload**
- Drag-and-drop file upload (Multer on backend)
- File validation and error handling
- Store CSV file metadata in database

### **c. AI Query Engine**
- Use OpenAI GPT-4 API
- Accept user’s natural language questions
- Respond with insights based on uploaded CSV

### **d. Dashboard View**
- Display parsed CSV data
- Show summary (total rows, columns, null values, etc.)
- AI-generated KPIs and visualization-ready data

### **e. Upload History**
- List of previously uploaded files
- Show status (Success / Failed)
- Timestamp, file size, and actions

---

## **4. Tech Stack**

### **Frontend:**
- **Next.js (App Router)**
- **Tailwind CSS**
- **shadcn/ui**
- **next-themes** (theme toggling)
- **Recharts** or **Chart.js** for charts

### **Backend:**
- **NestJS** (modular, scalable backend)
- **Prisma** ORM
- **PostgreSQL** DB
- **Multer** for file uploads
- **OpenAI SDK**

---

## **5. Folder Structure**

### **Backend (`/server`)**
```
/src
  /auth
  /user
  /upload
  /ai
  /dashboard
  /common
prisma/
```

### **Frontend (`/app`)**
```
/app
  /dashboard
  /auth
  /upload
  /settings
/components
/lib
/utils
```

---

## **6. Security**
- JWT for access tokens
- Backend validation using DTOs & class-validator
- Limit file size, type for upload
- Environment variables for secrets

---

## **7. Future Scope (v2 & Beyond)**

- Stripe integration for subscriptions
- Multi-tenant support (multiple organizations)
- Admin panel for user management
- Real-time collaboration (e.g. shared dashboards)
- S3 bucket storage
- Notion-style workspace UI
- Advanced chart builder
- AI agent chaining (SQL → chart → explain)

---

## **8. UI Theme Strategy**
- Default: **Minimal Light**
- Toggle: Light / Dark mode via `next-themes`
- Fonts: `Inter`, `Manrope`
- Palette: Neutral grays + Indigo/Blue highlights

---

## **9. Confidentiality**
This document is part of an internal project and is not to be distributed or made public without prior authorization. All tech, designs, and ideas are original and proprietary.

---

We’re now ready to **begin backend setup**.  
Shall I write the NestJS project initialization and Auth module next?