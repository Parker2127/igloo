# 🏠 Igloo - Enterprise Property Management Platform

A modern, full-stack property management platform designed for property managers, landlords, and real estate professionals. Built with React, TypeScript, and Express, Igloo provides comprehensive tools for managing rental properties, tenants, leases, payments, and maintenance requests.

---

### ✨ Features

#### 🏢 Property Management
* **Complete Property Profiles:** Detailed property information with photos, amenities, and rental details.
* **Multi-Property Support:** Manage unlimited properties from a single dashboard.
* **Property Analytics:** Track occupancy rates, revenue, and maintenance costs.

#### 👥 Tenant Management
* **Tenant Profiles:** Comprehensive tenant information and contact details.
* **Lease Tracking:** Monitor lease terms, renewal dates, and rental agreements.
* **Communication Hub:** Built-in messaging system for tenant-landlord communication.

#### 💰 Financial Management
* **Payment Tracking:** Monitor rent payments, late fees, and payment history.
* **Revenue Analytics:** Track rental income and property profitability.
* **Expense Management:** Record and categorize property-related expenses.

#### 🔧 Maintenance System
* **Service Requests:** Streamlined maintenance request submission and tracking.
* **Priority Management:** Categorize requests by urgency and type.
* **Vendor Management:** Maintain a database of trusted service providers.

#### 📄 Document Management
* **Lease Documents:** Secure storage and management of rental agreements.
* **Digital Signatures:** Electronic lease signing capabilities.
* **Document Organization:** Organized filing system for all property documents.

---

### 🚀 Live Demo

