import { verify } from "./verifier.js";
import { executeCoreOp } from "../ops/core.ops.js";
import { executeOp as executeTensorOp } from "../tensor/tensor.ops.js";

function collapseOutput(task, result, engine) {
  return {
    "@id": task["@id"],
    "@op": task["@op"],
    "@result": result,
    "@proof": {
      deterministic: task["@constraints"].deterministic,
      engine
    }
  };
}

export function executeTask(task, engine = "node") {
  verify(task);

  const coreResult = executeCoreOp(task);
  if (coreResult !== undefined) {
    return collapseOutput(task, coreResult, engine);
  }

  if (task["@op"].startsWith("tensor.")) {
    return collapseOutput(task, executeTensorOp(task), engine);
  }

  throw new Error(`Unsupported op: ${task["@op"]}`);
}
