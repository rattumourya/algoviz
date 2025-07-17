import { getProblemAndSolution, getVisualization } from "@/app/actions";

type PromiseReturnType<T> = T extends (...args: any) => Promise<infer R> ? R : any;
type ActionResponse<T extends (...args: any) => any> = PromiseReturnType<T>

type ProblemActionResponse = ActionResponse<typeof getProblemAndSolution>;
export type ProblemData = ProblemActionResponse extends { success: true; data: infer D } ? D : never;

type VisActionResponse = ActionResponse<typeof getVisualization>;
export type VisualizationData = VisActionResponse extends { success: true; data: infer D } ? D : never;
