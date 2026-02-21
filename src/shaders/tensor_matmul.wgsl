struct Meta {
  m: u32,
  k: u32,
  n: u32,
}

@group(0) @binding(0) var<storage, read> A: array<f32>;
@group(0) @binding(1) var<storage, read> B: array<f32>;
@group(0) @binding(2) var<storage, read_write> O: array<f32>;
@group(0) @binding(3) var<uniform> meta: Meta;

@compute @workgroup_size(8, 8, 1)
fn main(@builtin(global_invocation_id) id: vec3<u32>) {
  let row = id.x;
  let col = id.y;

  if (row >= meta.m || col >= meta.n) {
    return;
  }

  var sum = 0.0;
  for (var k: u32 = 0u; k < meta.k; k = k + 1u) {
    sum = sum + A[row * meta.k + k] * B[k * meta.n + col];
  }

  O[row * meta.n + col] = sum;
}
