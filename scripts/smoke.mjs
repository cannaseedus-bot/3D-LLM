import { executeTask } from "../src/runtime/execute.js";
import { collapse } from "../src/cluster/collapse.js";

const ngramTask = {
  "@id": "task-001",
  "@op": "ngram.count",
  "@input": { tokens: ["json", "runtime", "json", "cluster"] },
  "@constraints": { deterministic: true, max_tokens: 1000 },
  "@meta": {}
};

const tensorTask = {
  "@id": "gpu-task-001",
  "@op": "tensor.mul",
  "@input": { a: [1, 2, 3, 4], b: [10, 20, 30, 40] },
  "@constraints": { deterministic: true, max_tokens: 1024 },
  "@meta": {}
};

const n1 = executeTask(ngramTask, "node");
const n2 = executeTask(ngramTask, "browser");
collapse([n1, n2]);

const t = executeTask(tensorTask, "webgpu");
if (JSON.stringify(t["@result"]) !== JSON.stringify([10, 40, 90, 160])) {
  throw new Error("tensor.mul smoke test failed");
}

console.log("smoke-ok");
