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

**A COMPLETE AND DETAILED EXAMPLE**

Example Python Code:
\`\`\`python
def twoSum(nums, target):
    numMap = {}
    for i, n in enumerate(nums):
        diff = target - n
        if diff in numMap:
            return [numMap[diff], i]
        numMap[n] = i
\`\`\`

Example Input:
\`\`\`
nums = [2, 7, 11, 15], target = 9
\`\`\`

Example Output JSON Structure (You must follow this structure exactly):
\`\`\`json
{
  "animation": [
    { "state": [2, 7, 11, 15], "pointers": { "i": 0 }, "action": "Loop starts. i=0, n=2. Calculate diff = 9 - 2 = 7." },
    { "state": [2, 7, 11, 15], "pointers": { "i": 0 }, "action": "diff (7) is not in numMap. Add n (2) to numMap. numMap is now {2: 0}." },
    { "state": [2, 7, 11, 15], "pointers": { "i": 1 }, "action": "Loop continues. i=1, n=7. Calculate diff = 9 - 7 = 2." },
    { "state": [2, 7, 11, 15], "pointers": { "i": 1 }, "action": "diff (2) is in numMap. Match found!" }
  ],
  "output": "[0, 1]"
}
\`\`\`

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
