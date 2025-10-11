# Kertokt

## Automatic Analysis of Consumer Reports

Kertokt now ships with a lightweight application that merges Environmental
Working Group (EWG) summaries, municipal utility company reports, and household
coverage benefits into a single actionable briefing. The toolkit ingests JSON
exports, highlights contaminants that exceed health or legal limits, and pairs
them with programs or insurance benefits that help customers take action—just
like a personal DoNotPay for home and health services.

- Run the CLI against the bundled Denver Water sample data:

  ```bash
  PYTHONPATH=src python -m kertokt.cli --sample
  ```

- Analyze your own exports by pointing the tool to structured JSON files:

  ```bash
  PYTHONPATH=src python -m kertokt.cli \
    --ewg path/to/ewg.json \
    --utility path/to/utility.json \
    --coverage path/to/benefits.json
  ```

The CLI prints consolidated findings and recommendation bulletins that a
customer success agent (or the household themselves) can follow to request
tests, claim rebates, and leverage existing insurance perks.

See [docs/automation_plan.md](docs/automation_plan.md) for a deeper look at the
product and technical roadmap. The live toolkit implements the ingestion,
analysis, and recommendation layers described in that plan.
# HomeLLM

HomeLLM is a lightweight, browser-based workspace that helps indoor environmental consultants draft data-driven escalation emails to HOAs, utilities, local governments, state agencies, and nonprofits. The tool combines structured guidance, curated statutes, and a transparent training dataset to make advocacy correspondence fast and repeatable.

## Features

- **Guided Email Composer** – capture investigation details, upload evidence, and instantly produce a structured escalation email ready for review.
- **Evidence & Regulation Prompts** – contextual reminders of sampling data, statutory obligations, and urgency guidance for each recipient type.
- **Training Dataset Viewer** – inspect prompt/response pairs that can be used to prime or fine-tune language models powering HomeLLM workflows.
- **Attachment Tracking** – log supporting files (photos, lab reports) to include in outreach packages.
- **Offline-Friendly** – ships as static HTML, CSS, and JavaScript. No build step or external dependencies required.

## Getting Started

1. Serve the project locally (any static file server works). One option using Python:

   ```bash
   npm run start
   ```

   The command above launches `python3 -m http.server` on port `5173`. Navigate to [http://localhost:5173](http://localhost:5173) in your browser.

2. Populate the form with investigation details. Optional: paste an API key from your preferred LLM provider to track where you plan to run generations (keys are stored only in-browser).
3. Click **Generate Email** to create a subject line and body. Copy or download the text for final review and sending.
4. Switch to the **Training Dataset** tab to review curated prompt/completion examples. These entries illustrate how to cite regulations accurately when automating escalations.

## Project Structure

```
index.html          # Entry point and layout container
src/styles.css      # Styling for the application
src/main.js         # UI logic, event handling, state management
src/data/           # Domain guidance, regulations, and training dataset
src/utils/          # Email assembly utilities
```

## Customizing Guidance

- Update `src/data/escalationRules.js` to add new jurisdictions, issue types, or recipient obligations.
- Expand `src/data/trainingDataset.js` with additional prompt/completion pairs as new cases are handled.
- Adapt `src/utils/emailTemplates.js` if you need to tweak the generated email format or include new data fields.

## Notes on Accuracy

All regulations and references included in the dataset cite recognized federal and state sources. Always confirm jurisdiction-specific requirements before sending correspondence, and have licensed professionals review legal notices when necessary.
