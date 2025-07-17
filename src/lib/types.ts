import { getProblemAndSolution } from "@/app/actions";

type PromiseReturnType<T> = T extends (...args: any) => Promise<infer R> ? R : any;
type ActionResponse<T extends (...args: any) => any> = PromiseReturnType<T>

type ProblemActionResponse = ActionResponse<typeof getProblemAndSolution>;
export type ProblemData = ProblemActionResponse extends { success: true; data: infer D } ? D : never;

// This needs to be defined explicitly as the schema is now in a separate file.
export type SimilarProblem = {
    problemNumber: number;
    problemName: string;
    problemStatement: string;
    dsaTopic: string;
    relationship: string;
};
