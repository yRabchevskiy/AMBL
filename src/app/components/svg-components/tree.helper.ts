import { IUnion } from "../../models/structure.model";

// Налаштування сітки (можна змінювати під свій viewBox)

const NODE_PROPERTIES = {
  width: 0.2,
  height: 0.1,
  STEP_X: 0.3, // Відстань між сусідніми блоками по горизонталі
  STEP_Y: 0.2, // Відстань між рівнями по вертикалі
  START_X: 0.5, // Центр по горизонталі
  START_Y: 0.05, // Центр по горизонталі
}


function calculateCoordinates(unions: IUnion[]) {
  const tree = buildTree(unions);
  assignPos(tree, 0.5, NODE_PROPERTIES.START_Y, 0); // Починаємо з кореня
  return tree;
}

const buildTree = (nodes: any[]) => {
  const map = new Map(nodes.map(node => [node._id, { ...node, children: [] }]));
  const roots: any[] = [];

  map.forEach(node => {
    if (node.parentId && map.has(node.parentId)) {
      map.get(node.parentId).children.push(node);
    } else {
      roots.push(node);
    }
  });
  return roots;
}

const assignPos = (nodes: any[], x: number, y: number, level: number) => {
  const _oneNodeSize = NODE_PROPERTIES.STEP_X + NODE_PROPERTIES.width;
  const width = (nodes.length - 1) * _oneNodeSize;
  let currentX = x - (width / 2);
  debugger

  nodes.forEach(node => {
    node.x = currentX;
    node.y = y;

    if (node.children.length > 0) {
      assignPos(node.children, currentX, y + (NODE_PROPERTIES.STEP_Y + NODE_PROPERTIES.height), level + 1);
    }
    currentX += NODE_PROPERTIES.STEP_X;
  });
}

export const TreeHelper = {
  NODE_PROPERTIES,
  calculateCoordinates,

}

