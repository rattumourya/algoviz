'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { getVisualization } from '@/app/actions';
import { Loader2, Play } from 'lucide-react';
import type { ProblemData, VisualizationData } from '@/lib/types';
import AnimationPlayer from './animation-player';

interface VisualizationDisplayProps {
  problemData: ProblemData;
}

export default function VisualizationDisplay({ problemData }: VisualizationDisplayProps) {
  const [visualization, setVisualization] = useState<VisualizationData | null>(null);
  const [isVisualizing, setIsVisualizing] = useState(false);
  const { toast } = useToast();

  const handleVisualize = async () => {
    setIsVisualizing(true);
    setVisualization(null);
    const result = await getVisualization(
      problemData.problemNumber,
      problemData.solutionCode,
      problemData.problemStatement
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
          Generate an interactive visualization to better understand the algorithm's execution flow.
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        {!visualization && (
          <Button onClick={handleVisualize} disabled={isVisualizing} size="lg">
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
        )}

        {isVisualizing && !visualization && (
           <div className="mt-4 text-sm text-muted-foreground">AI is thinking... this might take a moment.</div>
        )}

        {visualization && (
          <div className="mt-4 text-left">
            {visualization.visualizationType === 'animation' ? (
              <AnimationPlayer data={visualization.visualizationData} />
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
