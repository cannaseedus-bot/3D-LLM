export function svg3dToBuffers(svgTensor) {
  const nodesInput = svgTensor?.nodes ?? [];
  const edgesInput = svgTensor?.edges ?? [];

  const nodeIndex = new Map();
  const nodes = new Float32Array(nodesInput.length * 4);

  nodesInput.forEach((n, i) => {
    nodeIndex.set(n.id, i);
    nodes.set([n.x, n.y, n.z, n.w], i * 4);
  });

  const edges = new Float32Array(edgesInput.length * 3);
  const edgeIndex = new Uint32Array(edgesInput.length * 2);

  edgesInput.forEach((e, i) => {
    const fromIndex = e.fromIndex ?? nodeIndex.get(e.from);
    const toIndex = e.toIndex ?? nodeIndex.get(e.to);

    if (fromIndex === undefined || toIndex === undefined) {
      throw new Error("Invalid edge endpoint");
    }

    edges.set([fromIndex, toIndex, e.weight], i * 3);
    edgeIndex.set([fromIndex, toIndex], i * 2);
  });

  return { nodes, edges, edgeIndex };
}
