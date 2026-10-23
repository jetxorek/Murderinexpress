import { z } from 'zod';

export const SaveStateSchema = z.object({
  version: z.literal(1),
  playerId: z.string(),
  chapter: z.number(),
  currentScene: z.string(),
  currentNode: z.string(),
  sceneSlotsLeft: z.number(),
  suspicion: z.number().min(0).max(100),
  trust: z.record(z.string(), z.number()),
  notes: z.array(z.string()),
  hintsUsed: z.object({
    greyCells: z.number().default(0),
    memoryTheater: z.number().default(0),
    snowWindow: z.number().default(0),
  }),
  deaths: z.number().default(0),
  visitedScenes: z.array(z.string()).default([]),
  unlockedEndings: z.array(z.string()).default([]),
  updatedAt: z.number(),
});
export type SaveState = z.infer<typeof SaveStateSchema>;
