
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { getVisualization } from '@/app/actions';
import { Loader2, Play } from 'lucide-react';
import AnimationPlayer from './animation-player';
import type { VisualizeSolutionOutput } from '@/ai/flows/visualize-solution';
import type { ProblemData } from '@/lib/types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const formSchema = z.object({
  userInput: z.string().min(1, 'Please provide an input to visualize.'),
});

interface VisualizationDisplayProps {
  solutionCodes: ProblemData['solutionCodes'];
  defaultInput: string;
  dsaTopic: string;
}

export default function VisualizationDisplay({ solutionCodes, defaultInput, dsaTopic }: VisualizationDisplayProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [visualizationData, setVisualizationData] = useState<VisualizeSolutionOutput | null>(null);
  const [animationKey, setAnimationKey] = useState(0);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userInput: defaultInput,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setVisualizationData(null);

    const solutionCode = solutionCodes.python || solutionCodes.cpp || solutionCodes.c || solutionCodes.javascript;

    if (!solutionCode) {
        setIsLoading(false);
        toast({
            variant: 'destructive',
            title: 'Visualization Error',
            description: 'No compatible solution code (Python, C++, C, JS) is available to generate a visualization.',
        });
        return;
    }

    const result = await getVisualization({ solutionCode, userInput: values.userInput });
    setIsLoading(false);

    if (result.success) {
      setVisualizationData(result.data);
      setAnimationKey(prevKey => prevKey + 1); // Force re-mount of AnimationPlayer
    } else {
      toast({
        variant: 'destructive',
        title: 'Visualization Error',
        description: result.error,
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Interactive Visualization</CardTitle>
          <CardDescription>
            Enter your own input to see how the algorithm solves the problem step-by-step. The visualization uses the Python solution primarily, with fallbacks to other languages.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="userInput"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Input</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., height = [1, 8, 6, 2, 5, 4, 8, 3, 7]"
                        className="font-code"
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="pt-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span tabIndex={0}>
                        <Button type="submit" disabled={true}>
                          <Play className="mr-2 h-4 w-4" />
                          Generate Visualization
                        </Button>
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Visualization for this problem is still in development.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading && (
         <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center h-96">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-lg font-semibold">Generating Visualization...</p>
            <p className="text-sm text-muted-foreground">The AI is analyzing the code, this might take a moment.</p>
        </div>
      )}

      {visualizationData && <AnimationPlayer key={animationKey} data={visualizationData} dsaTopic={dsaTopic} />}
    </div>
  );
}
