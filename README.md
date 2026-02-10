# React E-Commerce Demo App

A small but fully functional e-commerce frontend built with **React**, **TypeScript**, **Redux Toolkit**, and **React Query**.  
This project demonstrates modern frontend architecture, clean state management, and practical UI behavior found in real-world applications.

---

## 📌 Project Overview

This application allows users to:

- Browse a catalog of products
- Filter products by category
- Add items to a shopping cart
- View cart totals and quantities
- Complete a simple checkout flow

The primary goal of the project is **architectural clarity** — specifically, handling **server data** and **client-owned state** in the correct, intentional way.

---

## 🧠 Architectural Philosophy

The app is built around a clear separation of concerns:

### Server State (External Data)
- **Products and categories** are fetched from the Fake Store API
- Managed using **React Query**
- Benefits:
  - Automatic caching
  - Loading and error states
  - Efficient refetching
  - Declarative data dependencies

### Client State (User-Owned Data)
- **Shopping cart** is managed with **Redux Toolkit**
- Cart data persists using **sessionStorage**
- Benefits:
  - Global accessibility across routes
  - Predictable updates via reducers
  - Cart survives page refreshes during a session

This mirrors how production-grade applications typically distinguish between **data fetched from servers** and **data owned by the user interface**.

---

## 🧱 Tech Stack

- **React** (with Hooks)
- **TypeScript**
- **React Router** – client-side routing
- **Redux Toolkit** – global client state (cart)
- **React Query** – server state management
- **Fake Store API** – external product data
- **CSS (custom)** – lightweight design system using CSS variables

---

## 🗂️ Project Structure

```text
src/
├── api/                # API functions and shared types
├── app/                # Redux store and typed hooks
├── components/         # Reusable UI components
├── features/
│   └── cart/           # Cart slice, types, and persistence logic
├── pages/              # Route-level pages (Home, Cart)
├── index.css           # Global styles and design tokens
├── App.tsx             # Routing configuration
└── main.tsx            # App bootstrap and providers

🚀 Running the Project Locally
Prerequisites

Node.js (v18+ recommended)

npm or yarn

Installation
npm install

Start the Development Server
npm run dev


The app will be available at:

http://localhost:5173