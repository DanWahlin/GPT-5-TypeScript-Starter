import ModelClient, { isUnexpected } from "@azure-rest/ai-inference";
import { AzureKeyCredential } from "@azure/core-auth";
import { config } from 'dotenv';
config({ quiet: true });

/* 
This sample is intended to be used by GitHub models. Configure the endpoint and key (Personal Access Token) 
in the .env file to use.
*/

interface MathExplanationSchema {
  steps: string[];
  answer: number;
}

const endpoint = process.env.AI_ENDPOINT!;
const token = process.env.AI_KEY!;
const model = process.env.AI_MODEL || 'gpt-5';

export async function main() {

    const client = ModelClient(
        endpoint,
        new AzureKeyCredential(token),
        {
            apiVersion: '2025-01-01-preview'
        }
    );

    const schema = {
        name: 'math_explanation',
        schema: {
            type: 'object' as const,
            properties: {
                steps: { type: 'array' as const, items: { type: 'string' as const } },
                answer: { type: 'number' as const },
            },
            required: ['steps', 'answer'] as const,
            additionalProperties: false,
        },
        strict: true,
    };

    const result = await client.path('/chat/completions').post({
        body: {
            messages: [
                { role: 'system', content: 'Return JSON only.' },
                { role: 'user', content: 'What is 23 * 7? Show your steps.' },
            ],
            response_format: { type: 'json_schema', json_schema: schema },
            model: model
        }
    });

    if (isUnexpected(result)) {
        throw result.body.error;
    }

    const content = result.body.choices[0].message?.content ?? '{}'; 
    const data: MathExplanationSchema = JSON.parse(content); 
    console.log('Steps:', data.steps); 
    console.log('Answer:', data.answer); 
}

main().catch((err) => {
    console.error("The sample encountered an error:", err);
});

