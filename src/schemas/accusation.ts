import { z } from 'zod';

export const AccusationInputSchema = z.object({
  accused: z.array(z.string()).min(1).max(7),
  noteIds: z.array(z.string()).min(3).max(7),
});
export type AccusationInput = z.infer<typeof AccusationInputSchema>;

export type AccusationOutcome =
  | 'fail'
  | 'partial_low'
  | 'partial_high'
  | 'full';

export type AccusationResult = {
  score: number;
  coverage: number;
  validCount: number;
  strongCount: number;
  contradictionPenalty: number;
  outcome: AccusationOutcome;
  missingCategories: string[];
  accusedCount: number;
};
