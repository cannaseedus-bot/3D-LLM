import { executeTask } from "./execute.js";

export async function executeWebGPU(task) {
  return executeTask(task, "webgpu");
}
