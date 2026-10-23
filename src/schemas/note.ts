import { z } from 'zod';

export const NoteCategorySchema = z.enum([
  'motive', 'opportunity', 'alibi', 'psychology', 'contradiction',
]);
export type NoteCategory = z.infer<typeof NoteCategorySchema>;

export const NoteSpanSchema = z.object({
  id: z.string(),
  text: z.string().min(1),
  category: NoteCategorySchema,
  target: z.string(),
  truthKey: z.string(),
});
export type NoteSpan = z.infer<typeof NoteSpanSchema>;

export const NoteSchema = NoteSpanSchema.extend({
  sourceScene: z.string(),
  strength: z.enum(['weak', 'strong']),
  truth: z.enum(['true', 'plausible', 'false']),
  createdAt: z.number(),
});
export type Note = z.infer<typeof NoteSchema>;
