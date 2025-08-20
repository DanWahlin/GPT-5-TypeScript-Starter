import { OpenAI, AzureOpenAI } from 'openai';
import { config } from 'dotenv';
config();

interface MathExplanationSchema {
  steps: string[];
  answer: number;
}

// Can use either GitHub Models or Azure AI Foundry endpoint/key
const endpoint = process.env.AZURE_INFERENCE_ENDPOINT!; 
const key = process.env.AZURE_INFERENCE_KEY!;
const deployment = process.env.AZURE_OPENAI_DEPLOYMENT || 'gpt-5';
let client: OpenAI | AzureOpenAI;

client = endpoint.includes('models.github.ai')
    ? new OpenAI({ baseURL: endpoint, apiKey: key })
    : new AzureOpenAI({ endpoint, apiKey: key, apiVersion: '2025-01-01-preview', deployment });

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

const result = await client.chat.completions.create({
    model: deployment,
    messages: [ 
        { role: 'system', content: 'Return JSON only.' }, 
        { role: 'user', content: 'What is 23 * 7? Show your steps.' }, 
    ],
    response_format: { type: 'json_schema', json_schema: schema },
    reasoning_effort: 'high' // 'minimal' | 'low' | 'medium' | 'high'
});

const content = result.choices[0].message?.content ?? '{}'; 
const data: MathExplanationSchema = JSON.parse(content); 
console.log('Steps:', data.steps); 
console.log('Answer:', data.answer); 

/*
OUTPUT

Steps: [
  'Break 23 into 20 + 3',
  'Multiply: 20 * 7 = 140',
  'Multiply: 3 * 7 = 21',
  'Add the products: 140 + 21 = 161'
]
*/