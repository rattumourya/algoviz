'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { BrainCircuit, Loader2, Wand2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { getProblemAndSolution } from '@/app/actions';
import type { ProblemData } from '@/lib/types';
import ProblemDisplay from '@/components/features/algoviz/problem-display';
import SolutionPanel from '@/components/features/algoviz/solution-panel';
import { Skeleton } from '@/components/ui/skeleton';
import SimilarProblems from '@/components/features/algoviz/similar-problems';

const formSchema = z.object({
  problemNumber: z.coerce.number().min(1, 'Please enter a valid LeetCode problem number.'),
});

export default function Home() {
  const [problemData, setProblemData] = useState<ProblemData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      problemNumber: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setProblemData(null);
    const result = await getProblemAndSolution(values.problemNumber);
    setIsLoading(false);

    if (result.success) {
      setProblemData(result.data);
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error,
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 py-8 md:p-8">
        <header className="flex flex-col items-center text-center mb-8">
          <div className="p-3 bg-primary/10 rounded-full mb-4">
            <BrainCircuit className="h-10 w-10 text-primary" />
          </div>
          <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary">AlgoViz Assist</h1>
          <p className="mt-2 text-lg text-muted-foreground max-w-2xl">
            Enter a LeetCode problem number to get a detailed breakdown, hints, solution, and an interactive visualization.
          </p>
        </header>

        <Card className="max-w-2xl mx-auto shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline">Analyze LeetCode Problem</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col sm:flex-row items-start gap-4">
                <FormField
                  control={form.control}
                  name="problemNumber"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="sr-only">LeetCode Problem Number</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 1" {...field} className="text-base" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Wand2 className="mr-2" />
                      Analyze
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {isLoading && (
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-2 flex flex-col gap-6">
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-48 w-full" />
            </div>
            <div className="lg:col-span-3">
              <Skeleton className="h-[40rem] w-full" />
            </div>
          </div>
        )}

        {problemData && (
          <>
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
              <div className="lg:col-span-2 flex flex-col gap-6">
                <ProblemDisplay {...problemData} />
              </div>
              <div className="lg:col-span-3">
                <SolutionPanel problemData={problemData} />
              </div>
            </div>
            <div className="mt-8">
              <SimilarProblems problems={problemData.similarProblems} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
