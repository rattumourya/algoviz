'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { SimilarProblem } from '@/lib/types';
import { Shapes, Link as LinkIcon } from 'lucide-react';

interface SimilarProblemsProps {
  problems: SimilarProblem[];
}

export default function SimilarProblems({ problems }: SimilarProblemsProps) {
  if (!problems || problems.length === 0) {
    return null;
  }

  return (
    <Card className="shadow-lg">
      <CardHeader className="flex flex-row items-center gap-4 space-y-0">
        <LinkIcon className="h-6 w-6 text-primary" />
        <CardTitle className="font-headline text-2xl">Similar Problems</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="multiple" className="w-full">
          {problems.map((problem) => (
            <AccordionItem value={`item-${problem.problemNumber}`} key={problem.problemNumber}>
              <AccordionTrigger className="font-headline text-lg hover:no-underline">
                {problem.problemNumber}. {problem.problemName}
              </AccordionTrigger>
              <AccordionContent className="space-y-4">
                <p className="whitespace-pre-wrap text-foreground/90">{problem.problemStatement}</p>
                <div>
                  <Badge variant="secondary">
                    <Shapes className="h-3 w-3 mr-1.5" />
                    {problem.dsaTopic}
                  </Badge>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
