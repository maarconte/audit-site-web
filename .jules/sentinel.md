## 2024-05-22 - [Missing Input Validation in Cloud Functions]
**Vulnerability:** The `submitForm` cloud function accepts user input (`firstName`, `lastName`, `email`, `url`) and processes it without strict type checking, format validation, or length limits.
**Learning:** Cloud functions are often the primary attack surface for serverless apps. Assuming the client sends valid data is a common pitfall.
**Prevention:** Always validate and sanitize all external inputs at the API boundary before processing or storing them. Use a schema validation library or strict manual checks.
