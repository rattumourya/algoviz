
'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent } from '@/components/ui/card';
import type { ProblemData } from '@/lib/types';
import { Lightbulb, Code, PlaySquare } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import VisualizationDisplay from './visualization-display';
import ReactMarkdown from 'react-markdown';


interface SolutionPanelProps {
  problemData: ProblemData;
}

export default function SolutionPanel({ problemData }: SolutionPanelProps) {
  const { hints, solutionCode, solutionExplanation, dsaTopic, defaultInput } = problemData;

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
                <ScrollArea className="h-60 scroll-fade">
                  <div className="prose prose-sm max-w-none text-foreground/90 pr-4">
                    <ReactMarkdown
                      components={{
                        p: (props) => <div {...props} className="mb-4 last:mb-0" />,
                        code({node, inline, className, children, ...props}) {
                          const match = /language-(\w+)/.exec(className || '')
                          return !inline ? (
                            <pre className="font-code text-sm bg-muted rounded-md p-3 my-3 overflow-x-auto">
                              <code {...props}>
                                {children}
                              </code>
                            </pre>
                          ) : (
                            <code className="font-code bg-muted px-1 py-0.5 rounded-sm" {...props}>
                              {children}
                            </code>
                          )
                        }
                      }}
                    >
                      {solutionExplanation}
                    </ReactMarkdown>
                  </div>
                </ScrollArea>
              </div>
              <div>
                <h3 className="font-headline text-xl font-semibold mb-2">Code</h3>
                <ScrollArea className="h-60 scroll-fade">
                  <div className="bg-muted rounded-md p-4">
                    <pre className="font-code text-sm"><code>{solutionCode}</code></pre>
                  </div>
                </ScrollArea>
              </div>
          </TabsContent>

          <TabsContent value="visualize" className="mt-4">
            <VisualizationDisplay 
                solutionCode={solutionCode}
                defaultInput={defaultInput}
                dsaTopic={dsaTopic}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
