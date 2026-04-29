# Library Management Backend

Backend for a Library Management System built with Node.js, Express, PostgreSQL, Prisma, and JWT authentication.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure your PostgreSQL connection in `.env`:
   ```env
   DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/library_management"
   JWT_SECRET="your_jwt_secret_here"
   PORT=4000
   ```
3. Generate Prisma client:
   ```bash
   npx prisma generate
   ```
4. Run database migration after configuring PostgreSQL:
   ```bash
   npx prisma migrate dev --name init
   ```
5. Start the server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new member
- `POST /api/auth/login` - Login as a member or librarian

### Members
- `GET /api/members` - List all members (librarian only)
- `GET /api/members/:id` - Get a specific member
- `POST /api/members` - Create a member (librarian only)
- `PUT /api/members/:id` - Update a member
- `DELETE /api/members/:id` - Delete a member (librarian only)

### Books
- `GET /api/books` - List all books
- `GET /api/books/:id` - Get a specific book
- `POST /api/books` - Create a book
- `PUT /api/books/:id` - Update a book
- `DELETE /api/books/:id` - Delete a book

### Authors
- `GET /api/authors` - List authors
- `GET /api/authors/:id` - Get author details
- `POST /api/authors` - Create an author
- `PUT /api/authors/:id` - Update an author
- `DELETE /api/authors/:id` - Delete an author

### Publishers
- `GET /api/publishers` - List publishers
- `GET /api/publishers/:id` - Get publisher details
- `POST /api/publishers` - Create a publisher
- `PUT /api/publishers/:id` - Update a publisher
- `DELETE /api/publishers/:id` - Delete a publisher

### Librarians
- `GET /api/librarians` - List librarians
- `GET /api/librarians/:id` - Get a librarian
- `POST /api/librarians` - Create a librarian
- `PUT /api/librarians/:id` - Update a librarian
- `DELETE /api/librarians/:id` - Delete a librarian

### Borrows
- `GET /api/borrows` - List borrow records
- `GET /api/borrows/:id` - Get borrow record
- `POST /api/borrows` - Issue a book
- `POST /api/borrows/:id/return` - Return a book and calculate fine
- `PUT /api/borrows/:id` - Update borrow record
- `DELETE /api/borrows/:id` - Delete borrow record

## Notes
- Use header `Authorization: Bearer <token>` for protected routes.
- Fine calculation uses a default rate of `10` per late day.
