# MERN Backend with Role-Based Access Control (RBAC)

This project is a robust backend built with the MERN stack (MongoDB, Express, React, Node.js). It features role-based access control (RBAC) for efficient user management and secure endpoints. The application includes Swagger documentation for API usability and supports dynamic routing for books and users.

---

## **Features**

- **Role-Based Access Control (RBAC):**
  - `root-admin`: Full access to manage admins and users.
  - `admin`: Can manage books (create, update, delete).
  - `user`: Can only read books.

- **Dynamic Schema Validation:**
  - Uses `Joi` to validate requests.

- **Pagination and Filtering:**
  - Supports pagination for book listings.

- **Security Features:**
  - JWT-based authentication.
  - Rate limiting to prevent abuse.

- **Cloud Storage:**
  - Ready for integration with AWS S3 for file uploads.

- **API Documentation:**
  - Interactive Swagger UI documentation available at `/api-docs`.

---

## **Tech Stack**

- **Node.js**
- **Express.js**
- **MongoDB**
- **TypeScript**
- **Jest & Supertest** for testing
- **Swagger** for API documentation

---

## **Setup and Installation**

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <repository-folder>
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Create `.env` and `.env.test` files in the root directory.

   Example `.env` file:
   ```env
   MONGO_URI=mongodb://localhost:27017/myapp
   JWT_SECRET=mysecret
   PORT=5000
   ```

4. Run the application:
   ```bash
   npm start
   ```

5. Visit the Swagger documentation:
   ```
   http://localhost:5000/api-docs
   ```

---

## **API Endpoints**

### **Books**

- **GET /api/books**: Retrieve all books (accessible to all users).
- **POST /api/books**: Add a new book (requires `admin` or `root-admin` roles).
- **GET /api/books/:id**: Retrieve a book by ID.
- **DELETE /api/books/:id**: Delete a book by ID (requires `admin` or `root-admin` roles).

### **Users**

- **POST /api/users/register**: Register a new user.
- **POST /api/users/login**: Authenticate and obtain a JWT.

---

## **Testing**

1. Run unit and integration tests:
   ```bash
   npm test
   ```
---

## **Swagger Documentation**

The Swagger UI provides interactive API documentation. Access it at:
```
http://localhost:5000/api-docs
```

Example API Request for Creating a Book:
```json
POST /api/books
Authorization: Bearer <JWT_TOKEN>
{
  "title": "New Book",
  "author": "John Doe",
  "publishedDate": "2024-01-01",
  "ISBN": "123-456-789"
}
```

Expected Response:
```json
{
  "success": true,
  "data": {
    "_id": "64def12345abc67890gh5678",
    "title": "New Book",
    "author": "John Doe",
    "publishedDate": "2024-01-01",
    "ISBN": "123-456-789"
  }
}
```

---

## **Folder Structure**

```plaintext
src/
├── controllers/
│   ├── bookController.ts
│   ├── userController.ts
├── routes/
│   ├── bookRoutes.ts
│   ├── userRoutes.ts
├── models/
│   ├── bookModel.ts
│   ├── userModel.ts
├── middleware/
│   ├── authMiddleware.ts
│   ├── rateLimiter.ts
│   ├── s3Uploader.ts
├── utils/
├── tests/
│   ├── book.test.ts
│   ├── user.test.ts
│   ├── setup.ts
```

---

## **Future Enhancements**

- **Password Reset Functionality**: Allow users to reset their passwords.
- **Email Notifications**: Integrate email services for user notifications.
- **Enhanced Search**: Add advanced filtering options for book searches.
- **Admin Dashboard**: Create a dashboard for managing users and books.

---

## **Contributing**

Contributions are welcome! Please follow these steps:
1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add feature-name"
   ```
4. Push to your forked repository:
   ```bash
   git push origin feature-name
   ```
5. Open a pull request.

---

## **License**

This project is licensed under the MIT License. See the `LICENSE` file for details.
