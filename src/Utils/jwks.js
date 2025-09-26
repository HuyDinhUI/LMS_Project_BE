import { importSPKI, importPKCS8, exportJWK } from "jose";
import fs from "fs";

export const privateKeyJwk = async () => {
  const privPem = fs.readFileSync("private.pem", "utf8");
  const privateKey = await importPKCS8(privPem, "RS256", {
    extractable: true, // ✅ cho phép export
  });
  const privJwk = await exportJWK(privateKey);
  privJwk.use = "sig";
  privJwk.alg = "RS256";
  privJwk.kid = "mykey1";
  console.log("Private JWK:", privJwk);
  return privJwk;
};
