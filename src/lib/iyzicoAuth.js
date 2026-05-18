import crypto from "crypto";

export function createIyzicoAuthHeader({
  apiKey,
  secretKey,
  randomKey,
  uri,
  body,
}) {
  const payload = randomKey + uri + JSON.stringify(body);

  const signature = crypto
    .createHmac("sha256", secretKey)
    .update(payload)
    .digest("hex");

  const authorizationString = `apiKey:${apiKey}&randomKey:${randomKey}&signature:${signature}`;

  return `IYZWSv2 ${Buffer.from(authorizationString).toString("base64")}`;
}
