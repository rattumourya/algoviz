'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { getVisualization } from '@/app/actions';
import { Loader2, Play } from 'lucide-react';
import type { ProblemData, VisualizationData } from '@/lib/types';
import AnimationPlayer from './animation-player';

interface VisualizationDisplayProps {
  problemData: ProblemData;
}

const formSchema = z.object({
  userInput: z.string().min(1, 'Please provide an input to visualize.'),
});

export default function VisualizationDisplay({ problemData }: VisualizationDisplayProps) {
  const [visualization, setVisualization] = useState<VisualizationData | null>(null);
  const [isVisualizing, setIsVisualizing] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userInput: problemData.defaultInput || '',
    },
  });

  useEffect(() => {
    form.reset({ userInput: problemData.defaultInput || '' });
  }, [problemData.defaultInput, form]);

  const handleVisualize = async (values: z.infer<typeof formSchema>) => {
    setIsVisualizing(true);
    setVisualization(null);
    const result = await getVisualization(
      problemData.problemNumber,
      problemData.solutionCode,
      problemData.problemStatement,
      values.userInput
    );
    setIsVisualizing(false);
    if (result.success) {
      setVisualization(result.data);
    } else {
      toast({
        variant: 'destructive',
        title: 'Visualization Error',
        description: result.error,
      });
    }
  };

  return (
    <Card className="border-dashed">
      <CardHeader>
        <CardTitle className="font-headline">Solution Visualization</CardTitle>
        <CardDescription>
          Enter a custom input and generate an interactive visualization to understand the algorithm's execution.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleVisualize)} className="space-y-4">
            <FormField
              control={form.control}
              name="userInput"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Custom Input</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., [1, 8, 6, 2, 5]"
                      className="font-code"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isVisualizing} size="lg" className="w-full">
              {isVisualizing ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Play className="mr-2 h-5 w-5" />
                  Generate Visualization
                </>
              )}
            </Button>
          </form>
        </Form>

        {isVisualizing && !visualization && (
           <div className="mt-4 text-sm text-muted-foreground text-center">AI is thinking... this might take a moment.</div>
        )}

        {visualization && (
          <div className="mt-4 text-left">
            {visualization.visualizationType === 'animation' ? (
              <AnimationPlayer data={visualization.visualizationData} finalOutput={visualization.finalOutput} />
            ) : (
              <div>
                <h4 className="font-semibold">Diagram Data</h4>
                <pre className="bg-muted p-2 rounded-md mt-2 text-xs overflow-auto">
                  {JSON.stringify(JSON.parse(visualization.visualizationData), null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
