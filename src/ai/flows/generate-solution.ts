
'use server';
/**
 * @fileOverview Generates a solution, hints, and similar problems for a given LeetCode problem.
 * 
 * - generateSolution - A function that takes problem details and returns a comprehensive solution set.
 * - GenerateSolutionInput - The input type for the generateSolution function.
 * - GenerateSolutionOutput - The return type for the generateSolution function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const SimilarProblemSchema = z.object({
  problemNumber: z.number().describe('The LeetCode problem number.'),
  problemName: z.string().describe('The name of the LeetCode problem.'),
  problemStatement: z.string().describe('The problem statement for the similar problem.'),
  dsaTopic: z.string().describe('The primary DSA topic for the similar problem.'),
  relationship: z.string().describe('A brief explanation of how this problem is related to the original one.'),
});

const SolutionCodeSchema = z.object({
    python: z.string().describe('The optimal solution code in Python.'),
    javascript: z.string().describe('The optimal solution code in JavaScript.'),
    java: z.string().describe('The optimal solution code in Java.'),
    c: z.string().describe('The optimal solution code in C.'),
    cpp: z.string().describe('The optimal solution code in C++.'),
});

const GenerateSolutionOutputSchema = z.object({
  solutionCodes: SolutionCodeSchema,
  solutionExplanation: z.string().describe('A step-by-step explanation of the solution, formatted as markdown. The explanation should be language-agnostic.'),
  hints: z.array(z.string()).describe('Three concise and helpful hints to guide the user towards the solution.'),
  similarProblems: z.array(SimilarProblemSchema).describe('A list of all relevant similar LeetCode problems with their details.'),
  defaultInput: z.string().describe('A default valid input for the problem, formatted as a string (e.g., "height = [1,8,6,2,5,4,8,3,7]")'),
});

const GenerateSolutionInputSchema = z.object({
    problemStatement: z.string(),
    constraints: z.string(),
    examples: z.string(),
});


export type GenerateSolutionInput = z.infer<typeof GenerateSolutionInputSchema>;
export type GenerateSolutionOutput = z.infer<typeof GenerateSolutionOutputSchema>;


export async function generateSolution(input: GenerateSolutionInput): Promise<GenerateSolutionOutput> {
    return generateSolutionFlow(input);
}


const prompt = ai.definePrompt({
    name: 'generateSolutionPrompt',
    input: { schema: GenerateSolutionInputSchema },
    output: { schema: GenerateSolutionOutputSchema, format: 'json' },
    prompt: `
      You are a LeetCode expert and a world-class software engineer. Given a LeetCode problem, provide an optimal solution in Python, JavaScript, Java, C, and C++.
      Also provide a single, language-agnostic, detailed explanation for the solution, 3 concise, helpful hints, a list of all similar problems with their full details, and a default input example.
      For each similar problem, include a brief explanation describing how it relates to the main problem.
      
      Problem Statement: {{{problemStatement}}}
      Constraints: {{{constraints}}}
      Examples: {{{examples}}}
    `,
    config: {
        temperature: 0.2,
    },
});


const generateSolutionFlow = ai.defineFlow(
  {
    name: 'generateSolutionFlow',
    inputSchema: GenerateSolutionInputSchema,
    outputSchema: GenerateSolutionOutputSchema,
  },
  async input => {
    try {
        const { output } = await prompt(input);
        if (!output) {
            throw new Error('The AI model did not return a valid solution structure.');
        }
        return output;
    } catch (error) {
        console.error('Error generating solution:', error);
        throw new Error('Failed to generate a complete solution from the AI. The model may have returned an invalid format.');
    }
  }
);
