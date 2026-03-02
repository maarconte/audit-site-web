## 2025-03-02 - [Insecure Direct Object Reference (IDOR) on Mailing Lists]
**Vulnerability:** The Brevo integration in the `submitForm` Firebase Cloud Function accepted a `listIds` array directly from the client request body. This allowed an attacker to arbitrarily append themselves to internal or administrative mailing lists.
**Learning:** Client-provided variables related to backend API integrations must never be trusted without strict sanitization and validation.
**Prevention:** Hardcode external service identifiers, like mailing list IDs, directly within the trusted backend environment to prevent unauthorized manipulation.
