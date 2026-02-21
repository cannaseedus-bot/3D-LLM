function assertSameLength(a, b) {
  if (a.length !== b.length) {
    throw new Error("Mismatched tensor lengths");
  }
}

function toArray(input) {
  if (Array.isArray(input)) return input;
  if (ArrayBuffer.isView(input)) return Array.from(input);
  throw new Error("Expected array-like input");
}

export function tensorAdd(A, B) {
  const a = toArray(A);
  const b = toArray(B);
  assertSameLength(a, b);
  return a.map((v, i) => v + b[i]);
}

export function tensorMul(A, B) {
  const a = toArray(A);
  const b = toArray(B);
  assertSameLength(a, b);
  return a.map((v, i) => v * b[i]);
}

export function tensorMatmul(A, B, shapeA, shapeB) {
  const [m, kA] = shapeA;
  const [kB, n] = shapeB;
  if (kA !== kB) throw new Error("Invalid matmul shapes");

  const out = new Array(m * n).fill(0);

  for (let i = 0; i < m; i += 1) {
    for (let j = 0; j < n; j += 1) {
      let sum = 0;
      for (let k = 0; k < kA; k += 1) {
        sum += A[i * kA + k] * B[k * n + j];
      }
      out[i * n + j] = sum;
    }
  }

  return out;
}

export function tensorReduceSum(A) {
  return toArray(A).reduce((acc, v) => acc + v, 0);
}

export function tensorNormL2(A) {
  const sq = toArray(A).reduce((acc, v) => acc + v * v, 0);
  return Math.sqrt(sq);
}

export function executeOp(task) {
  const op = task["@op"];
  const input = task["@input"];

  switch (op) {
    case "tensor.add":
      return tensorAdd(input.A ?? input.a, input.B ?? input.b);
    case "tensor.mul":
      return tensorMul(input.A ?? input.a, input.B ?? input.b);
    case "tensor.matmul": {
      const shapeA = input.shapeA ?? task["@tensor"]?.shapeA;
      const shapeB = input.shapeB ?? task["@tensor"]?.shapeB;
      if (!shapeA || !shapeB) throw new Error("Matmul requires shapeA and shapeB");
      return tensorMatmul(input.A ?? input.a, input.B ?? input.b, shapeA, shapeB);
    }
    case "tensor.reduce.sum":
      return tensorReduceSum(input.A ?? input.a);
    case "tensor.norm.l2":
      return tensorNormL2(input.A ?? input.a);
    default:
      throw new Error(`Unsupported op: ${op}`);
  }
}
