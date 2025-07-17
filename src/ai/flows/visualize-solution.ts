'use server';

/**
 * @fileOverview Generates a step-by-step visualization for a given algorithm and input.
 *
 * - visualizeSolution - A function that takes solution code and user input and returns a detailed animation sequence.
 * - VisualizeSolutionInput - The input type for the visualizeSolution function.
 * - VisualizeSolutionOutput - The return type for the visualizeSolution function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AnimationStepSchema = z.object({
  state: z.array(z.number()).describe('The current state of the array.'),
  pointers: z.record(z.number()).describe('The positions of any pointers or indices (e.g., { "i": 0, "j": 1 }).'),
  action: z.string().describe('A human-readable description of the action taken in this step (e.g., "Swap elements at indices 2 and 4.").'),
});

const VisualizeSolutionOutputSchema = z.object({
  animation: z.array(AnimationStepSchema).describe('A sequence of steps representing the algorithm\'s execution.'),
  output: z.string().describe('The final return value of the function, converted to a string.'),
});

const VisualizeSolutionInputSchema = z.object({
  solutionCode: z.string().describe('The Python code for the solution.'),
  userInput: z.string().describe('The specific input to run the algorithm with (e.g., "[1,8,6,2,5,4,8,3,7]").'),
});

export type VisualizeSolutionInput = z.infer<typeof VisualizeSolutionInputSchema>;
export type VisualizeSolutionOutput = z.infer<typeof VisualizeSolutionOutputSchema>;

export async function visualizeSolution(input: VisualizeSolutionInput): Promise<VisualizeSolutionOutput> {
  return visualizeSolutionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'visualizeSolutionPrompt',
  input: { schema: VisualizeSolutionInputSchema },
  output: { schema: VisualizeSolutionOutputSchema },
  prompt: `
You are an expert algorithm visualizer. Your task is to trace the execution of the given Python code with the provided input and generate a step-by-step animation of an array-based algorithm.

Analyze the provided Python code and the input.
Execute the code mentally or using an interpreter.
At each significant step of the algorithm (e.g., a pointer move, a comparison, a swap, an element being considered), record the state.

The state must include:
1. 'state': The complete array at that moment.
2. 'pointers': A dictionary of all active pointers or indices and their current positions.
3. 'action': A clear, concise description of what just happened.

Example Python Code:
def twoSum(nums, target):
    for i in range(len(nums)):
        for j in range(i + 1, len(nums)):
            if nums[j] == target - nums[i]:
                return [i, j]

Example Input:
nums = [2, 7, 11, 15], target = 9

Example Output JSON Structure:
{
  "animation": [
    { "state": [2, 7, 11, 15], "pointers": { "i": 0 }, "action": "Outer loop starts. i is at index 0." },
    { "state": [2, 7, 11, 15], "pointers": { "i": 0, "j": 1 }, "action": "Inner loop starts. j is at index 1." },
    { "state": [2, 7, 11, 15], "pointers": { "i": 0, "j": 1 }, "action": "Comparing nums[j] (7) with target - nums[i] (9 - 2 = 7). They match." }
  ],
  "output": "[0, 1]"
}

Now, perform the trace for the following:
Solution Code:
\`\`\`python
{{solutionCode}}
\`\`\`

User Input:
\`\`\`
{{userInput}}
\`\`\`
`,
});

const visualizeSolutionFlow = ai.defineFlow(
  {
    name: 'visualizeSolutionFlow',
    inputSchema: VisualizeSolutionInputSchema,
    outputSchema: VisualizeSolutionOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
