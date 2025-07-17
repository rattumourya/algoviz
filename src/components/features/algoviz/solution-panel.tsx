
'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent } from '@/components/ui/card';
import type { ProblemData } from '@/lib/types';
import { Lightbulb, Code, PlaySquare, Copy, Check } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import VisualizationDisplay from './visualization-display';
import ReactMarkdown from 'react-markdown';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface SolutionPanelProps {
  problemData: ProblemData;
}

interface LanguageTabProps {
  language: string;
  code: string;
}

const LanguageTabContent = ({ language, code }: LanguageTabProps) => {
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = () => {
    if (!code) {
        toast({ variant: 'destructive', title: 'Error', description: 'No code available to copy for this language.' });
        return;
    }
    navigator.clipboard.writeText(code).then(() => {
        setIsCopied(true);
        toast({ title: 'Success', description: `${language} code copied to clipboard!` });
        setTimeout(() => setIsCopied(false), 2000);
    }, (err) => {
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to copy code.' });
    });
  };

  return (
    <div className="relative">
      <Button
          size="icon"
          variant="ghost"
          className="absolute top-2 right-2 h-7 w-7 z-10"
          onClick={handleCopy}
      >
          {isCopied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
          <span className="sr-only">Copy {language} code</span>
      </Button>
      <ScrollArea className="h-60 scroll-fade">
        <div className="bg-muted rounded-md p-4">
          <pre className="font-code text-sm whitespace-pre-wrap"><code>{code || `// No solution provided for ${language}`}</code></pre>
        </div>
      </ScrollArea>
    </div>
  );
};

export default function SolutionPanel({ problemData }: SolutionPanelProps) {
  const { hints, solutionCodes, solutionExplanation, dsaTopic, defaultInput } = problemData;

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
                  <AccordionContent className="font-code">{hint}</AccordionContent>
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
                                p: ({node, ...props}) => <div className="mb-2 last:mb-0" {...props} />,
                                pre: ({ node, ...props }) => <pre className="font-code text-sm bg-muted rounded-md p-3 my-3 overflow-x-auto" {...props} />,
                                code({node, inline, className, children, ...props}) {
                                    return !inline ? (
                                    <pre className="font-code text-sm bg-muted rounded-md p-3 my-3 overflow-x-auto" {...props}>
                                        <code className={className}>
                                        {children}
                                        </code>
                                    </pre>
                                    ) : (
                                    <code className="font-code bg-muted px-1.5 py-0.5 rounded-[0.3rem] text-sm" {...props}>
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
                 <Tabs defaultValue="python" className="w-full">
                    <TabsList>
                        <TabsTrigger value="python">Python</TabsTrigger>
                        <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                        <TabsTrigger value="java">Java</TabsTrigger>
                        <TabsTrigger value="c">C</TabsTrigger>
                        <TabsTrigger value="cpp">C++</TabsTrigger>
                    </TabsList>
                    <TabsContent value="python" className="mt-2">
                        <LanguageTabContent language="Python" code={solutionCodes.python} />
                    </TabsContent>
                    <TabsContent value="javascript" className="mt-2">
                        <LanguageTabContent language="JavaScript" code={solutionCodes.javascript} />
                    </TabsContent>
                    <TabsContent value="java" className="mt-2">
                        <LanguageTabContent language="Java" code={solutionCodes.java} />
                    </TabsContent>
                    <TabsContent value="c" className="mt-2">
                        <LanguageTabContent language="C" code={solutionCodes.c} />
                    </TabsContent>
                    <TabsContent value="cpp" className="mt-2">
                        <LanguageTabContent language="C++" code={solutionCodes.cpp} />
                    </TabsContent>
                 </Tabs>
              </div>
          </TabsContent>

          <TabsContent value="visualize" className="mt-4">
            <VisualizationDisplay 
                solutionCodes={solutionCodes}
                defaultInput={defaultInput}
                dsaTopic={dsaTopic}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
