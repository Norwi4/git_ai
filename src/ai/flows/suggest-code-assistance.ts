'use server';

/**
 * @fileOverview AI-powered code assistant flow.
 *
 * - suggestCodeAssistance - A function that provides code suggestions and assistance.
 * - SuggestCodeAssistanceInput - The input type for the suggestCodeAssistance function.
 * - SuggestCodeAssistanceOutput - The return type for the suggestCodeAssistance function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestCodeAssistanceInputSchema = z.object({
  codeSnippet: z.string().describe('The code snippet to provide assistance for.'),
  projectDetails: z.string().describe('Details about the project, including coding conventions.'),
  relevantFiles: z.string().describe('List of relevant files for context.'),
});
export type SuggestCodeAssistanceInput = z.infer<typeof SuggestCodeAssistanceInputSchema>;

const SuggestCodeAssistanceOutputSchema = z.object({
  suggestions: z.string().describe('Code suggestions and assistance based on the project details and coding conventions.'),
});
export type SuggestCodeAssistanceOutput = z.infer<typeof SuggestCodeAssistanceOutputSchema>;

export async function suggestCodeAssistance(input: SuggestCodeAssistanceInput): Promise<SuggestCodeAssistanceOutput> {
  return suggestCodeAssistanceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestCodeAssistancePrompt',
  input: {schema: SuggestCodeAssistanceInputSchema},
  output: {schema: SuggestCodeAssistanceOutputSchema},
  prompt: `You are an AI-powered code assistant that provides inline code suggestions and assistance based on the project details and coding conventions.\n\nProject Details: {{{projectDetails}}}\nRelevant Files: {{{relevantFiles}}}\n\nCode Snippet: {{{codeSnippet}}}\n\nProvide code suggestions and assistance that adhere to the project's standards and best practices.`,
});

const suggestCodeAssistanceFlow = ai.defineFlow(
  {
    name: 'suggestCodeAssistanceFlow',
    inputSchema: SuggestCodeAssistanceInputSchema,
    outputSchema: SuggestCodeAssistanceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
