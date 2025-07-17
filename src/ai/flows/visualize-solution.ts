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
  visualizationType: z.string().describe('The type of visualization to use (e.g., "animation", "diagram").'),
  visualizationData: z.string().describe('The data for the visualization. For "animation", this should be a JSON string of an array of step objects. For "diagram", it can be a string representation of the diagram data (e.g., DOT format or another JSON structure).'),
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

You must respond with a JSON object that contains the type of visualization to use (visualizationType) and the data for the visualization (visualizationData).

Consider these visualization types:
- animation: Use this for algorithms with clear steps and state changes over time. The visualizationData should be a JSON string representing an array of objects. Each object must have a 'step' (number) and a 'description' (string) key. It can also include other keys to represent the state at that step (e.g., current array, pointers).
- diagram: Use this for data structures and relationships between data elements.

Example for 'animation' type:
{
  "visualizationType": "animation",
  "visualizationData": "[{\\"step\\": 1, \\"description\\": \\"Initialize variables i=0, j=5\\", \\"i\\": 0, \\"j\\": 5}, {\\"step\\": 2, \\"description\\": \\"Swap elements at i and j\\", \\"i\\": 1, \\"j\\": 4}]"
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
