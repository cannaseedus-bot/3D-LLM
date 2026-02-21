const ALLOWED_OPS = [
  "math.add",
  "math.mul",
  "ngram.count",
  "ngram.infer",
  "state.merge",
  "identity.echo",
  "tensor.add",
  "tensor.mul",
  "tensor.matmul",
  "tensor.reduce.sum",
  "tensor.norm.l2"
];

function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export function verify(task) {
  if (!isObject(task)) throw new Error("Task must be an object");
  if (typeof task["@id"] !== "string" || task["@id"].length === 0) throw new Error("Missing id");
  if (typeof task["@op"] !== "string") throw new Error("Missing op");
  if (!isObject(task["@input"])) throw new Error("Missing input");
  if (!isObject(task["@constraints"])) throw new Error("Missing constraints");

  if (!ALLOWED_OPS.includes(task["@op"])) {
    throw new Error("Illegal operation");
  }

  const deterministic = task["@constraints"].deterministic;
  if (deterministic !== true && deterministic !== false) {
    throw new Error("deterministic must be boolean");
  }

  if (deterministic === false && typeof task["@constraints"].entropy_max !== "number") {
    throw new Error("entropy_max required for non-deterministic tasks");
  }

  if (typeof task["@constraints"].max_tokens === "number" && task["@constraints"].max_tokens < 1) {
    throw new Error("max_tokens must be >= 1");
  }

  return true;
}

export { ALLOWED_OPS };
