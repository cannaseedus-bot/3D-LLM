import { decompress } from "../runtime/scxq2.js";
import { executeTask } from "../runtime/execute.js";

export function ingest(taskPacket) {
  return structuredClone(taskPacket);
}

export function validate(taskPacket) {
  return decompress(taskPacket);
}

export async function execute(task, engine = "node") {
  return executeTask(task, engine);
}

export function collapse(result) {
  return result;
}

export async function runNode(taskPacket, engine = "node") {
  const ingested = ingest(taskPacket);
  const validated = validate(ingested);
  const executed = await execute(validated, engine);
  return collapse(executed);
}
