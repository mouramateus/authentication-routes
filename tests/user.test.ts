import request from "supertest";
import app from "../src/index";
import { generateToken } from "../src/utils/jwt";

const userToken = generateToken({ email: "test@example.com", role: "user" });
const adminToken = generateToken({ email: "admin@example.com", role: "admin" });

describe("User Routes", () => {
  it("should get user info", async () => {
    const res = await request(app.callback())
      .get("/me")
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("email");
  });

  it("should update user name", async () => {
    const res = await request(app.callback())
      .patch("/edit-account")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ name: "Updated User" });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message", "User updated successfully");
  });

  it("should return forbidden for non-admin user accessing /users", async () => {
    const res = await request(app.callback())
      .get("/users")
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.status).toBe(403);
  });

  it("should allow admin to get all users", async () => {
    const res = await request(app.callback())
      .get("/users")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
