# Community Testing Guide

Thank you for helping test **AG AdliAkademi**.

The project is under active development. Community testing helps identify bugs, confusing workflows, missing explanations, and opportunities to improve the learning experience.

## 1. Set up a local copy

You need Git, Node.js, npm, and a modern browser.

```bash
git clone https://github.com/ahmetgulerpy/AG-AdliAkademi.git
cd AG-AdliAkademi
npm install
npm run dev
```

Open `http://localhost:3000`.

If setup fails, report the exact command and sanitized error output using the Bug Report template.

## 2. What you can test

Choose one or more areas and describe exactly what you tried:

- Navigation and page layout.
- Academy pages and educational content.
- Case management workflows.
- Evidence and inventory screens.
- Chain-of-custody workflows.
- Findings and timeline views.
- Laboratory exercises.
- Glossary and terminology.
- Progress tracking.
- Report generation and presentation.

Some areas may be incomplete, use sample data, or change during development. A missing or unfinished feature is useful feedback; state what you expected and what you actually found. Do not assume a feature is implemented merely because it appears in navigation or a roadmap.

## 3. Suggested test flow

1. Start the application.
2. Open the home page.
3. Navigate through the available sections.
4. Try visible actions and forms using synthetic data only.
5. Refresh the page and check whether the displayed state behaves as expected.
6. Note confusing wording, layout problems, broken links, and unexpected behavior.
7. Submit a Community Test Report.

## 4. What makes a useful report?

Include the page or workflow, exact steps, observed result, expected result, environment (OS, browser, Node.js version where relevant), and sanitized screenshots or recordings if useful.

One report per distinct issue is preferred. For general feedback about a test session, use one community test report and list the areas you reviewed.

## 5. Data and safety rules

Use only synthetic, public-domain, or explicitly authorized test data.

Never upload real case evidence or forensic images, personal documents, private messages, identifiable information, passwords, API keys, tokens, cookies, session data, or data from systems you do not own or have permission to test.

Do not test against third-party systems. Do not attempt destructive actions or access data belonging to other users.

If you believe you found a security vulnerability, **do not create a public Issue**. Follow [SECURITY.md](SECURITY.md).

## 6. Submit your feedback

Use the repository's GitHub Issue templates:

- **Community Test Report** for test-session feedback.
- **Bug Report** for a specific reproducible defect.
- **Feature Request** for a new idea or improvement.

Search existing Issues before opening a new one.

## 7. Important note

Community testing is voluntary. A report does not guarantee that a suggested change will be implemented. Maintainers may request more information, mark an issue as planned, or close reports that are duplicates, out of scope, or cannot be reproduced.

Thank you for helping make AG AdliAkademi better.
