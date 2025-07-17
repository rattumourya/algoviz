'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface AnimationStep {
  step: number;
  description: string;
  [key: string]: any;
}

interface AnimationPlayerProps {
  data: string;
}

export default function AnimationPlayer({ data }: AnimationPlayerProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps: AnimationStep[] = useMemo(() => {
    try {
      return JSON.parse(data);
    } catch (e) {
      console.error('Failed to parse animation data:', e);
      return [];
    }
  }, [data]);

  if (steps.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p>Could not load animation. Data might be in an invalid format.</p>
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

  return (
    <Card className="w-full shadow-md">
      <CardHeader>
        <CardTitle className="font-headline text-accent">Animation Step {currentStep + 1}/{steps.length}</CardTitle>
        <CardDescription>
          {activeStepData.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {Object.entries(activeStepData).filter(([key]) => key !== 'step' && key !== 'description').length > 0 && (
          <div className="bg-muted p-3 rounded-md">
            <h4 className="font-semibold mb-2 text-sm">State:</h4>
            <pre className="font-code text-xs">
              {JSON.stringify(
                Object.fromEntries(Object.entries(activeStepData).filter(([key]) => key !== 'step' && key !== 'description')),
                null,
                2
              )}
            </pre>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <Progress value={progress} className="w-full" />
        <div className="flex justify-between w-full">
          <Button variant="outline" onClick={handlePrev} disabled={currentStep === 0}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          <Button onClick={handleNext} disabled={currentStep === steps.length - 1}>
            Next
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
