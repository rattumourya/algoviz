import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { ProblemData } from '@/lib/types';
import { FileText, GanttChartSquare, ListOrdered } from 'lucide-react';

export default function ProblemDisplay(props: ProblemData) {
  const { problemStatement, constraints, examples } = props;

  return (
    <>
      <Card className="shadow-md">
        <CardHeader className="flex flex-row items-center gap-4 space-y-0">
          <FileText className="h-6 w-6 text-primary" />
          <CardTitle className="font-headline text-2xl">Problem Statement</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-wrap text-foreground/90">{problemStatement}</p>
        </CardContent>
      </Card>
      <Card className="shadow-md">
        <CardHeader className="flex flex-row items-center gap-4 space-y-0">
          <GanttChartSquare className="h-6 w-6 text-primary" />
          <CardTitle className="font-headline text-2xl">Constraints</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-wrap text-foreground/90">{constraints}</p>
        </CardContent>
      </Card>
      <Card className="shadow-md">
        <CardHeader className="flex flex-row items-center gap-4 space-y-0">
          <ListOrdered className="h-6 w-6 text-primary" />
          <CardTitle className="font-headline text-2xl">Examples</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-wrap font-code text-foreground/90">{examples}</p>
        </CardContent>
      </Card>
    </>
  );
}
