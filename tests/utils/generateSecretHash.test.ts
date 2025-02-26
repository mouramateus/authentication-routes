import { generateSecretHash } from "../../src/utils/generateSecretHash";

describe("generateSecretHash", () => {
  it("deve gerar um hash válido para um email, clientId e clientSecret", () => {
    const email = "teste@example.com";
    const clientId = "cliente123";
    const clientSecret = "segredoSuperSeguro";

    const hash = generateSecretHash(email, clientId, clientSecret);

    expect(typeof hash).toBe("string");
    expect(hash.length).toBeGreaterThan(0);
  });

  it("deve gerar hashes diferentes para inputs diferentes", () => {
    const hash1 = generateSecretHash("user1@example.com", "id1", "secret1");
    const hash2 = generateSecretHash("user2@example.com", "id2", "secret2");

    expect(hash1).not.toBe(hash2);
  });

  it("deve gerar sempre o mesmo hash para os mesmos inputs", () => {
    const email = "user@example.com";
    const clientId = "id123";
    const clientSecret = "secret123";

    const hash1 = generateSecretHash(email, clientId, clientSecret);
    const hash2 = generateSecretHash(email, clientId, clientSecret);

    expect(hash1).toBe(hash2);
  });
});
