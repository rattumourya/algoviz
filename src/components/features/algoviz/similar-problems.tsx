'use client';

import { useState } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { SimilarProblem } from '@/lib/types';
import { Shapes, Link as LinkIcon, ChevronLeft, ChevronRight, Info } from 'lucide-react';
import { toKebabCase } from '@/lib/utils';
import Link from 'next/link';

interface SimilarProblemsProps {
  problems: SimilarProblem[];
}

const PROBLEMS_PER_PAGE = 5;

export default function SimilarProblems({ problems }: SimilarProblemsProps) {
  const [currentPage, setCurrentPage] = useState(1);

  if (!problems || problems.length === 0) {
    return null;
  }

  const totalPages = Math.ceil(problems.length / PROBLEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * PROBLEMS_PER_PAGE;
  const endIndex = startIndex + PROBLEMS_PER_PAGE;
  const currentProblems = problems.slice(startIndex, endIndex);

  const goToNextPage = () => {
    setCurrentPage((page) => Math.min(page + 1, totalPages));
  };

  const goToPreviousPage = () => {
    setCurrentPage((page) => Math.max(page - 1, 1));
  };

  return (
    <Card className="shadow-lg">
      <CardHeader className="flex flex-row items-center gap-4 space-y-0">
        <LinkIcon className="h-6 w-6 text-primary" />
        <CardTitle className="font-headline text-2xl">Similar Problems</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="multiple" className="w-full">
          {currentProblems.map((problem) => (
            <AccordionItem value={`item-${problem.problemNumber}`} key={problem.problemNumber}>
              <AccordionTrigger className="font-headline text-lg hover:no-underline">
                <div className="flex items-center gap-2">
                    <span>{problem.problemNumber}. {problem.problemName}</span>
                     <Button variant="ghost" size="icon" className="h-7 w-7" asChild onClick={(e) => e.stopPropagation()}>
                        <Link href={`https://leetcode.com/problems/${toKebabCase(problem.problemName)}/`} target="_blank" rel="noopener noreferrer">
                            <LinkIcon className="h-4 w-4 text-primary" />
                            <span className="sr-only">Solve on LeetCode</span>
                        </Link>
                    </Button>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4">
                <p className="whitespace-pre-wrap text-foreground/90">{problem.problemStatement}</p>
                <div className="bg-primary/5 border-l-4 border-primary/50 p-3 rounded-r-md">
                    <div className="flex items-center gap-2 mb-2">
                        <Info className="h-4 w-4 text-primary" />
                        <h4 className="font-semibold text-sm">How it's related:</h4>
                    </div>
                    <p className="text-sm text-foreground/80 italic">{problem.relationship}</p>
                </div>
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
      {totalPages > 1 && (
        <CardFooter className="flex justify-between items-center pt-4">
          <Button variant="outline" onClick={goToPreviousPage} disabled={currentPage === 1}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
          <Button variant="outline" onClick={goToNextPage} disabled={currentPage === totalPages}>
            Next
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
