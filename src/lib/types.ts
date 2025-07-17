import { getProblemAndSolution } from "@/app/actions";

type PromiseReturnType<T> = T extends (...args: any) => Promise<infer R> ? R : any;
type ActionResponse<T extends (...args: any) => any> = PromiseReturnType<T>

type ProblemActionResponse = ActionResponse<typeof getProblemAndSolution>;
export type ProblemData = ProblemActionResponse extends { success: true; data: infer D } ? D : never;
export type SimilarProblem = ProblemData['similarProblems'][number];
