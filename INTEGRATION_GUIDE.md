# Frontend-Backend Integration Setup

## What's been integrated:

### Backend Updates:
1. **CORS Enabled** - Updated `app.js` to allow requests from the frontend
2. **CORS Package Added** - Added `cors` to `package.json` dependencies
3. **Environment Variable** - Added `FRONTEND_URL` to `.env` for production configuration

### Frontend Updates:
1. **API Client** (`lib/api.ts`) - Centralized API communication with JWT token management
2. **Authentication Hook** (`hooks/useAuth.ts`) - Custom hook for login, logout, and register functionality
3. **Environment Config** (`.env.local`) - Set API base URL to `http://localhost:4000`
4. **Login Page Updated** (`app/page.tsx`) - Now calls backend API instead of just redirecting

## How to Use:

### 1. Install Backend Dependencies
```bash
cd backend
npm install
```

### 2. Install Frontend Dependencies
```bash
cd frontend
npm install
```

### 3. Start Backend Server
```bash
cd backend
npm run dev
```
Backend will run on `http://localhost:4000`

### 4. Start Frontend Server (in a new terminal)
```bash
cd frontend
npm run dev
```
Frontend will run on `http://localhost:3000`

## Testing the Integration:

### Login
- Navigate to `http://localhost:3000`
- Enter email and password (must exist in your database)
- Select Member or Librarian role
- Click Sign In

The login will now:
1. Make an API call to `POST /api/auth/login`
2. Receive a JWT token from the backend
3. Store the token in localStorage
4. Redirect to the appropriate dashboard

### Using API in Components

For any new component that needs to call the backend, use the `api` object:

```typescript
import { api } from "@/lib/api";

// List members
const members = await api.members.list();

// Get a specific book
const book = await api.books.get("book-id");

// Create a new member
const newMember = await api.members.create({
  first_name: "Jane",
  last_name: "Doe",
  email: "jane@example.com",
  // ... other fields
});
```

### Using Authentication Hook

```typescript
"use client";

import { useAuth } from "@/hooks/useAuth";

export default function MyComponent() {
  const { user, login, logout, loading, error } = useAuth();

  const handleLogin = async () => {
    try {
      await login("user@example.com", "password", "member");
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  return (
    <div>
      {user ? (
        <p>Welcome, {user.email}</p>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}
    </div>
  );
}
```

## Important Notes:

- JWT tokens are automatically attached to requests in `lib/api.ts` via the `Authorization` header
- The token is stored in localStorage and persists across page refreshes
- To make unauthenticated requests, pass `skipAuth: true` to `apiCall()`
- CORS is configured to accept requests from `http://localhost:3000` (or the `FRONTEND_URL` from `.env`)

## Troubleshooting:

- **CORS Errors**: Make sure backend is running on port 4000 and CORS is properly configured
- **API Not Found**: Check that the backend routes match the endpoints being called from the frontend
- **Token Issues**: Clear localStorage if you get authentication errors: `localStorage.removeItem('token')`
