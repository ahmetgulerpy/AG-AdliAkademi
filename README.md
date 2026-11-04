# AG AdliAkademi

### Digital Forensics Academy & Virtual Investigation Environment

<p align="center">
  <strong>An open-source learning and investigation environment for digital forensics and cybersecurity education.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/STATUS-ACTIVE%20DEVELOPMENT-orange?style=for-the-badge" alt="Active Development" />
  <img src="https://img.shields.io/badge/COMMUNITY-TESTING-blue?style=for-the-badge" alt="Community Testing" />
  <img src="https://img.shields.io/badge/LICENSE-Apache%202.0-green?style=for-the-badge" alt="Apache 2.0 License" />
</p>

<p align="center">
  <a href="https://github.com/ahmetgulerpy/AG-AdliAkademi">GitHub Repository</a>
  ·
  <a href="https://github.com/ahmetgulerpy/AG-AdliAkademi/issues">Report an Issue</a>
  ·
  <a href="https://github.com/ahmetgulerpy/AG-AdliAkademi/pulls">Contribute</a>
</p>

---

> [!WARNING]
> **This project is currently under active development and community testing.**
>
> AG AdliAkademi is an evolving open-source project. Features, interfaces, educational materials, laboratory scenarios, and technical components may change at any time. Some functionality may be incomplete or experimental.
>
> This repository is published to encourage collaboration, technical review, educational feedback, and community-driven improvement. It should not yet be considered a production-ready digital forensics platform.

## About the Project

**AG AdliAkademi** is an open-source digital forensics education and virtual investigation environment developed under the AG CYBER LAB initiative.

The project's goal is to bring theoretical cybersecurity and digital forensics knowledge together with practical investigation exercises.

Rather than focusing solely on tools and technical terminology, the platform aims to help learners understand investigative methodology, evaluate digital evidence, interpret technical findings, and document their conclusions.

The project is being developed around two complementary areas:

### 1. AG CYBER LAB ACADEMY

An educational environment focused on digital forensics concepts, investigative methodologies, technical knowledge, and structured learning materials.

### 2. AG CYBER LAB FORENSICS

A virtual investigation environment designed around case scenarios, digital evidence management, forensic examination workflows, findings, and reporting.

The long-term vision is to connect these two areas so that users can apply the concepts they learn through practical investigation scenarios.

## Project Areas

The repository currently contains development work related to the following areas:

| Area | Description |
|---|---|
| Academy | Educational content and learning modules |
| Case Management | Digital investigation case organization |
| Evidence Management | Evidence records and evidence-related information |
| Chain of Custody | Evidence handling and custody history |
| Findings | Technical observations and investigation findings |
| Timeline | Event and timestamp organization |
| Laboratories | Practical forensic learning environments |
| Glossary | Digital forensics and cybersecurity terminology |
| Progress Tracking | Learning and laboratory progress |
| Reporting | Investigation report generation |

**Important:** These areas are under development. Their presence in the project does not mean every feature is complete, validated, or production-ready.

## Development Principles

The project is being developed with the following principles in mind:

- **Evidence integrity:** Evidence-related information should be handled consistently and transparently.
- **Traceability:** Investigation activities should be documented and reviewable.
- **Technical accuracy:** Educational materials should distinguish verified observations from assumptions.
- **Responsible investigation:** Findings should not claim more than the available evidence supports.
- **Practical learning:** Concepts should be reinforced through structured exercises and scenarios.
- **Community collaboration:** Technical feedback and educational review should contribute to continuous improvement.

## Technology Stack

The current project uses:

| Technology | Purpose |
|---|---|
| Next.js 16 | Application framework |
| React 19 | User interface |
| TypeScript | Application development |
| SQLite | Local database |
| better-sqlite3 | SQLite database driver |
| Drizzle ORM | Database access and schema management |
| Tailwind CSS 4 | Styling |
| Framer Motion | Interface animations |
| Recharts | Data visualization |
| pdfmake | PDF generation |

The architecture is based on Next.js App Router with a local SQLite database.

## Getting Started

You can run the project locally and explore its current development state.

### Prerequisites

- Node.js (compatible with the current Next.js version)
- npm
- Git

### 1. Clone the repository

```bash
git clone https://github.com/ahmetgulerpy/AG-AdliAkademi.git
```

### 2. Enter the project directory

```bash
cd AG-AdliAkademi
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start the development server

```bash
npm run dev
```

### 5. Open the application

Visit:

```text
http://localhost:3000
```

The application uses a local SQLite database. The current database implementation creates the `data` directory and initializes the database schema when the database client is initialized.

Local database files are intentionally excluded from version control.

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Build the application |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript checks |

These commands are available in the current project configuration. Passing these checks does not by itself establish that every application feature is fully tested.

## Community Testing & Contributions

AG AdliAkademi is being developed as an open-source project, and community participation is an important part of its development process.

Cybersecurity enthusiasts, digital forensics learners, developers, educators, and technical reviewers are welcome to explore the repository and contribute feedback.

### Areas where feedback is welcome

**Technical Review**
- Application behavior and functionality
- Database structure and consistency
- Error handling
- Performance and usability
- Code quality and maintainability

**Educational Review**
- Technical accuracy of educational materials
- Clarity of explanations
- Learning flow and progression
- Terminology and definitions
- Practical scenario quality

**Laboratory Review**
- Scenario consistency
- Investigation workflow
- Evidence interpretation
- Technical correctness
- User experience

**User Experience**
- Interface usability
- Navigation
- Accessibility
- Visual consistency
- Suggestions for improvement

### How to Contribute

1. Explore the repository.
2. Identify a bug, inconsistency, missing explanation, or improvement opportunity.
3. Open a GitHub Issue with a clear description.
4. Include reproduction steps when reporting technical problems.
5. Submit a Pull Request if you would like to contribute a code improvement.

Please keep reports constructive, specific, and technically reproducible whenever possible.

Before submitting substantial changes, open an issue to discuss the proposed improvement.

## Project Roadmap

The project is evolving through iterative development and community feedback.

Current development priorities include:

- Improving the existing application architecture.
- Reviewing and refining forensic workflows.
- Expanding educational content.
- Improving laboratory scenarios.
- Reviewing evidence management and reporting behavior.
- Improving documentation and installation instructions.
- Establishing a structured community testing process.

The roadmap will evolve as development progresses.

## Important Notice

AG AdliAkademi is an educational and development project.

It is not currently presented as a certified forensic examination tool, a replacement for professional forensic software, or a validated platform for real-world legal investigations.

Use controlled, authorized, and appropriate test data when exploring the project.

Do not upload confidential information, personal data, real investigation evidence, or sensitive case materials to public issues or pull requests.

## License

This project is distributed under the **Apache License 2.0**.

See the [LICENSE](LICENSE) file for details.

## Author

**Ahmet GÜLER**  
Cybersecurity Researcher & Digital Forensics

**AG CYBER LAB**

<p align="center">
  <a href="https://github.com/ahmetgulerpy">
    <img src="https://img.shields.io/badge/GitHub-ahmetgulerpy-181717?style=for-the-badge&logo=github" alt="GitHub" />
  </a>
  <a href="https://instagram.com/ahmetgulerpy">
    <img src="https://img.shields.io/badge/Instagram-@ahmetgulerpy-E4405F?style=for-the-badge&logo=instagram&logoColor=white" alt="Instagram" />
  </a>
</p>

---

<p align="center">
  <strong>AG CYBER LAB</strong><br />
  Digital Forensics Academy & Virtual Investigation Environment<br /><br />
  <em>Learn. Investigate. Analyze. Document.</em>
</p>