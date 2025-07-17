
'use server';

import { understandLeetCodeProblem } from '@/ai/flows/understand-leetcode-problem';
import { visualizeSolution, type VisualizeSolutionInput } from '@/ai/flows/visualize-solution';
import { generateSolution } from '@/ai/flows/generate-solution';

export async function getProblemAndSolution(problemNumber: number) {
  try {
    const problemDetails = await understandLeetCodeProblem({ problemNumber });

    if (!problemDetails || !problemDetails.problemStatement) {
      throw new Error(`Could not find details for LeetCode problem #${problemNumber}. Please check the number and try again.`);
    }
    
    const solutionData = await generateSolution({
      problemStatement: problemDetails.problemStatement,
      constraints: problemDetails.constraints,
      examples: problemDetails.examples,
    });

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

export async function getVisualization(input: VisualizeSolutionInput) {
    try {
        const visualizationData = await visualizeSolution(input);
        if (!visualizationData || !visualizationData.animation) {
            throw new Error('Could not generate visualization from the AI model.');
        }
        return { success: true, data: visualizationData };
    } catch (error) {
        console.error("Error getting visualization:", error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred while generating the visualization.';
        return { success: false, error: errorMessage };
    }
}
