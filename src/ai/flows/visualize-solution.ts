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
  problemDescription: z.string().describe('The description of the problem'),
  userInput: z.string().describe('A string representing the input for the LeetCode problem (e.g., "[1, 8, 6, 2, 5]").'),
});
export type VisualizeSolutionInput = z.infer<typeof VisualizeSolutionInputSchema>;

const VisualizeSolutionOutputSchema = z.object({
  visualizationType: z.string().describe('The type of visualization to use (e.g., "animation", "diagram").'),
  visualizationData: z.string().describe('The data for the visualization. For "animation", this should be a JSON string of an array of step objects. For "diagram", it can be a string representation of the diagram data (e.g., DOT format or another JSON structure).'),
  finalOutput: z.any().describe('The final output returned by the solution code for the given input.'),
});
export type VisualizeSolutionOutput = z.infer<typeof VisualizeSolutionOutputSchema>;

export async function visualizeSolution(input: VisualizeSolutionInput): Promise<VisualizeSolutionOutput> {
  return visualizeSolutionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'visualizeSolutionPrompt',
  input: {schema: VisualizeSolutionInputSchema},
  output: {schema: VisualizeSolutionOutputSchema},
  prompt: `You are an expert algorithm visualizer. Given a LeetCode problem, its solution code, and a specific user input, you will generate a step-by-step animation of the algorithm's execution and provide the final output.

LeetCode Problem Number: {{{leetcodeNumber}}}
Problem Description: {{{problemDescription}}}
Solution Code:
\`\`\`python
{{{solutionCode}}}
\`\`\`
User Input: {{{userInput}}}

Your primary goal is to generate data for an 'animation' that shows the state of data structures at each step of the algorithm when run with the provided User Input. You must also determine the final value returned by the function.

You must respond with a JSON object that contains 'visualizationType', 'visualizationData', and 'finalOutput'.

For 'visualizationType', prefer 'animation' if the algorithm is procedural (e.g., sorting, searching, two pointers).

For 'visualizationData' with 'animation' type, you must provide a JSON string representing an array of step objects.
Each step object MUST contain:
1.  'step': A number for the step order.
2.  'description': A clear, concise explanation of what is happening in this step.
3.  'data': An array representing the state of the primary array/list at this step.
4.  'pointers': An object where keys are pointer names (e.g., "i", "j", "left", "pivot") and values are their integer indices in the 'data' array.
5.  'highlight': An array of indices that should be highlighted in this step (e.g., elements being compared or swapped).

For 'finalOutput', provide the actual value that the solution code would return for the given User Input.

Example for a two-pointer array reversal problem with input "[1,2,3,4,5]":
{
  "visualizationType": "animation",
  "visualizationData": "[{\\"step\\":1,\\"description\\":\\"Initialize left pointer at the start and right pointer at the end.\\",\\"data\\":[1,2,3,4,5],\\"pointers\\":{\\"left\\":0,\\"right\\":4},\\"highlight\\":[0,4]},{\\"step\\":2,\\"description\\":\\"Swap elements at left (1) and right (5).\\",\\"data\\":[5,2,3,4,1],\\"pointers\\":{\\"left\\":0,\\"right\\":4},\\"highlight\\":[0,4]},{\\"step\\":3,\\"description\\":\\"Move pointers inward.\\",\\"data\\":[5,2,3,4,1],\\"pointers\\":{\\"left\\":1,\\"right\\":3},\\"highlight\\":[1,3]}]",
  "finalOutput": [5,4,3,2,1]
}

Analyze the provided solution code and generate a step-by-step animation sequence that is easy to follow and accurately reflects the algorithm's logic for the given User Input.
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
