import { z } from 'zod';
import { NoteSpanSchema } from './note';

const ToneSchema = z.enum(['neutral', 'soft', 'logical', 'pressure', 'sympathy']);

export const NarrationNodeSchema = z.object({
  type: z.literal('narration'),
  text: z.string(),
  noteSpans: z.array(NoteSpanSchema).optional(),
});

export const DialogueNodeSchema = z.object({
  type: z.literal('dialogue'),
  speaker: z.string(),
  text: z.string(),
  tone: ToneSchema.optional(),
  noteSpans: z.array(NoteSpanSchema).optional(),
});

export const EffectsSchema = z.object({
  trust: z.record(z.string(), z.number()).optional(),
  suspicion: z.number().optional(),
  addNotes: z.array(NoteSpanSchema).optional(),
  unlockScenes: z.array(z.string()).optional(),
  next: z.string().optional(),
});
export type Effects = z.infer<typeof EffectsSchema>;

export const ChoiceOptionSchema = z.object({
  id: z.string(),
  text: z.string(),
  tone: ToneSchema.optional(),
  requires: z.object({
    trust: z.record(z.string(), z.number()).optional(),
    noteIds: z.array(z.string()).optional(),
  }).optional(),
  effects: EffectsSchema,
  risk: z.enum(['none', 'low', 'high']).optional(),
  onDeath: z.string().optional(),
});
export type ChoiceOption = z.infer<typeof ChoiceOptionSchema>;

export const ChoiceNodeSchema = z.object({
  type: z.literal('choice'),
  prompt: z.string(),
  options: z.array(ChoiceOptionSchema).min(1),
});

export const CheckNodeSchema = z.object({
  type: z.literal('check'),
  condition: z.object({
    noteIds: z.array(z.string()).optional(),
    trust: z.record(z.string(), z.number()).optional(),
    suspicionBelow: z.number().optional(),
  }),
  onPass: z.string(),
  onFail: z.string(),
});

export const EndNodeSchema = z.object({
  type: z.literal('end'),
  nextScene: z.string().optional(),
  outcome: z.enum(['continue', 'death', 'chapter_end', 'accusation_ready']).optional(),
});

export const SceneNodeSchema = z.discriminatedUnion('type', [
  NarrationNodeSchema, DialogueNodeSchema, ChoiceNodeSchema, CheckNodeSchema, EndNodeSchema,
]);
export type SceneNode = z.infer<typeof SceneNodeSchema>;

export const SceneSchema = z.object({
  id: z.string(),
  chapter: z.number().int().min(1),
  title: z.string(),
  type: z.enum(['mandatory', 'optional', 'risky', 'death', 'finale']),
  background: z.string(),
  characters: z.array(z.string()).optional(),
  entry: z.string(),
  nodes: z.record(z.string(), SceneNodeSchema),
  onEnter: EffectsSchema.optional(),
  onExit: EffectsSchema.optional(),
  slotCost: z.number().int().min(0).optional(),
});
export type Scene = z.infer<typeof SceneSchema>;
