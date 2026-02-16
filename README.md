# React E-Commerce Demo App

A small but fully functional e-commerce frontend built with **React**, **TypeScript**, **Redux Toolkit**, and **React Query**.  
This project demonstrates modern frontend architecture, clean state management, and practical UI behavior found in real-world applications.

## 🚀 Live Application

**[View the live E-commerce application →](https://advanced-ecom.vercel.app)**

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

---

## 🔥 Firestore Setup (Backend)

The app uses **Firebase Firestore** for products, orders, and user profiles. To run locally with real data:

### 1. Firebase project

- Create a project at [Firebase Console](https://console.firebase.google.com) and enable **Firestore** and **Authentication (Email/Password)**.
- Register your app and add the config in `src/firebase/firebase.ts`.
- Update `.firebaserc` if your project ID differs.

### 2. Deploy security rules

Server-side access control is enforced by Firestore rules in `firestore.rules`:

- **Orders**: Users can only read/write their own orders (`userId` must match `request.auth.uid`).
- **Products**: Anyone can read; create/update/delete allowed only for users whose `/users/{uid}` document has `isAdmin == true`.
- **Users**: Users can only read/write their own profile document (`/users/{uid}`).

Deploy rules and indexes:

```bash
npm install -g firebase-tools
firebase login
firebase deploy --only firestore
```

### 3. Expected Firestore collections and fields

| Collection | Document ID | Fields |
|------------|-------------|--------|
| **products** | Auto | `title` (string), `price` (number), `description` (string), `category` (string), `image` (string). Optional: `rating` (object with `rate`, `count`). |
| **orders** | Auto | `userId` (string), `createdAt` (Timestamp), `totalPrice` (number), `items` (array of `{ productId, title, price, image, quantity }`). |
| **users** | User UID | `uid`, `email`, `createdAt` (number). Optional: `name`, `address`, `isAdmin` (boolean; set to `true` for users who may manage products). |

To allow a user to manage products, set `isAdmin: true` on their document in the `users` collection (e.g. via Firebase Console or your app after adding an admin UI).

### 4. Seeding sample products

A seed script adds sample products so reviewers can run the app without manual data entry:

1. In Firebase Console → Project Settings → Service accounts, click **Generate new private key** and save the JSON file.
2. Set the environment variable to that file:
   - Windows: `set GOOGLE_APPLICATION_CREDENTIALS=C:\path\to\your-service-account.json`
   - macOS/Linux: `export GOOGLE_APPLICATION_CREDENTIALS=/path/to/your-service-account.json`
3. Install dependencies and run the seed script:

```bash
npm install
npm run seed
```

This creates sample documents in the `products` collection. If you prefer to create products manually, use the same field names as in the table above.