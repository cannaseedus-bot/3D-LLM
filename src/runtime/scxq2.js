function decodeBase64(payload) {
  if (typeof atob === "function") {
    return atob(payload);
  }

  return Buffer.from(payload, "base64").toString("binary");
}

export function decompress(packet) {
  if (!packet || typeof packet !== "object") {
    throw new Error("Invalid SCXQ2 packet");
  }

  if (packet["@compression"] !== "scxq2-v1") {
    return packet;
  }

  const raw = decodeBase64(packet["@payload"] ?? "");

  // Minimal deterministic placeholder decode.
  // Production: DICT/FIELD/LANE/EDGE lanes + varint/entropy decode.
  const floats = new Float32Array(Math.floor(raw.length / 4));

  return {
    ...packet,
    "@input": { A: floats }
  };
}