Experience Igloo in action: [**Live Demo**](https://igloo-rent.replit.app)

#### Demo Credentials
* The application features a realistic authentication flow.
* Demo data is automatically populated for exploration.
* All features are fully functional in the demo environment.

---

### 🛠️ Technology Stack

#### Frontend
* **React 18** - Modern React with hooks and functional components
* **TypeScript** - Type-safe development with comprehensive type definitions
* **Vite** - Fast build tool with hot module replacement
* **Tailwind CSS** - Utility-first CSS framework with custom theming
* **shadcn/ui** - High-quality component library built on Radix UI
* **TanStack Query** - Powerful data synchronization and caching
* **Wouter** - Lightweight client-side routing
* **React Hook Form + Zod** - Type-safe form validation

#### Backend
* **Node.js + Express** - RESTful API with middleware architecture
* **TypeScript (ESM)** - Modern JavaScript with ES modules
* **Drizzle ORM** - Type-safe database operations
* **PostgreSQL** - Robust relational database with advanced features
* **Passport.js** - Authentication middleware with OpenID Connect
* **Express Sessions** - Secure session management

#### Infrastructure & Tools
* **Replit Deployment** - Cloud hosting with automatic scaling
* **Neon PostgreSQL** - Serverless PostgreSQL database
* **Replit Auth** - Secure authentication provider
* **Drizzle Kit** - Database migrations and schema management

---

### 🏗️ Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│     React       │    │     Express     │    │    PostgreSQL   │
│    Frontend     │◄──►│     Backend     │◄──►│     Database    │
│                 │    │                 │    │                 │
│ • Components    │    │ • RESTful API   │    │ • Property Data │
│ • State Mgmt    │    │ • Authentication│    │ • User Sessions │
│ • Type Safety   │    │ • Session Mgmt  │    │ • Relationships │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

#### Key Architectural Decisions
* **Monorepo Structure:** Shared types and schemas between frontend and backend.
* **Type-Safe Database:** Drizzle ORM with Zod validation for end-to-end type safety.
* **Component-Driven UI:** Reusable components built with shadcn/ui and Radix primitives.
* **Server-State Management:** TanStack Query for efficient data fetching and caching.
* **Secure Authentication:** OpenID Connect with session-based authentication.

---

### 📁 Project Structure

```
igloo/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   │   └── ui/         # shadcn/ui components
│   │   ├── pages/          # Application pages/routes
│   │   ├── hooks/          # Custom React hooks
│   │   └── lib/            # Utilities and configurations
│   └── public/             # Static assets
├── server/                 # Express Backend
│   ├── routes.ts           # API route definitions
│   ├── storage.ts          # Database abstraction layer
│   └── index.ts            # Server entry point
├── shared/                 # Shared code
│   └── schema.ts           # Database schema & types
└── database/               # Database migrations & seeds
```

---

### 🚀 Getting Started

#### Prerequisites
* Node.js 18+ and npm
* PostgreSQL 15+

#### Installation
1.  **Clone the repository**
    ```bash
    git clone [https://github.com/yourusername/igloo.git](https://github.com/yourusername/igloo.git)
    cd igloo
    ```
2.  **Install dependencies**
    ```bash
    npm install
    ```
3.  **Set up environment variables**
    ```bash
    # Database configuration
    DATABASE_URL=postgresql://username:password@localhost:5432/igloo
    # Authentication (for production)
    REPLIT_DB_URL=your_replit_db_url
    ```
4.  **Initialize the database**
    ```bash
    npm run db:push
    ```
5.  **Start the development server**
    ```bash
    npm run dev
    ```
The application will be available at `http://localhost:5000`

#### Database Management
* **Push schema changes:** `npm run db:push`
* **Force schema update:** `npm run db:push --force`
* **Generate migrations:** `npm run db:generate`

---

### 📱 Key Features Showcase

#### Modern UI/UX Design
* **Responsive Design:** Optimized for desktop, tablet, and mobile devices.
* **Dark/Light Mode:** Comprehensive theming with system preference detection.
* **Accessible Components:** ARIA-compliant components built on Radix UI.
* **Loading States:** Smooth loading animations and skeleton screens.

#### Performance Optimizations
* **Code Splitting:** Dynamic imports for optimal bundle sizes.
* **Caching Strategy:** Intelligent data caching with TanStack Query.
* **Optimistic Updates:** Immediate UI updates for better user experience.
* **Image Optimization:** Lazy loading and responsive images.

#### Security Features
* **Authentication Flow:** Secure login with session management.
* **Data Validation:** Server and client-side validation with Zod.
* **SQL Injection Prevention:** Parameterized queries with Drizzle ORM.
* **Session Security:** Secure session storage and CSRF protection.

---

### 🎯 Technical Highlights
* **Full-Stack TypeScript:** End-to-end type safety from database to UI.
* **Modern React Patterns:** Hooks, context, and functional components.
* **RESTful API Design:** Clean, consistent API with proper HTTP methods.
* **Database Relations:** Complex many-to-many relationships with proper foreign keys.
* **Real-time Updates:** Live data synchronization with query invalidation.
* **Error Boundaries:** Comprehensive error handling and user feedback.

---

### 🔧 Development Scripts

```bash
# Development
npm run dev           # Start development server
# Database
npm run db:push       # Push schema changes
npm run db:generate   # Generate migrations
npm run db:studio     # Open Drizzle Studio
# Build
npm run build         # Build for production
npm run start         # Start production server
```

---

### 🌟 Portfolio Highlights

This project demonstrates proficiency in:

* **Modern Web Technologies:** React 18, TypeScript, Node.js
* **Database Design:** Complex relational schemas with PostgreSQL
* **API Development:** RESTful services with Express.js
* **UI/UX Design:** Modern, responsive interfaces with Tailwind CSS
* **State Management:** Advanced patterns with TanStack Query
* **Authentication:** Secure user management with OpenID Connect
* **Performance:** Optimized loading and caching strategies
* **Type Safety:** End-to-end TypeScript implementation

---

### 📄 License

© 2025 Shrikar Kaduluri. All rights reserved.

This project is created as a portfolio demonstration. The code is available for viewing and learning purposes.

---

### 📞 Contact

* **LinkedIn:** [https://www.linkedin.com/in/shrikarkaduluri/](https://www.linkedin.com/in/shrikarkaduluri/)

Built with ❤️ by Shrikar Kaduluri
