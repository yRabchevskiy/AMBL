import { IUnion } from "../../models/structure.model";

export enum LayoutType { 'horizontal', 'vertical', 'hybrid' };
const NODE_PROPERTIES = {
  width: 0.2,
  height: 0.1,
  gapX: 0.05,
  gapY: 0.15,
  indent: 0.04,      // Відступ для вертикального списку
  vertGap: 0.02      // Відстань між елементами у вертикальному списку
};
const CENTER_X = 0.5;
const START_Y = 0.05;

const buildTree = (nodes: IUnion[]) => {
  const map = new Map<string, IUnion & { children: IUnion[] }>(
    nodes.map(node => [node._id, { ...node, children: [] }])
  );
  const roots: any[] = [];

  map.forEach((node: IUnion) => {
    if (node.parentId) {
      const parent = map.get(node.parentId); // Отримуємо один раз
      if (parent) {
        parent.children.push(node);
      } else {
        // Якщо parentId є, але самого батька в масиві немає (биті дані)
        roots.push(node);
      }
    } else {
      roots.push(node);
    }
  });
  return roots;
}

function layoutHorizontal(nodes: IUnion[]) {
  const calculateWidth = (node: any) => {
    if (!node.children.length) return (node.subtreeWidth = NODE_PROPERTIES.width + NODE_PROPERTIES.gapX);
    node.subtreeWidth = node.children.reduce((acc: number, child: any) => acc + calculateWidth(child), 0);
    return Math.max(node.subtreeWidth, NODE_PROPERTIES.width + NODE_PROPERTIES.gapX);
  };

  const assign = (node: any, centerX: number, y: number) => {
    node.x = centerX - NODE_PROPERTIES.width / 2;
    node.y = y;
    let startX = centerX - node.subtreeWidth / 2;
    node.children.forEach((child: any) => {
      const childCenter = startX + child.subtreeWidth / 2;
      assign(child, childCenter, y + NODE_PROPERTIES.height + NODE_PROPERTIES.gapY);
      startX += child.subtreeWidth;
    });
  };

  nodes.forEach(root => {
    calculateWidth(root);
    assign(root, CENTER_X, START_Y);
  });
}

function layoutVertical(nodes: IUnion[]) {
  let currentY = START_Y;
  const stepX = 0.25; // Відступ для кожного рівня

  const assign = (node: any, x: number) => {
    node.x = x;
    node.y = currentY;
    currentY += NODE_PROPERTIES.height + 0.05; // Зміщуємо вниз для наступної ноди

    node.children.forEach((child: any) => assign(child, x + stepX));
  };

  nodes.forEach(root => assign(root, 0.1));
}

function layoutHybrid(roots: IUnion[]) {
  // Крок 1: Рахуємо габарити кожного піддерева
  const computeSize = (node: IUnion, level: number): { w: number, h: number } => {
    if (!node.children || node.children.length === 0) {
      node.subtreeWidth = NODE_PROPERTIES.width + NODE_PROPERTIES.gapX;
      node.subtreeHeight = NODE_PROPERTIES.height + NODE_PROPERTIES.gapY;
      return { w: node.subtreeWidth, h: node.subtreeHeight };
    }

    if (level >= 1) {
      // ВЕРТИКАЛЬНИЙ РЕЖИМ: Ширина = фіксований відступ + найширша дитина
      let totalH = NODE_PROPERTIES.height + NODE_PROPERTIES.vertGap;
      let maxW = NODE_PROPERTIES.width;

      node.children.forEach(child => {
        const size = computeSize(child, level + 1);
        totalH += size.h;
        maxW = Math.max(maxW, size.w + NODE_PROPERTIES.indent);
      });

      node.subtreeWidth = maxW + NODE_PROPERTIES.gapX;
      node.subtreeHeight = totalH;
    } else {
      // ГОРИЗОНТАЛЬНИЙ РЕЖИМ: Сума ширин усіх дітей
      let totalW = 0;
      let maxH = 0;

      node.children.forEach(child => {
        const size = computeSize(child, level + 1);
        totalW += size.w;
        maxH = Math.max(maxH, size.h);
      });

      node.subtreeWidth = Math.max(totalW, NODE_PROPERTIES.width + NODE_PROPERTIES.gapX);
      node.subtreeHeight = NODE_PROPERTIES.height + NODE_PROPERTIES.gapY + maxH;
    }
    return { w: node.subtreeWidth, h: node.subtreeHeight };
  };

  // Крок 2: Розставляємо координати
  const assign = (node: IUnion, x: number, y: number, level: number) => {
    node.x = x;
    node.y = y;
    node.level = level;

    if (!node.children || node.children.length === 0) return;

    // Використовуємо ?? для безпечного доступу
    const nodeSubtreeWidth = node.subtreeWidth ?? NODE_PROPERTIES.width;

    if (level >= 1) {
      let currentY = y + NODE_PROPERTIES.height + NODE_PROPERTIES.vertGap;
      node.children.forEach(child => {
        assign(child, x + NODE_PROPERTIES.indent, currentY, level + 1);
        // Додаємо перевірку висоти піддерева дитини
        currentY += (child.subtreeHeight ?? (NODE_PROPERTIES.height + NODE_PROPERTIES.vertGap));
      });
    } else {
      // Центруємо дітей горизонтально
      let startX = x + NODE_PROPERTIES.width / 2 - nodeSubtreeWidth / 2;
      node.children.forEach(child => {
        const childSubtreeWidth = child.subtreeWidth ?? NODE_PROPERTIES.width;
        const childX = startX + childSubtreeWidth / 2 - NODE_PROPERTIES.width / 2;

        assign(child, childX, y + NODE_PROPERTIES.height + NODE_PROPERTIES.gapY, level + 1);
        startX += childSubtreeWidth;
      });
    }
  };

  // Запуск для всіх кореневих нод
  let rootX = 0.1;
  roots.forEach(root => {
    computeSize(root, 0);
    assign(root, rootX - NODE_PROPERTIES.width / 2, 0.05, 0);
    rootX += root.subtreeWidth || 0; // Якщо коренів кілька, вони не перекриються
  });
}

export const TreeHelper = {
  NODE_PROPERTIES,
  LayoutType,
  buildTree,
  layoutHorizontal,
  layoutVertical,
  layoutHybrid,

}

