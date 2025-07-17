'use client';

import { useState, useEffect, useMemo } from 'react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, Pause, SkipBack, SkipForward, RotateCcw, Rabbit, Snail } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { VisualizeSolutionOutput } from '@/ai/flows/visualize-solution';

interface AnimationPlayerProps {
  data: VisualizeSolutionOutput;
  dsaTopic: string;
}

const POINTER_COLORS = [
  '#3b82f6', '#ef4444', '#22c55e', '#f97316', '#8b5cf6', '#ec4899'
];

export default function AnimationPlayer({ data }: AnimationPlayerProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(50); // From 0 (fast) to 100 (slow)
  
  const step = data.animation[currentStep];

  useEffect(() => {
    setCurrentStep(0);
    setIsPlaying(false);
  }, [data]);

  useEffect(() => {
    if (isPlaying && currentStep < data.animation.length - 1) {
      const timeout = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, 50 + speed * 15);
      return () => clearTimeout(timeout);
    } else if (isPlaying) {
        setIsPlaying(false);
    }
  }, [isPlaying, currentStep, speed, data.animation.length]);

  const togglePlayPause = () => {
    if (currentStep === data.animation.length - 1) {
        setCurrentStep(0);
        setIsPlaying(true);
    } else {
        setIsPlaying(!isPlaying);
    }
  };

  const goToStep = (stepIndex: number) => {
    setIsPlaying(false);
    setCurrentStep(stepIndex);
  };
  
  const pointerColorMap = useMemo(() => {
    const uniquePointers = new Set<string>();
    data.animation.forEach(step => {
        Object.keys(step.pointers).forEach(p => uniquePointers.add(p));
    });
    const map: Record<string, string> = {};
    Array.from(uniquePointers).forEach((p, i) => {
        map[p] = POINTER_COLORS[i % POINTER_COLORS.length];
    });
    return map;
  }, [data.animation]);

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle>Algorithm Animation</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-muted p-4 rounded-lg min-h-[200px] flex items-center justify-center overflow-x-auto">
           <div className="flex space-x-2 items-end h-40">
                {step.state.map((value, index) => (
                    <div key={index} className="flex flex-col items-center relative transition-all duration-300">
                        <div className="flex flex-col items-center absolute -top-12">
                            {Object.entries(step.pointers).map(([name, pos]) => 
                                pos === index && (
                                    <div key={name} className="flex flex-col items-center transition-all duration-300" style={{ transform: `translateX(0)` }}>
                                        <span className="text-xs font-bold" style={{ color: pointerColorMap[name] }}>{name}</span>
                                        <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent" style={{ borderTopColor: pointerColorMap[name] }} />
                                    </div>
                                )
                            )}
                        </div>
                        <div className={cn("w-10 flex items-center justify-center text-white font-bold rounded-t-md transition-colors duration-300", 
                            Object.values(step.pointers).includes(index) ? 'bg-primary/80' : 'bg-primary/50'
                        )} style={{ height: `${Math.max(10, value * 10 + 10)}px` }}>
                            {value}
                        </div>
                    </div>
                ))}
            </div>
        </div>

        <div className="text-center p-2 bg-background rounded-md border">
            <p className="font-mono text-sm">{step.action}</p>
        </div>

        {currentStep === data.animation.length - 1 && (
            <div className="text-center p-2 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-md border border-green-200 dark:border-green-800">
                <p className="font-semibold">Finished! Final Output: <span className="font-mono">{data.output}</span></p>
            </div>
        )}

      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <div className="w-full">
            <Slider
                value={[currentStep]}
                max={data.animation.length - 1}
                step={1}
                onValueChange={(value) => goToStep(value[0])}
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>Step {currentStep + 1}</span>
                <span>{data.animation.length}</span>
            </div>
        </div>
        <div className="flex items-center justify-center gap-2 w-full">
          <Button variant="ghost" size="icon" onClick={() => goToStep(0)} disabled={currentStep === 0}>
            <SkipBack className="h-5 w-5" />
          </Button>
          <Button size="lg" onClick={togglePlayPause}>
            {isPlaying ? <Pause className="h-6 w-6" /> : (currentStep === data.animation.length - 1 ? <RotateCcw className="h-6 w-6" /> : <Play className="h-6 w-6" />)}
          </Button>
          <Button variant="ghost" size="icon" onClick={() => goToStep(Math.min(currentStep + 1, data.animation.length - 1))} disabled={currentStep === data.animation.length - 1}>
            <SkipForward className="h-5 w-5" />
          </Button>
        </div>
        <div className="flex items-center gap-2 w-full max-w-xs">
            <Snail className="h-5 w-5 text-muted-foreground" />
            <Slider
                value={[speed]}
                onValueChange={(value) => setSpeed(value[0])}
            />
            <Rabbit className="h-5 w-5 text-muted-foreground" />
        </div>
      </CardFooter>
    </Card>
  );
}
