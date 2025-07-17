'use server';

import { ai } from '@/ai/genkit';
import { understandLeetCodeProblem } from '@/ai/flows/understand-leetcode-problem';
import { visualizeSolution } from '@/ai/flows/visualize-solution';
import { z } from 'zod';

const SimilarProblemSchema = z.object({
  problemNumber: z.number().describe('The LeetCode problem number.'),
  problemName: z.string().describe('The name of the LeetCode problem.'),
  problemStatement: z.string().describe('The problem statement for the similar problem.'),
  dsaTopic: z.string().describe('The primary DSA topic for the similar problem.'),
});

const SolutionAndHintsSchema = z.object({
  solutionCode: z.string().describe('The python solution code for the problem.'),
  solutionExplanation: z.string().describe('A step-by-step explanation of the solution, formatted as markdown.'),
  hints: z.array(z.string()).describe('Three concise and helpful hints to guide the user towards the solution.'),
  similarProblems: z.array(SimilarProblemSchema).describe('A list of all relevant similar LeetCode problems with their details.'),
  defaultInput: z.string().describe('A default valid input for the problem, formatted as a string (e.g., "[1,8,6,2,5,4,8,3,7]")'),
});

export async function getProblemAndSolution(problemNumber: number) {
  try {
    const problemDetails = await understandLeetCodeProblem({ problemNumber });

    if (!problemDetails || !problemDetails.problemStatement) {
      throw new Error(`Could not find details for LeetCode problem #${problemNumber}. Please check the number and try again.`);
    }

    const solutionAndHintsPrompt = `
      You are a LeetCode expert and a world-class software engineer. Given a LeetCode problem, provide an optimal solution in Python, a detailed explanation for the solution, 3 concise, helpful hints, a list of all similar problems with their full details, and a default input example.
      
      Problem Statement: ${problemDetails.problemStatement}
      Constraints: ${problemDetails.constraints}
      Examples: ${problemDetails.examples}

      Respond with a JSON object that strictly follows this Zod schema:
      ${JSON.stringify(SolutionAndHintsSchema.describe())}
    `;

    const llmResponse = await ai.generate({
      prompt: solutionAndHintsPrompt,
      model: 'googleai/gemini-2.0-flash',
      output: {
        format: 'json',
        schema: SolutionAndHintsSchema,
      },
      config: {
        temperature: 0.2,
      },
    });

    const solutionData = llmResponse.output;

    if (!solutionData) {
      throw new Error('Could not generate a solution for the problem.');
    }
    
    return {
      success: true,
      data: {
        ...problemDetails,
        ...solutionData,
        problemNumber: problemNumber,
      }
    };
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred while fetching problem details.';
    return { success: false, error: errorMessage };
  }
}

export async function getVisualization(
  leetcodeNumber: number,
  solutionCode: string,
  problemDescription: string,
  userInput: string
) {
  try {
    const result = await visualizeSolution({ leetcodeNumber, solutionCode, problemDescription, userInput });
    if (!result) {
      throw new Error('Could not generate visualization data.');
    }
    return { success: true, data: result };
  } catch (error)
    {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred during visualization.';
    return { success: false, error: errorMessage };
  }
}
