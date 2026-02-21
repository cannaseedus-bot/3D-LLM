import { executeTask } from "./execute.js";

export async function executeWebGL(task) {
  return executeTask(task, "webgl");
}
