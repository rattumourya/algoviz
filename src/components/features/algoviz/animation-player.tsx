'use client';

import { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, ChevronLeft, ChevronRight, Pointer, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface AnimationStep {
  step: number;
  description: string;
  data: (string | number)[];
  pointers: { [key: string]: number };
  highlight: number[];
}

interface AnimationPlayerProps {
  data: string;
  finalOutput: any;
}

const POINTER_COLORS = [
  '#f87171', // red-400
  '#60a5fa', // blue-400
  '#facc15', // yellow-400
  '#4ade80', // green-400
  '#c084fc', // purple-400
  '#fb923c', // orange-400
];

export default function AnimationPlayer({ data, finalOutput }: AnimationPlayerProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps: AnimationStep[] = useMemo(() => {
    try {
      const parsedData = JSON.parse(data);
      // Basic validation
      if (Array.isArray(parsedData) && parsedData.length > 0 && parsedData[0].step) {
        return parsedData;
      }
      return [];
    } catch (e) {
      console.error('Failed to parse animation data:', e);
      return [];
    }
  }, [data]);

  useEffect(() => {
    setCurrentStep(0);
  }, [data]);

  const pointerColors = useMemo(() => {
    if (steps.length === 0) return {};
    const allPointers = new Set<string>();
    steps.forEach(step => {
      if (step.pointers) {
        Object.keys(step.pointers).forEach(p => allPointers.add(p));
      }
    });
    const colorMap: { [key: string]: string } = {};
    Array.from(allPointers).forEach((p, i) => {
      colorMap[p] = POINTER_COLORS[i % POINTER_COLORS.length];
    });
    return colorMap;
  }, [steps]);
  
  if (steps.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p>Could not load animation. The data might be in an invalid format or missing required fields like 'data', 'pointers', or 'highlight'.</p>
        </CardContent>
      </Card>
    );
  }

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const progress = ((currentStep + 1) / steps.length) * 100;
  const activeStepData = steps[currentStep];
  const isFinished = currentStep === steps.length - 1;

  return (
    <Card className="w-full shadow-md overflow-hidden">
      <CardHeader>
        <CardTitle className="font-headline text-accent">Animation Step {currentStep + 1}/{steps.length}</CardTitle>
        <CardDescription>
          {activeStepData.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6 items-center">
        <div className="w-full p-4 bg-muted rounded-lg min-h-[120px] flex items-center justify-center">
          <div className="relative flex flex-wrap gap-1 justify-center">
            {activeStepData.data && activeStepData.data.map((value, index) => (
              <div key={index} className="relative pt-8">
                <div
                  className={cn(
                    "w-12 h-12 flex items-center justify-center border-2 rounded-md bg-card transition-all duration-300",
                    activeStepData.highlight?.includes(index) ? 'border-primary shadow-lg scale-110' : 'border-border'
                  )}
                >
                  <span className="text-lg font-bold">{value}</span>
                </div>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1">
                  {activeStepData.pointers && Object.entries(activeStepData.pointers).map(([name, pos]) => 
                    pos === index && (
                      <div 
                        key={name} 
                        className="flex flex-col items-center"
                        style={{ color: pointerColors[name] }}
                      >
                         <span className="text-xs font-bold uppercase">{name}</span>
                        <Pointer className="h-4 w-4 fill-current" />
                      </div>
                    )
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {isFinished && (
          <div className="w-full p-4 rounded-lg bg-green-50 border border-green-200 text-green-800 flex items-center gap-4">
              <Trophy className="h-8 w-8 text-green-500" />
              <div>
                <h4 className="font-bold">Algorithm Finished!</h4>
                <p className="text-sm">Final Output: <span className="font-mono bg-green-100 p-1 rounded-md">{JSON.stringify(finalOutput)}</span></p>
              </div>
          </div>
        )}

        <div className="w-full">
            <h4 className="font-semibold mb-2 text-sm text-left">Pointers State:</h4>
            <div className="flex flex-wrap gap-x-4 gap-y-2">
                {activeStepData.pointers && Object.keys(activeStepData.pointers).length > 0 ? (
                  Object.entries(activeStepData.pointers).map(([name, pos]) => (
                      <div key={name} className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: pointerColors[name] }} />
                          <span className="font-mono text-sm">{name}: <span className="font-bold">{pos}</span></span>
                      </div>
                  ))
                ) : (
                  <span className="text-sm text-muted-foreground">No pointers in this step.</span>
                )}
            </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <Progress value={progress} className="w-full" />
        <div className="flex justify-between w-full">
          <Button variant="outline" onClick={handlePrev} disabled={currentStep === 0}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          <Button onClick={handleNext} disabled={isFinished}>
            Next
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
