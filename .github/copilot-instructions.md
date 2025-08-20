# Copilot instructions for this repo

Purpose and scope
- This is a minimal Node.js (ESM) demo that calls Azure OpenAI with structured JSON output.
- Two entry points show two auth patterns:
  - index.js: uses @azure/ai-projects + DefaultAzureCredential (AAD/MSI).
  - azureopenai.js: uses direct API key auth via AzureOpenAI client.

Project layout
- package.json: type=module, engines Node >=20, scripts.start = node index.js
- index.js: primary demo using AIProjectClient to obtain an Azure OpenAI client
- azureopenai.js: alternative direct client with apiKey
- .env.template: template for local secrets; .env is git-ignored

Environment and auth
- Required vars (populate .env from .env.template):
  - AI_ENDPOINT: e.g., https://<resource>.cognitiveservices.azure.com
  - AI_KEY: Azure OpenAI API key (only used by azureopenai.js)
  - AI_MODEL: model deployment name (default "gpt-5")
- For index.js (DefaultAzureCredential) you can login via VS Code Azure sign-in or `az login`, or set AZURE_TENANT_ID, AZURE_CLIENT_ID, AZURE_CLIENT_SECRET.

Run workflows
- Install: npm install
- Run main demo: npm start (runs node index.js)
- Run API-key variant: node azureopenai.js
- Node 20+ is required (ESM imports and engines constraint).

Azure OpenAI usage patterns
- API version pinned: 2025-01-01-preview (keep consistent across files).
- Structured output: response_format: { type: "json_schema", json_schema: { name, schema, strict } }.
- Result handling pattern:
  - const content = result.choices[0].message?.content ?? "{}";
  - const data = JSON.parse(content);
  - Expect data.steps (string[]) and data.answer (number).

Conventions and tips for agents
- Prefer index.js pattern (AIProjectClient + DefaultAzureCredential) for new features; use azureopenai.js for API-key-only samples.
- Keep code ESM (import/export); do not switch to CommonJS.
- Store secrets only in .env (never commit). If adding new vars, update .env.template.
- If adding scripts, keep npm start for index.js; add separate scripts for alternates (e.g., "start:apiKey").
- Keep the API version consistent unless there is a deliberate upgrade across files.

Examples from code
- JSON schema contract used:
  - steps: array of strings
  - answer: number
- Message setup: system "Return JSON only.", user question; matches both files.

Gaps/what doesn’t exist
- No tests, linters, or build tooling. Keep additions lightweight and ESM-compatible.

When editing
- Reference: index.js, azureopenai.js, package.json for patterns and versions.
- Ensure env lookups align with the chosen auth pattern and update docs/comments accordingly.
