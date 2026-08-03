// Server-only: mints a short-lived signed upload URL for Pinata.
// PINATA_JWT never leaves the server.

const SIGN_ENDPOINT = "https://uploads.pinata.cloud/v3/files/sign";
const MAX_EXPIRES = 600; // seconds
const DEFAULT_EXPIRES = 300;

export async function POST(request) {
  const jwt = process.env.PINATA_JWT;
  if (!jwt || jwt.trim() === "" || jwt.trim() === "add later") {
    return Response.json(
      { error: "PINATA_JWT is not configured on the server." },
      { status: 500 }
    );
  }

  let body = {};
  try {
    body = await request.json();
  } catch {
    // empty body is fine, defaults are used
  }

  const expires = Math.min(
    Math.max(Number(body.expires) || DEFAULT_EXPIRES, 30),
    MAX_EXPIRES
  );

  try {
    const res = await fetch(SIGN_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwt}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        date: Math.floor(Date.now() / 1000),
        expires,
        network: "public",
      }),
    });

    const text = await res.text();

    if (!res.ok) {
      // Don't leak the raw upstream body (may echo auth details)
      return Response.json(
        { error: `Pinata rejected the signing request (${res.status}).` },
        { status: 502 }
      );
    }

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = null;
    }

    // Pinata returns the signed URL as `data` (string); tolerate object shapes too.
    const url =
      typeof parsed?.data === "string"
        ? parsed.data
        : parsed?.data?.url ?? parsed?.data?.signedUrl ?? parsed?.url;

    if (!url) {
      return Response.json(
        { error: "Could not read a signed URL from the Pinata response." },
        { status: 502 }
      );
    }

    return Response.json({ url, expires });
  } catch (err) {
    return Response.json(
      { error: `Failed to reach Pinata: ${err.message}` },
      { status: 502 }
    );
  }
}
