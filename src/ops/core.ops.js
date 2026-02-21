function deepMerge(left, right) {
  const out = { ...left };
  for (const [key, value] of Object.entries(right)) {
    if (value && typeof value === "object" && !Array.isArray(value) && out[key] && typeof out[key] === "object" && !Array.isArray(out[key])) {
      out[key] = deepMerge(out[key], value);
    } else {
      out[key] = value;
    }
  }
  return out;
}

function normalizeNgramCounts(tokens) {
  const counts = {};
  for (const token of tokens) {
    counts[token] = (counts[token] ?? 0) + 1;
  }
  return counts;
}

export function executeCoreOp(task) {
  const op = task["@op"];
  const input = task["@input"];

  switch (op) {
    case "math.add":
      return Number(input.a) + Number(input.b);
    case "math.mul":
      return Number(input.a) * Number(input.b);
    case "ngram.count":
      return normalizeNgramCounts(input.tokens ?? []);
    case "ngram.infer": {
      const counts = normalizeNgramCounts(input.tokens ?? []);
      const ordered = Object.entries(counts)
        .sort((a, b) => (b[1] - a[1]) || a[0].localeCompare(b[0]));
      return {
        token: ordered[0]?.[0] ?? null,
        support: ordered[0]?.[1] ?? 0,
        distribution: Object.fromEntries(ordered)
      };
    }
    case "state.merge":
      return deepMerge(input.left ?? {}, input.right ?? {});
    case "identity.echo":
      return input.value;
    default:
      return undefined;
  }
}
