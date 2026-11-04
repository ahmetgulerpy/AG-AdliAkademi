# Contributing to AG AdliAkademi

Thank you for your interest in contributing to **AG AdliAkademi**, an open-source digital forensics learning platform and virtual investigation environment developed under **AG CYBER LAB**.

## Project status

The project is under active development. Features, interfaces, data structures, and learning materials may change. Do not assume every area is complete or production-ready.

## Ways to contribute

- Test existing pages and workflows.
- Report reproducible bugs and usability problems.
- Review educational content for clarity and technical accuracy.
- Suggest improvements to lessons, labs, glossary entries, and workflows.
- Improve documentation or translations.
- Submit focused code changes through pull requests.

## Before opening an issue

1. Search existing Issues for duplicates.
2. Choose the relevant issue template.
3. Include clear reproduction steps and expected results.
4. Include environment details when relevant (OS, browser, Node.js version).
5. Remove personal, confidential, and sensitive information from screenshots and logs.

Use **Community Test Report** for general test-session feedback and **Bug Report** for a specific reproducible defect.

## Development setup

Requirements: Git, Node.js, and npm.

```bash
git clone https://github.com/ahmetgulerpy/AG-AdliAkademi.git
cd AG-AdliAkademi
npm install
npm run dev
```

Open `http://localhost:3000`.

Before submitting changes, run the checks available in the project:

```bash
npm run lint
npm run typecheck
npm run build
```

If a script is unavailable in your checkout, mention that in your pull request.

## Pull request guidelines

- Keep each pull request focused.
- Explain the problem and the solution.
- Link related Issues where applicable.
- Include sanitized before/after screenshots for UI changes.
- Update documentation when behavior changes.
- Do not commit `.env` files, database files, credentials, tokens, personal data, or real case evidence.
- Explain why any new dependency is needed.
- Avoid unrelated refactoring in focused bug fixes.

## Digital forensics and test-data principles

Use only synthetic, public-domain, or explicitly authorized test data.

Never submit real investigation evidence, personal documents, private messages, identifiable information, credentials, API keys, access tokens, or private configuration. Do not test systems, accounts, networks, or devices unless you own them or have explicit permission.

## Review process

Maintainers may request clarification, reproduction steps, or changes. A contribution may be declined if it is outside the project's scope, cannot be reproduced, creates privacy or security risks, or does not meet quality standards.

By participating, you agree to follow the [Code of Conduct](CODE_OF_CONDUCT.md) and [Security Policy](SECURITY.md).

Thank you for helping improve AG AdliAkademi.
