import { AzureOpenAI } from "openai";
import dotenv from "dotenv";

dotenv.config();

const endpoint = process.env.AZURE_INFERENCE_ENDPOINT; 
const key = process.env.AZURE_INFERENCE_KEY;
const deployment = process.env.AZURE_OPENAI_DEPLOYMENT || "gpt-5";

const client = new AzureOpenAI({ endpoint, apiKey: key, apiVersion: "2025-01-01-preview", deployment });

const schema = { 
    name: "math_explanation", 
    schema: { 
        type: "object", 
        properties: { 
            steps: { type: "array", items: { type: "string" } }, 
            answer: { type: "number" }, 
        }, 
        required: ["steps", "answer"], 
        additionalProperties: false, 
    }, 
    strict: true, 
}; 

const result = await client.chat.completions.create({
    model: deployment,
    messages: [ 
        { role: "system", content: "Return JSON only." }, 
        { role: "user", content: "What is 23 * 7? Show your steps." }, 
    ],
    response_format: { type: "json_schema", json_schema: schema },
    reasoning_effort: "high" // 'minimal' | 'low' | 'medium' | 'high'
});

const content = result.choices[0].message?.content ?? "{}"; 
const data = JSON.parse(content); 
console.log("Steps:", data.steps); 
console.log("Answer:", data.answer); 

/*
OUTPUT

Steps: [
  'Break 23 into 20 + 3',
  'Multiply: 20 * 7 = 140',
  'Multiply: 3 * 7 = 21',
  'Add the products: 140 + 21 = 161'
]
*/
