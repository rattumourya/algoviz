import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { ProblemData } from '@/lib/types';
import { FileText, GanttChartSquare, ListOrdered, Shapes, Tag, ThumbsUp, Link as LinkIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ProblemDisplay(props: Omit<ProblemData, 'similarProblems'>) {
  const { problemNumber, problemName, dsaTopic, difficultyLevel, problemStatement, constraints, examples } = props;

  const difficultyColors: {[key: string]: string} = {
    "Easy": "bg-green-500 hover:bg-green-500/90",
    "Medium": "bg-yellow-500 hover:bg-yellow-500/90",
    "Hard": "bg-red-500 hover:bg-red-500/90",
  }

  return (
    <>
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">{problemNumber}. {problemName}</CardTitle>
          <div className="flex flex-wrap gap-2 pt-2">
            <Badge className={cn("text-primary-foreground", difficultyColors[difficultyLevel])}>
              <ThumbsUp className="h-3 w-3 mr-1.5" />
              {difficultyLevel}
            </Badge>
            <Badge variant="secondary">
              <Shapes className="h-3 w-3 mr-1.5" />
              {dsaTopic}
            </Badge>
          </div>
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
