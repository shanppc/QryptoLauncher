/**
 * Client-side: fetch a short-lived signed URL from our API route,
 * then upload files directly to Pinata. Returns the IPFS CID.
 */

async function getSignedUrl() {
  const res = await fetch("/api/pinata/sign", { method: "POST" });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Signing failed (${res.status})`);
  }
  const { url } = await res.json();
  return url;
}

async function uploadToPinata(signedUrl, formData) {
  const res = await fetch(signedUrl, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(
      text || `Pinata upload failed (${res.status} ${res.statusText})`
    );
  }

  const json = await res.json();
  // Pinata returns { data: { cid, ... } }
  return json.data?.cid;
}

/**
 * Upload a single image to IPFS.
 * Returns the CID as a string.
 */
export async function uploadImage(file) {
  const url = await getSignedUrl();
  const fd = new FormData();
  fd.append("file", file);
  return uploadToPinata(url, fd);
}

/**
 * Upload a folder of metadata JSON files to IPFS.
 * Each file named 0, 1, 2, ... (no extension).
 * Returns the folder CID.
 */
export async function uploadMetadataFolder(metadataArray) {
  const url = await getSignedUrl();
  const fd = new FormData();

  metadataArray.forEach((meta, idx) => {
    const blob = new Blob([JSON.stringify(meta)], {
      type: "application/json",
    });
    // file name = index, no .json extension (contract doesn't append one)
    fd.append("file", blob, String(idx));
  });

  return uploadToPinata(url, fd);
}
