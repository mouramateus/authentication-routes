import jwt from "jsonwebtoken";
import { generateToken } from "../../src/utils/jwt";

describe("JWT Utils", () => {
  const mockPayload = { id: 1, email: "test@example.com" };
  const secret = process.env.COGNITO_PUBLIC_KEY || "test_secret";

  it("deve gerar um token JWT válido", () => {
    const token = generateToken(mockPayload);
    expect(token).toBeDefined();
    expect(typeof token).toBe("string");

    const decoded = jwt.verify(token, secret);
    expect(decoded).toHaveProperty("id", mockPayload.id);
    expect(decoded).toHaveProperty("email", mockPayload.email);
  });

  it("o token deve expirar corretamente", () => {
    const token = generateToken(mockPayload);
    const decoded = jwt.decode(token) as jwt.JwtPayload;

    expect(decoded).toHaveProperty("exp");
    expect(decoded.exp! - decoded.iat!).toBe(3600); // 1h de expiração
  });
});
