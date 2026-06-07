export function createTreeNode(
  content: string,
  level: number,
  isExpandable = false,
  isExpanded = true
): { nodeDiv: HTMLDivElement; childrenDiv?: HTMLDivElement } {
  const nodeId = `node-${Math.random().toString(36).slice(2, 11)}`;
  const toggleIcon = isExpandable
    ? `<span class="tree-toggle cursor-pointer mr-1 syntax-muted hover:text-accent" data-node="${nodeId}">${isExpanded ? '▼' : '▶'}</span>`
    : '<span class="ml-3"></span>';

  const nodeDiv = document.createElement('div');
  nodeDiv.className = 'tree-node';
  nodeDiv.style.marginLeft = `${level * 20}px`;
  nodeDiv.innerHTML = `${toggleIcon}${content}`;

  if (isExpandable) {
    const childrenDiv = document.createElement('div');
    childrenDiv.className = 'tree-children';
    childrenDiv.id = nodeId;
    childrenDiv.style.display = isExpanded ? 'block' : 'none';
    nodeDiv.appendChild(childrenDiv);
    return { nodeDiv, childrenDiv };
  }

  return { nodeDiv };
}
