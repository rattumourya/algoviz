'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent } from '@/components/ui/card';
import type { ProblemData } from '@/lib/types';
import { Lightbulb, Code, PlaySquare, ExternalLink } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getVisualizationUrl } from '@/lib/dsa-visualization-map';
import { Button } from '@/components/ui/button';

interface SolutionPanelProps {
  problemData: ProblemData;
}

export default function SolutionPanel({ problemData }: SolutionPanelProps) {
  const { hints, solutionCode, solutionExplanation, dsaTopic } = problemData;
  const visualizationUrl = getVisualizationUrl(dsaTopic);

  return (
    <Card className="shadow-lg w-full">
      <CardContent className="p-2 md:p-4">
        <Tabs defaultValue="hints" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="hints"><Lightbulb className="mr-2 h-4 w-4" />Hints</TabsTrigger>
            <TabsTrigger value="solution"><Code className="mr-2 h-4 w-4" />Solution</TabsTrigger>
            <TabsTrigger value="visualize"><PlaySquare className="mr-2 h-4 w-4" />Visualize</TabsTrigger>
          </TabsList>
          
          <TabsContent value="hints" className="mt-4">
            <Accordion type="single" collapsible className="w-full">
              {hints.map((hint, index) => (
                <AccordionItem value={`item-${index + 1}`} key={index}>
                  <AccordionTrigger className="hover:no-underline">Hint #{index + 1}</AccordionTrigger>
                  <AccordionContent>{hint}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </TabsContent>
          
          <TabsContent value="solution" className="mt-4 space-y-4">
              <div>
                <h3 className="font-headline text-xl font-semibold mb-2">Explanation</h3>
                <ScrollArea className="h-60">
                  <div className="prose prose-sm max-w-none text-foreground/90 pr-4" dangerouslySetInnerHTML={{ __html: solutionExplanation.replace(/\\n/g, '<br />') }} />
                </ScrollArea>
              </div>
              <div>
                <h3 className="font-headline text-xl font-semibold mb-2">Code</h3>
                <ScrollArea className="h-60">
                  <div className="bg-muted rounded-md p-4">
                    <pre className="font-code text-sm"><code>{solutionCode}</code></pre>
                  </div>
                </ScrollArea>
              </div>
          </TabsContent>

          <TabsContent value="visualize" className="mt-4">
            <Card className="border-dashed">
                <CardContent className="pt-6 text-center space-y-4">
                    <p className="text-muted-foreground">
                        To better understand the core concepts behind the <span className="font-semibold text-primary">{dsaTopic}</span> topic, we recommend exploring the interactive visualization on USFCA's website.
                    </p>
                    <Button asChild size="lg">
                        <a href={visualizationUrl} target="_blank" rel="noopener noreferrer">
                            Visualize <span className="font-bold mx-1">{dsaTopic}</span> Concepts
                            <ExternalLink className="ml-2 h-5 w-5" />
                        </a>
                    </Button>
                </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
