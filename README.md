# 🛡️ Military Asset Management System

A centralized web application for secure tracking and management of military assets, personnel, and base inventories.

> 📽️ [Watch Demo Video](https://drive.google.com/file/d/1h-cONuJ7EiRXj18hycTR6099rerI-NWv/view?usp=sharing)

---

## 🧭 Project Overview

The Military Asset Management System is a centralized web application designed to manage and track military equipment, personnel assignments, and base inventories across a secure infrastructure.

Key features include:
- Adding, updating, and transferring assets
- Assigning assets to personnel
- Secure access control via roles

**Assumptions:**
- Consistent internet access
- Accurate data input by users

**Limitations:**
- No tracking of monetary value
- No advanced analytics (yet)

---

## 🛠 Tech Stack & Architecture

- **Frontend**: React (via Next.js 13+ with App Router & TypeScript)
- **Backend**: Next.js API Routes with Prisma ORM
- **Database**: PostgreSQL (hosted on **Neon**)
- **Authentication**: NextAuth
- **ORM**: Prisma for schema modeling and DB interaction

> Architecture prioritizes scalability, type safety, and maintainability.

---

## 🗂️ Data Models / Schema

The system uses six core Prisma models:

- **User**: Linked to bases, assigned roles
- **Base**: Physical locations where assets are stored
- **Asset**: Tracked military equipment
- **Purchase**: Logs acquisition info
- **Transfer**: Logs asset movement between bases
- **Assignment**: Links assets to personnel

All models are interrelated through Prisma's relational mappings for consistency and simplified querying.

---

## 🔐 RBAC (Role-Based Access Control)

Three primary roles:

| Role     | Permissions                                                                 |
|----------|-------------------------------------------------------------------------------|
| Admin    | Full access (users, assets, purchases, transfers, assignments)               |
| Officer  | Cannot view/manage users, purchases, or transfers                            |
| Viewer   | Read-only access (dashboard level only)                                      |

RBAC is enforced using **middleware** in Next.js, which redirects unauthorized users to an “Unauthorized Access” page.

---

## 📄 API Logging

Transaction-level logging is handled **manually** within each API route:

- Sensitive operations (create, update, delete) can be extended to log actions
- Logs may be written to a DB table or sent to external monitoring systems in future versions

---

## ⚙️ Setup Instructions

To run the project locally:

1. 📥 **Download the project**:  
   Open the provided Word file → Click the link → Download the zip → Unzip → Open in your IDE.

2. 📦 **Install dependencies**:  
   ```bash
   npm install
   ```

3. 🔐 **Configure environment**:  
   Create a `.env` file from `.env.example` and fill in:
   ```
   DATABASE_URL=your_database_url_here
   NEXTAUTH_SECRET=your_secret_here
   ```

4. 🗃️ **Run migrations**:  
   ```bash
   npx prisma migrate dev
   ```

5. 🌱 *(Optional)* **Seed initial data**:  
   ```bash
   npx prisma db seed
   ```

6. 🚀 **Start development server**:  
   ```bash
   npm run dev
   ```

7. 🌐 **Access the app**:  
   - Frontend: [http://localhost:3000](http://localhost:3000)  
   - Backend API: `/api/*` routes

---

## 🧪 API Endpoints

Standard RESTful endpoints for each model:

### 📦 Assets
- `GET /api/assets` – List all assets  
- `POST /api/assets` – Create a new asset  
- `GET /api/assets/:id` – Get asset by ID  
- `PUT /api/assets/:id` – Update asset  
- `DELETE /api/assets/:id` – Delete asset  

### 🏰 Bases / 👤 Users / 🧾 Purchases / 🔄 Transfers / 🎖️ Assignments
Each of these follow the same CRUD pattern under their respective route folders.

> All endpoints accept JSON payloads and use Prisma for DB interaction.

---

## 📽️ Demo Link

[Watch Demo Video](https://drive.google.com/file/d/1h-cONuJ7EiRXj18hycTR6099rerI-NWv/view?usp=sharing)

---

## 🏁 Future Improvements

- Full audit logging system
- Asset depreciation & valuation tracking
- Graphical analytics dashboard
