'use server';

/**
 * @fileOverview AI-powered issue prioritization for Gitlab Navigator.
 *
 * This module defines a Genkit flow to fetch issues from Gitlab's API and prioritize them based on their relevance to the current branch.
 *
 * @module prioritize-issues
 * @exports {prioritizeIssues} - Main function to prioritize issues.
 * @exports {PrioritizeIssuesInput} - Input type for the prioritizeIssues function.
 * @exports {PrioritizeIssuesOutput} - Output type for the prioritizeIssues function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the input schema
const PrioritizeIssuesInputSchema = z.object({
  currentBranch: z.string().describe('The name of the current branch.'),
  issues: z.array(z.string()).describe('An array of Gitlab issue descriptions.'),
  projectDetails: z.string().optional().describe('Details about the project, like coding conventions and architecture')
});

export type PrioritizeIssuesInput = z.infer<typeof PrioritizeIssuesInputSchema>;

// Define the output schema
const PrioritizeIssuesOutputSchema = z.array(
  z.object({
    issue: z.string().describe('The original issue description.'),
    relevanceScore: z.number().describe('A score indicating the relevance of the issue to the current branch.'),
    reason: z.string().describe('The reasoning behind the relevance score.'),
  })
);

export type PrioritizeIssuesOutput = z.infer<typeof PrioritizeIssuesOutputSchema>;


// Define the tool to fetch project details
const getProjectDetails = ai.defineTool({
  name: 'getProjectDetails',
  description: 'Fetches project details, including coding conventions, architecture, and other relevant information.',
  inputSchema: z.object({
    currentBranch: z.string().describe('The current branch to fetch details for')
  }),
  outputSchema: z.string(),
}, async (input) => {
  // TODO: Actually implement a tool to get the project details; for now, return a static string
  return `Details for branch ${input.currentBranch}: This project uses Typescript and React.  Naming conventions are mixedCase for variables and PascalCase for components.`;
});


// Define the prompt
const prioritizeIssuesPrompt = ai.definePrompt({
  name: 'prioritizeIssuesPrompt',
  input: {schema: PrioritizeIssuesInputSchema},
  output: {schema: PrioritizeIssuesOutputSchema},
  tools: [getProjectDetails],
  prompt: `You are an AI assistant that prioritizes Gitlab issues based on their relevance to a given branch.

  Prioritize the following issues based on their relevance to the current branch: {{{currentBranch}}}.

  Here are the issues to prioritize:
  {{#each issues}}
  - {{{this}}}
  {{/each}}

  Project Details (if available):
  {{#if projectDetails}}
  {{{projectDetails}}}
  {{else}}
  No project details available.
  {{/if}}

  Instructions:
  1. Analyze each issue and determine its relevance to the current branch.
  2. Assign a relevance score between 0 and 1 to each issue, where 1 is highly relevant and 0 is not relevant.
  3. Provide a brief explanation for the assigned score.
  4. Respond with a JSON array of objects, where each object contains the issue, relevance score, and explanation.
  5. If project details are available, use them to inform your relevance assessment.

  Output Format:
  [{
  "issue": "...",
  "relevanceScore": 0.0,
  "reason": "..."
  }]

  Remember to use the getProjectDetails tool if you believe having the project details will help.
  `,
});

// Define the flow
const prioritizeIssuesFlow = ai.defineFlow(
  {
    name: 'prioritizeIssuesFlow',
    inputSchema: PrioritizeIssuesInputSchema,
    outputSchema: PrioritizeIssuesOutputSchema,
  },
  async input => {
    // Conditionally fetch project details if they are not already provided
    let projectDetails = input.projectDetails;
    if (!projectDetails) {
      const details = await getProjectDetails({
        currentBranch: input.currentBranch
      });
      projectDetails = details;
    }
    const {output} = await prioritizeIssuesPrompt({...input, projectDetails});
    return output!;
  }
);

/**
 * Prioritizes issues based on relevance to the current branch using AI.
 * @param input - The input for prioritizing issues.
 * @returns A promise that resolves to the prioritized issues.
 */
export async function prioritizeIssues(input: PrioritizeIssuesInput): Promise<PrioritizeIssuesOutput> {
  return prioritizeIssuesFlow(input);
}
