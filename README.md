# E-commus Elegant Store

This is a single-page e-commerce storefront built for the Frontend Developer Assignment, consuming the live E-comus REST API. Users can browse products, view details, authenticate, and complete purchases.

**Live site:** https://e-commus-elegant-store.vercel.app/
**Repository:** https://github.com/venusse40/E-commus-elegant-store

## Tech Stack

- **Framework:** React + Vite
- **Routing:** React Router
- **State Management:** Context API (`AuthContext`, `CartContext`)
- **HTTP Client:** Axios, centralized in `src/api/`
- **Styling:** Tailwind CSS
- **Deployment:** Vercel

### Why Context API over Redux/Zustand
The app only needs two pieces of global state — auth session and cart — with no complex derived state or middleware requirements. Context API keeps the codebase simpler and faster to build under the assignment's time constraint, without sacrificing clarity.

## Setup & Run Instructions

1. Clone the repo:
```bash
   git clone https://github.com/venusse40/E-commus-elegant-store.git
   cd E-commus-elegant-store
```
2. Install dependencies:
```bash
   npm install
```
3. Create a `.env` file in the root (see Environment Variables below).
4. Run the dev server:
```bash
   npm run dev
```
5. Open `http://localhost:5173`

## Environment Variables

Create a `.env` file in the project root:
