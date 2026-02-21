# 3D-LLM

Minimal JSON runtime cluster scaffold where JSON is the execution contract.

## Runtime law

- Canonical execution object fields: `@id`, `@op`, `@input`, `@constraints`, optional `@meta`.
- Pipeline: `INGEST -> VALIDATE -> EXECUTE -> COLLAPSE`.
- Unknown ops are rejected.
- Deterministic tasks must declare `"deterministic": true`.

## Supported ops

### Core cluster ops (v0.1)

- `math.add`
- `math.mul`
- `ngram.count`
- `ngram.infer`
- `state.merge`
- `identity.echo`

### Tensor ops

- `tensor.add`
- `tensor.mul`
- `tensor.matmul`
- `tensor.reduce.sum`
- `tensor.norm.l2`

## Structure

- `src/runtime/verifier.js`: legality and constraints validation.
- `src/runtime/execute.js`: op dispatch and proof envelope output.
- `src/ops/core.ops.js`: cluster-native core ops.
- `src/tensor/*`: schema, tensor ops, SVG-3D buffer loader.
- `src/cluster/node.js`: explicit 4-phase node flow.
- `src/cluster/collapse.js`: deep-equality consensus collapse.
- `src/runtime/executor.webgpu.js`, `src/runtime/executor.webgl.js`: browser runtime adapters.

## Run checks

```bash
npm run check
npm run test:smoke
```
