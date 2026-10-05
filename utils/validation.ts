import { z } from 'zod';
import { AnalysisOption } from '../types/analysis';

export const leetcodeUrlSchema = z.string()
  .url('Must be a valid URL')
  .regex(/leetcode\.com\/([^/]+)/, 'Must be a valid LeetCode profile URL');

export const dateRangeSchema = z.object({
  from: z.date().nullable(),
  to: z.date().nullable(),
  preset: z.string().optional(),
}).refine(data => !data.from || !data.to || data.from <= data.to, {
  message: 'End date must be after start date',
  path: ['to'],
});

const analysisOptionSchema = z.enum([
  'problems-solved',
  'time-taken',
  'difficulty',
  'how-you-solve',
  'ai-help',
  'code-similarity',
  'strong-areas',
  'areas-to-improve',
  'career-suggestions'
]);

export const analysisOptionsSchema = z.array(analysisOptionSchema)
  .min(1, 'Select at least one analysis option');

export function extractUsername(url: string): string | null {
  if (!url) return null;
  try {
    const match = url.match(/leetcode\.com\/(?:u\/)?([^/]+)/);
    return match ? match[1] : null;
  } catch (e) {
    return null;
  }
}
