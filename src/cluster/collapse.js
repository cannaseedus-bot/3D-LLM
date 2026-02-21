export function collapse(results) {
  if (!Array.isArray(results) || results.length === 0) {
    throw new Error("No results to collapse");
  }

  const first = JSON.stringify(results[0]["@result"]);

  for (const result of results) {
    if (JSON.stringify(result["@result"]) !== first) {
      throw new Error("Consensus failure");
    }
  }

  return results[0];
}
