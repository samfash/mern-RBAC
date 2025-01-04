import request from "supertest";
import app from "../index"; // Ensure this points to your Express app
import Book from "../models/bookModel";
import path from "path"
import {adminToken , userToken } from "./setup";


describe("Book API", () => {
  let bookId: string;

  it("should create a new book", async () => {
    const response = await request(app)
      .post("/api/books")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        title: "Automated Test Book",
        author: "Test Author",
        publishedDate: "2024-01-01",
        ISBN: "987-654-321"
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty("_id");
    expect(response.body.data.title).toBe("Automated Test Book");

    bookId = response.body.data._id
  });

  it("should return 400 for missing required fields when creating a book", async () => {
    const responce = await request(app)
      .post("/api/books")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
      author: "Author Without Title",
      publishedDate: "2024-01-01",
      // Missing "title" and "ISBN"
    });
    expect(responce.status).toBe(400);
    expect(responce.body.error).toBe('\"title\" is required');
  });

  it("should return 400 if no file is provided when updating cover image", async () => {
    const responce = await request(app).patch(`/api/books/cover-image/${bookId}`);
    expect(responce.status).toBe(400);
    expect(responce.body.error).toBe("No file uploaded");
  });  
  
  it("should return 500 for unsupported file type when updating cover image", async () => {
    const responce = await request(app)
      .patch(`/api/books/cover-image/${bookId}`) // Assume `bookId` is valid and defined earlier
      .attach("coverImage", path.resolve(__dirname, "files/sample.txt")); // Invalid file type
    expect(responce.status).toBe(500);
    expect(responce.body.error).toBe("Only image files are allowed!");
  });

  it("should return all books data", async () =>{
    const responce = await request(app).get("/api/books").set("Authorization", `Bearer ${userToken}`)

    expect(responce.status).toBe(200);
    expect(responce.body.success).toBe(true);
    expect(responce.body.data.length).toBeGreaterThan(0);
  })

  it("should fetch a single book by ID", async () => {
    const responce = await request(app).get(`/api/books/${bookId}`).set("Authorization", `Bearer ${userToken}`);
    expect(responce.status).toBe(200);
    expect(responce.body.success).toBe(true);
    expect(responce.body.data._id).toBe(bookId);
  });

  it("should return 400 for invalid book ID format", async () => {
    const responce = await request(app).get("/api/books/invalid-id").set("Authorization", `Bearer ${userToken}`);
    expect(responce.status).toBe(400);
    expect(responce.body.error).toBe("id not valid");
  });
  
  it("should return 404 for a non-existent book ID", async () => {
    const nonExistentId1 = "67710d54ddb7de19a8a7a693"; // Use a valid but non-existent MongoDB ID
    const responce = await request(app).get(`/api/books/${nonExistentId1}`).set("Authorization", `Bearer ${userToken}`);
    expect(responce.status).toBe(404);
    expect(responce.body.error).toBe("Book not found");
  });

  it("should update a book", async () => {
    const responce = await request(app)
      .put(`/api/books/${bookId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        title: "Updated Test Book",
        author: "Updated Test Author",
        publishedDate: "2025-01-01",
        ISBN: "444-555-666",
      });
    expect(responce.status).toBe(200);
    expect(responce.body.success).toBe(true);
    expect(responce.body.data.title).toBe("Updated Test Book");
  });

  it("should return 400 for invalid update data", async () => {
    const responce = await request(app)
      .put(`/api/books/${bookId}`) // Assume `bookId` is valid and defined earlier
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        title: "", // Invalid title
        author: "Updated Author",
        publishedDate: "2025-01-01",
        ISBN: "987-654-321",
      });
    expect(responce.status).toBe(400);
    expect(responce.body.error).toBe("Validation failed"); // Adjust based on your validation logic
  });
  
  it("should delete a book", async () => {
    const responce = await request(app).delete(`/api/books/${bookId}`).set("Authorization", `Bearer ${adminToken}`);
    expect(responce.status).toBe(200);
    expect(responce.body.success).toBe(true);

    const checkRes = await request(app).get(`/api/books/${bookId}`).set("Authorization", `Bearer ${adminToken}`);
    expect(checkRes.status).toBe(404);
  });

  it("should return 404 when trying to delete a non-existent book", async () => {
    const nonExistentId2 = "67710d54ddb7de19a8a7a693"; // Use a valid but non-existent MongoDB ID
    const responce = await request(app).delete(`/api/books/${nonExistentId2}`).set("Authorization", `Bearer ${adminToken}`);
    expect(responce.status).toBe(404);
    expect(responce.body.error).toBe("Book not found");
  });
  
  it("should return an empty list when there are no books", async () => {
    // Ensure the database is empty
    await Book.deleteMany({});
    const responce = await request(app).get("/api/books").set("Authorization", `Bearer ${adminToken}`);
    expect(responce.status).toBe(200);
    expect(responce.body.success).toBe(true);
    expect(responce.body.data).toEqual([]);
  });
  
  it("should allow an admin to create a book", async () => {
    const response = await request(app)
      .post("/api/books")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        title: "Admin Created Book",
        author: "Admin Author",
        publishedDate: "2025-01-01",
        ISBN: "123-456-789",
      });
    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.title).toBe("Admin Created Book");
  });

  it("should deny a regular user from creating a book", async () => {
    const response = await request(app)
      .post("/api/books")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        title: "User Created Book",
        author: "User Author",
        publishedDate: "2025-01-01",
        ISBN: "987-654-321",
      });
    expect(response.status).toBe(403); // Forbidden
    expect(response.body.error).toBe("Access denied");
  });

  it("should allow a regular user to fetch all books", async () => {
    const response = await request(app)
      .get("/api/books")
      .set("Authorization", `Bearer ${userToken}`);
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toBeDefined();
  });

  it("should deny unauthenticated access to books", async () => {
    const response = await request(app).get("/api/books");
    expect(response.status).toBe(401);
    expect(response.body.error).toBe("Access denied, no token provided");
  });
});
