'use server';

/**
 * @fileOverview Understands a LeetCode problem given its problem number.
 *
 * - understandLeetCodeProblem - A function that takes a LeetCode problem number and returns the problem statement, constraints, and examples.
 * - UnderstandLeetCodeProblemInput - The input type for the understandLeetCodeProblem function.
 * - UnderstandLeetCodeProblemOutput - The return type for the understandLeetCodeProblem function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const UnderstandLeetCodeProblemInputSchema = z.object({
  problemNumber: z
    .number()
    .describe('The LeetCode problem number to understand.'),
});
export type UnderstandLeetCodeProblemInput = z.infer<
  typeof UnderstandLeetCodeProblemInputSchema
>;

const UnderstandLeetCodeProblemOutputSchema = z.object({
  problemName: z.string().describe('The name of the LeetCode problem.'),
  dsaTopic: z
    .string()
    .describe(
      'The primary Data Structures and Algorithms (DSA) topic for the problem (e.g., "Arrays", "Dynamic Programming", "Graphs").'
    ),
  difficultyLevel: z
    .enum(['Easy', 'Medium', 'Hard'])
    .describe('The difficulty level of the problem.'),
  problemStatement: z.string().describe('The problem statement.'),
  constraints: z.string().describe('The constraints of the problem.'),
  examples: z.string().describe('Examples for the problem.'),
});
export type UnderstandLeetCodeProblemOutput = z.infer<
  typeof UnderstandLeetCodeProblemOutputSchema
>;

export async function understandLeetCodeProblem(
  input: UnderstandLeetCodeProblemInput
): Promise<UnderstandLeetCodeProblemOutput> {
  return understandLeetCodeProblemFlow(input);
}

const prompt = ai.definePrompt({
  name: 'understandLeetCodeProblemPrompt',
  input: {schema: UnderstandLeetCodeProblemInputSchema},
  output: {schema: UnderstandLeetCodeProblemOutputSchema},
  prompt: `You are a LeetCode problem expert. Given a LeetCode problem number, you will return the problem name, its primary DSA topic, difficulty level, the problem statement, constraints, and examples.

  Problem Number: {{{problemNumber}}}
  `,
});

const understandLeetCodeProblemFlow = ai.defineFlow(
  {
    name: 'understandLeetCodeProblemFlow',
    inputSchema: UnderstandLeetCodeProblemInputSchema,
    outputSchema: UnderstandLeetCodeProblemOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
