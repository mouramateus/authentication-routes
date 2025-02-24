import request from "supertest";
import app from "../src/index";

describe("Auth Routes", () => {
  it("should register a user", async () => {
    const res = await request(app.callback()).post("/auth").send({
      name: "Test User",
      email: "test@example.com",
      role: "user",
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
  });

  it("should log in an existing user", async () => {
    const res = await request(app.callback()).post("/auth").send({
      email: "test@example.com",
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
  });
});
