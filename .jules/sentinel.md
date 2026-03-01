## 2026-03-01 - [Mass Assignment in Third-Party Integrations]
**Vulnerability:** Found an Insecure Direct Object Reference (IDOR) / Mass Assignment vulnerability in the `submitForm` Cloud Function where user input (`listIds`) was directly passed to the Brevo API to subscribe users to mailing lists.
**Learning:** Cloud functions that mediate between a frontend and a third-party API must strictly validate and sanitize inputs. Never implicitly trust the request body to dictate sensitive configuration data like mailing list IDs.
**Prevention:** Hardcode API-specific sensitive parameters on the backend. Only extract the specific fields you expect from `req.body` and add type and format validation checks (e.g. email regex).
