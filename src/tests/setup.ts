import mongoose from "mongoose";
import http from "http"
import app from "../index";
import request from "supertest";
import dotenv from "dotenv-safe";


dotenv.config({ path: ".env.test"});
let server: http.Server;

export let adminToken: string;
export let userToken: string;

beforeAll(async () => {
  // Connect to test database
  if(!mongoose.connection.readyState){
    await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/test-books");
  }

  server = app.listen(process.env.PORT || 4000);

  // Seed admin user
  const adminResponse = await request(app).post("/api/users/register").send({
    name: "Admin User",
    email: "admin@example.com",
    password: "password123",
    role: "admin",
  });
  adminToken = (await request(app).post("/api/users/login").send({
    email: "admin@example.com",
    password: "password123",
  })).body.token;

  // Seed regular user
  const userResponse = await request(app).post("/api/users/register").send({
    name: "Regular User",
    email: "user@example.com",
    password: "password123",
    role: "user",
  });
  userToken = (await request(app).post("/api/users/login").send({
    email: "user@example.com",
    password: "password123",
  })).body.token;

});

afterAll(async () => {
  // Drop test database
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();

  if (server) {
    server.close();
  }
});