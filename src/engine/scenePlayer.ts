import { Scene, SceneNode, Effects } from '../schemas/scene';

export function enterScene(scene: Scene, slotsLeft: number): { success: boolean; firstNodeId: string } {
  const cost = scene.slotCost ?? 1;
  if (slotsLeft < cost) {
    return { success: false, firstNodeId: scene.entry };
  }
  return { success: true, firstNodeId: scene.entry };
}

export function getNode(scene: Scene, nodeId: string): SceneNode | null {
  return scene.nodes[nodeId] ?? null;
}

export function isEndNode(node: SceneNode): boolean {
  return node.type === 'end';
}

export function isChoiceNode(node: SceneNode): boolean {
  return node.type === 'choice';
}

export function canChoose(option: { requires?: { trust?: Record<string, number>; noteIds?: string[] } }, trust: Record<string, number>, noteIds: string[]): boolean {
  if (!option.requires) return true;
  if (option.requires.trust) {
    for (const [charId, minTrust] of Object.entries(option.requires.trust)) {
      if ((trust[charId] ?? 0) < minTrust) return false;
    }
  }
  if (option.requires.noteIds) {
    for (const id of option.requires.noteIds) {
      if (!noteIds.includes(id)) return false;
    }
  }
  return true;
}
