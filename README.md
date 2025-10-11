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

## Deploying to Vercel

HomeLLM is a static site, so Vercel can host it without a custom build step. Follow these detailed instructions:

### 1. Prepare the repository

1. Sign in to [vercel.com](https://vercel.com) (create a free account if needed).
2. Fork or push this repository to a Git provider that Vercel supports (GitHub, GitLab, or Bitbucket). Make sure the root of the repo includes `index.html`, the `src/` directory, and the provided `vercel.json` file.

### 2. Import the project in Vercel

1. In the Vercel dashboard, click **Add New… → Project** and choose the Git repository that contains HomeLLM.
2. When the import wizard asks for a framework preset, choose **Other** so Vercel knows it is a plain static site.
3. Leave the **Build Command** field empty. This tells Vercel no build step is required.
4. Set **Output Directory** to `.` (a single dot). That instructs Vercel to publish the project root as-is.
5. Confirm the settings and click **Deploy**. The initial deployment usually finishes in a few seconds because no build is performed.

### 3. Verify the deployment

1. After the deployment completes, Vercel provides a preview URL. Open it to confirm the HomeLLM UI loads.
2. The included `vercel.json` file adds a catch-all rewrite so every route serves `index.html`. Navigate to a nested route (e.g., `/anything`) to confirm the single-page app still renders.
3. If you want a custom domain, attach it through **Settings → Domains** and wait for DNS propagation.

### 4. Enable continuous deployment (optional)

1. Merge changes into the default branch of your Git repository.
2. Each push automatically triggers a fresh deployment. Use Vercel’s **Deployments** tab to monitor build history and roll back if necessary.

If you ever need to trigger a deployment manually, you can also use the [Vercel CLI](https://vercel.com/docs/cli/deploy) from this project root and run `vercel --prod`. The CLI respects the same `vercel.json` configuration that powers dashboard deployments.

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
