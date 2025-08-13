# Azure GPT-5 Structured Output Demo (TypeScript)

This repo is a minimal TypeScript demo that calls GPT-5 in Azure AI Foundry, enforces structured JSON output via `response_format: json_schema`, and utilizes the `reasoning_effort` property.

Two entry points show the two common auth patterns:
- `azureopenai.ts`: Uses direct API key auth via the `AzureOpenAI` client in the `openai` package.
- `aiprojects.ts`: Uses `@azure/ai-projects` + `DefaultAzureCredential` (AAD/MSI) to obtain an Azure OpenAI client.

## Prerequisites
- Node.js 20+ (ESM support and engines constraint)
- An Azure subscription with an Azure AI Foundry project and a deployed `gpt-5` model.
- One of the following auth setups:
  - AAD/MSI (DefaultAzureCredential): Sign in with VS Code Azure extension or `az login` and have RBAC access to the GPT-5 endpoint connection (e.g., Cognitive Services OpenAI User)
  - API key for the AI Foundry resource (used only by `azureopenai.js`)

## Install
```bash
npm install
```

## Build TypeScript
```bash
npm run build
```

This compiles the TypeScript files to JavaScript in the `dist/` folder.

## Configure environment
Rename `.env.template` to `.env` and fill in values as appropriate:

- `AZURE_INFERENCE_ENDPOINT` (e.g., https://<your-resource>.cognitiveservices.azure.com)
- `AZURE_INFERENCE_KEY` (API key; only needed for `azureopenai.js`)
- `AZURE_OPENAI_DEPLOYMENT` (optional; defaults to `gpt-5` in code)

## Run

### Direct TypeScript execution (using tsx)
Primary AAD/MSI variant (uses `aiprojects.ts`):
```bash
npm run keyless
```
API key variant (uses `azureopenai.ts`):
```bash
npm run key
```

### Run compiled JavaScript
After building with `npm run build`, you can also run the compiled JavaScript:

Primary AAD/MSI variant:
```bash
npm run dev:keyless
```
API key variant:
```bash
npm run dev:key
```

## What the sample does
Both scripts:
- Call the Chat Completions API
- Provide a JSON schema contract enforcing:
  - `steps`: array of strings
  - `answer`: number
- Parse the assistant JSON and print `Steps:` and `Answer:`

Example output (will vary):
```
Steps: [
  'Break 23 into 20 and 3: (20 + 3) * 7',
  'Multiply: 20 * 7 = 140',
  'Multiply: 3 * 7 = 21',
  'Add the results: 140 + 21 = 161'
]
Answer: 161
```

## Key Files
- `aiprojects.ts` — AAD/MSI auth via `AIProjectClient` and `DefaultAzureCredential`
- `azureopenai.ts` — API key auth via `AzureOpenAI` in the `openai` package
- `tsconfig.json` — TypeScript configuration with strict mode enabled
- `package.json` — ESM (`type: module`), `engines` Node >= 20, TypeScript build scripts
- `.env.template` — environment variable template
- `dist/` — Compiled JavaScript output (created after running `npm run build`)

## Troubleshooting
- 401/403 (AAD): Ensure you’re signed in (`az login`) and have RBAC on the AI Foundry project GPT-5 endpoint connection (e.g., Cognitive Services OpenAI User).
- 401 (API key): Ensure `AZURE_INFERENCE_KEY` is set and valid for the endpoint in `AZURE_INFERENCE_ENDPOINT`.
- 404/BadRequest: Verify `AZURE_OPENAI_DEPLOYMENT` matches an existing deployment name in your resource.
- API version mismatch: Keep `2025-01-01-preview` consistent across files.
- ESM errors: Node 20+ is required; the project uses ESM imports (`type: module`).

## Learn more
- Azure AI Foundry docs: https://learn.microsoft.com/azure/ai-foundry/what-is-azure-ai-foundry
- @azure/ai-projects: https://www.npmjs.com/package/@azure/ai-projects
- @azure/identity (DefaultAzureCredential): https://www.npmjs.com/package/@azure/identity
- OpenAI SDK for Azure (AzureOpenAI): https://www.npmjs.com/package/openai
