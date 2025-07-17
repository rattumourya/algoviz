'use server';

/**
 * @fileOverview A flow to visualize the solution of a LeetCode problem.
 *
 * - visualizeSolution - A function that takes a LeetCode problem number and generates a visualization of its solution.
 * - VisualizeSolutionInput - The input type for the visualizeSolution function.
 * - VisualizeSolutionOutput - The return type for the visualizeSolution function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const VisualizeSolutionInputSchema = z.object({
  leetcodeNumber: z.number().describe('The LeetCode problem number.'),
  solutionCode: z.string().describe('The code of the solution.'),
  problemDescription: z.string().describe('The description of the problem')
});
export type VisualizeSolutionInput = z.infer<typeof VisualizeSolutionInputSchema>;

const VisualizeSolutionOutputSchema = z.object({
  visualizationType: z.string().describe('The type of visualization to use (e.g., animation, diagram).'),
  visualizationData: z.string().describe('The data for the visualization (e.g., animation steps, diagram nodes).'),
});
export type VisualizeSolutionOutput = z.infer<typeof VisualizeSolutionOutputSchema>;

export async function visualizeSolution(input: VisualizeSolutionInput): Promise<VisualizeSolutionOutput> {
  return visualizeSolutionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'visualizeSolutionPrompt',
  input: {schema: VisualizeSolutionInputSchema},
  output: {schema: VisualizeSolutionOutputSchema},
  prompt: `You are an expert algorithm visualizer. Given a LeetCode problem number, its solution code, and its description, you will determine the best way to visualize the solution.

LeetCode Problem Number: {{{leetcodeNumber}}}
Problem Description: {{{problemDescription}}}
Solution Code: {{{solutionCode}}}

You must respond with JSON that contains the type of visualization to use (visualizationType) and the data for the visualization (visualizationData).

Consider these visualization types:
- animation: Use this for algorithms with clear steps and state changes over time.
- diagram: Use this for data structures and relationships between data elements.

Example:
{
  "visualizationType": "animation",
  "visualizationData": "[{\"step\": 1, \"description\": \"Initialize variables\"}, {\"step\": 2, \"description\": \"Loop through the array\"}]"
}
`,
});

const visualizeSolutionFlow = ai.defineFlow(
  {
    name: 'visualizeSolutionFlow',
    inputSchema: VisualizeSolutionInputSchema,
    outputSchema: VisualizeSolutionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
