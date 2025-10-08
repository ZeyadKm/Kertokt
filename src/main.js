import {
  issueGuidance,
  recipientGuidance,
  escalationStyles,
  urgencyGuidance,
  stateRegulations
} from './data/escalationRules.js';
import { trainingDataset } from './data/trainingDataset.js';
import { buildEmail } from './utils/emailTemplates.js';

const defaultFormState = {
  issueType: 'air-quality',
  recipient: 'hoa',
  location: '',
  city: '',
  state: '',
  evidence: '',
  measurements: '',
  previousContact: '',
  healthImpact: '',
  regulations: '',
  desiredOutcome: '',
  escalationLevel: 'professional',
  affectedResidents: '',
  propertyAge: '',
  urgencyLevel: 'medium',
  senderName: '',
  senderEmail: '',
  senderPhone: '',
  senderAddress: '',
  apiKey: ''
};

class HomeLLMApp {
  constructor(root) {
    this.root = root;
    this.state = { ...defaultFormState };
    this.attachments = [];
    this.activeTab = 'composer';
    this.generatedEmail = '';
    this.render();
  }

  render() {
    this.root.innerHTML = `
      <header class="header">
        <div>
          <h1>HomeLLM</h1>
          <p>Indoor environmental advocacy assistant for rapid, accurate escalations.</p>
        </div>
        <span class="badge">Indoor Health Ops</span>
      </header>

      <section class="panel">
        <div class="tab-bar">
          <button class="tab-button ${this.activeTab === 'composer' ? 'active' : ''}" data-tab="composer">Email Composer</button>
          <button class="tab-button ${this.activeTab === 'dataset' ? 'active' : ''}" data-tab="dataset">Training Dataset</button>
        </div>

        <div id="tab-composer" class="tab-content ${this.activeTab === 'composer' ? '' : 'hidden'}">
          ${this.renderComposer()}
        </div>

        <div id="tab-dataset" class="tab-content ${this.activeTab === 'dataset' ? '' : 'hidden'}">
          ${this.renderDataset()}
        </div>
      </section>
    `;

    this.bindTabEvents();
    this.bindComposerEvents();
    this.bindDatasetEvents();
  }

  renderComposer() {
    const stateOptions = [''].concat(Object.keys(stateRegulations)).sort();
    return `
      <div class="panel" style="padding: 0; box-shadow: none;">
        <div class="panel" style="margin-bottom: 16px;">
          <h2 class="section-title">API Configuration</h2>
          <div class="grid-two">
            <div class="field">
              <label for="apiKey">Model API Key</label>
              <input type="password" id="apiKey" name="apiKey" placeholder="Paste provider key (optional)" value="${this.escape(
                this.state.apiKey
              )}" />
              <small>Keys are stored locally in your browser session only.</small>
            </div>
          </div>
        </div>

        <div class="panel" style="margin-bottom: 16px;">
          <h2 class="section-title">Case Overview</h2>
          <div class="grid-two">
            <div class="field">
              <label for="issueType">Issue Type</label>
              <select id="issueType" name="issueType">
                ${Object.entries(issueGuidance)
                  .map(([value, data]) => `<option value="${value}" ${
                    this.state.issueType === value ? 'selected' : ''
                  }>${data.label}</option>`)
                  .join('')}
              </select>
            </div>
            <div class="field">
              <label for="recipient">Recipient</label>
              <select id="recipient" name="recipient">
                ${Object.entries(recipientGuidance)
                  .map(([value, data]) => `<option value="${value}" ${
                    this.state.recipient === value ? 'selected' : ''
                  }>${data.label}</option>`)
                  .join('')}
              </select>
            </div>
            <div class="field">
              <label for="escalationLevel">Escalation Level</label>
              <select id="escalationLevel" name="escalationLevel">
                ${Object.entries(escalationStyles)
                  .map(([value, data]) => `<option value="${value}" ${
                    this.state.escalationLevel === value ? 'selected' : ''
                  }>${data.label}</option>`)
                  .join('')}
              </select>
            </div>
            <div class="field">
              <label for="urgencyLevel">Urgency</label>
              <select id="urgencyLevel" name="urgencyLevel">
                ${Object.entries(urgencyGuidance)
                  .map(([value]) => `<option value="${value}" ${
                    this.state.urgencyLevel === value ? 'selected' : ''
                  }>${value.charAt(0).toUpperCase() + value.slice(1)}</option>`)
                  .join('')}
              </select>
            </div>
          </div>

          <div class="grid-two" style="margin-top: 16px;">
            <div class="field">
              <label for="location">Property / System</label>
              <input id="location" name="location" placeholder="e.g., Building C – Shared HVAC" value="${this.escape(
                this.state.location
              )}" />
            </div>
            <div class="field">
              <label for="city">City</label>
              <input id="city" name="city" placeholder="City" value="${this.escape(this.state.city)}" />
            </div>
            <div class="field">
              <label for="state">State</label>
              <select id="state" name="state">
                ${stateOptions
                  .map((value) => {
                    const label = value ? value : 'Select state';
                    return `<option value="${value}" ${this.state.state === value ? 'selected' : ''}>${label}</option>`;
                  })
                  .join('')}
              </select>
            </div>
            <div class="field">
              <label for="propertyAge">Property / Equipment Age</label>
              <input id="propertyAge" name="propertyAge" placeholder="e.g., Constructed 1995, last HVAC retrofit 2018" value="${this.escape(
                this.state.propertyAge
              )}" />
            </div>
          </div>
        </div>

        <div class="panel" style="margin-bottom: 16px;">
          <h2 class="section-title">Findings & Impacts</h2>
          <div class="grid-two">
            <div class="field">
              <label for="measurements">Measurements</label>
              <textarea id="measurements" name="measurements" placeholder="Include sampling results, humidity, airflow, ppm data">${this.escape(
                this.state.measurements
              )}</textarea>
            </div>
            <div class="field">
              <label for="evidence">Observations / Evidence</label>
              <textarea id="evidence" name="evidence" placeholder="Visible issues, photos, logs, corrective actions to date">${this.escape(
                this.state.evidence
              )}</textarea>
            </div>
          </div>
          <div class="grid-two" style="margin-top: 16px;">
            <div class="field">
              <label for="healthImpact">Health Impacts</label>
              <textarea id="healthImpact" name="healthImpact" placeholder="Symptoms reported, doctor notes, vulnerable residents">${this.escape(
                this.state.healthImpact
              )}</textarea>
            </div>
            <div class="field">
              <label for="affectedResidents">Affected Residents / Units</label>
              <textarea id="affectedResidents" name="affectedResidents" placeholder="List units, residents, or population counts">${this.escape(
                this.state.affectedResidents
              )}</textarea>
            </div>
          </div>
        </div>

        <div class="panel" style="margin-bottom: 16px;">
          <h2 class="section-title">Regulatory & Communication History</h2>
          <div class="grid-two">
            <div class="field">
              <label for="regulations">Local Regulations Referenced</label>
              <textarea id="regulations" name="regulations" placeholder="Cite municipal codes or standards residents have identified">${this.escape(
                this.state.regulations
              )}</textarea>
            </div>
            <div class="field">
              <label for="previousContact">Previous Contact History</label>
              <textarea id="previousContact" name="previousContact" placeholder="Dates, ticket numbers, phone calls, inspection requests">${this.escape(
                this.state.previousContact
              )}</textarea>
            </div>
          </div>
          <div class="field" style="margin-top: 16px;">
            <label for="desiredOutcome">Desired Outcome</label>
            <textarea id="desiredOutcome" name="desiredOutcome" placeholder="Describe remediation goals, credits, or relief requested">${this.escape(
              this.state.desiredOutcome
            )}</textarea>
          </div>
        </div>

        <div class="panel" style="margin-bottom: 16px;">
          <h2 class="section-title">Documentation Uploads</h2>
          <div class="field">
            <label for="attachmentInput">Attach Evidence (images, PDFs)</label>
            <input id="attachmentInput" type="file" multiple accept="image/*,.pdf,.doc,.docx" />
            <div class="attachments" id="attachmentsList">${
              this.attachments.length
                ? this.attachments
                    .map(
                      (file, index) => `
                      <div class="attachment-item" data-index="${index}">
                        <span>${file.name}</span>
                        <button type="button" data-remove="${index}">Remove</button>
                      </div>`
                    )
                    .join('')
                : '<span>No files attached yet.</span>'
            }</div>
          </div>
        </div>

        <div class="panel" style="margin-bottom: 16px;">
          <h2 class="section-title">Sender Details</h2>
          <div class="grid-two">
            <div class="field">
              <label for="senderName">Sender Name</label>
              <input id="senderName" name="senderName" placeholder="HomeLLM Advocate" value="${this.escape(
                this.state.senderName
              )}" />
            </div>
            <div class="field">
              <label for="senderEmail">Email</label>
              <input id="senderEmail" name="senderEmail" placeholder="advocate@example.com" value="${this.escape(
                this.state.senderEmail
              )}" />
            </div>
            <div class="field">
              <label for="senderPhone">Phone</label>
              <input id="senderPhone" name="senderPhone" placeholder="(555) 123-4567" value="${this.escape(
                this.state.senderPhone
              )}" />
            </div>
            <div class="field">
              <label for="senderAddress">Mailing Address</label>
              <input id="senderAddress" name="senderAddress" placeholder="123 Air Quality Ln, Suite 200" value="${this.escape(
                this.state.senderAddress
              )}" />
            </div>
          </div>
        </div>

        <div class="panel" style="margin-bottom: 16px;">
          <h2 class="section-title">Guidance Snapshot</h2>
          <div id="guidanceContainer">${this.renderGuidance()}</div>
        </div>

        <div class="panel">
          <div class="button-row">
            <button id="generateEmail" class="btn btn-primary">Generate Email</button>
            <button id="copyEmail" class="btn btn-secondary" ${
              this.generatedEmail ? '' : 'disabled'
            }>Copy Email</button>
            <button id="downloadEmail" class="btn btn-tertiary" ${
              this.generatedEmail ? '' : 'disabled'
            }>Download .txt</button>
            <button id="resetForm" class="btn btn-tertiary">Reset</button>
          </div>

          <div class="generated-email">
            <label for="generatedEmail">Generated Email</label>
            <textarea id="generatedEmail" readonly placeholder="Generated email will appear here">${this.escape(
              this.generatedEmail
            )}</textarea>
          </div>
          <div id="statusArea"></div>
        </div>
      </div>
    `;
  }

  renderDataset() {
    return `
      <div>
        <h2 class="section-title">Curated Training Examples</h2>
        <p>The following dataset entries are structured prompt-completion pairs for fine-tuning or evaluation.</p>
        <table class="training-table">
          <thead>
            <tr>
              <th style="width: 18%">ID</th>
              <th style="width: 30%">Prompt</th>
              <th>Completion</th>
            </tr>
          </thead>
          <tbody>
            ${trainingDataset
              .map(
                (item) => `
                  <tr>
                    <td><strong>${item.id}</strong></td>
                    <td><code>${this.escape(item.prompt)}</code></td>
                    <td><code>${this.escape(item.completion)}</code></td>
                  </tr>`
              )
              .join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  renderGuidance() {
    const issueData = issueGuidance[this.state.issueType];
    const recipientData = recipientGuidance[this.state.recipient];
    const escalation = escalationStyles[this.state.escalationLevel];
    const urgency = urgencyGuidance[this.state.urgencyLevel];

    const stateRefs = this.state.state && stateRegulations[this.state.state] ? stateRegulations[this.state.state] : [];

    if (!issueData || !recipientData || !escalation) {
      return '<p>Update the case selections above to view tailored guidance.</p>';
    }

    return `
      <div class="guidance-card">
        <h4>Issue Focus – ${issueData.label}</h4>
        <p>${issueData.summary}</p>
        <ul>
          ${issueData.evidencePoints.map((point) => `<li>${point}</li>`).join('')}
        </ul>
      </div>
      <div class="guidance-card">
        <h4>Recipient Expectations – ${recipientData.label}</h4>
        <p>Tone: <strong>${recipientData.tone}</strong></p>
        <ul>
          ${recipientData.obligations.map((item) => `<li>${item}</li>`).join('')}
        </ul>
      </div>
      <div class="guidance-card">
        <h4>Escalation Strategy</h4>
        <p>${escalation.guidance}</p>
        <p><strong>Urgency guidance:</strong> ${urgency}</p>
      </div>
      <div class="guidance-card">
        <h4>State References ${this.state.state ? `– ${this.state.state}` : ''}</h4>
        ${stateRefs.length
          ? `<ul>${stateRefs.map((ref) => `<li><strong>${ref.citation}</strong>: ${ref.summary}</li>`).join('')}</ul>`
          : '<p>Select a state to surface state-level statutes and regulations.</p>'}
      </div>
    `;
  }

  bindTabEvents() {
    this.root.querySelectorAll('.tab-button').forEach((button) => {
      button.addEventListener('click', () => {
        const tab = button.dataset.tab;
        if (tab !== this.activeTab) {
          this.activeTab = tab;
          this.render();
        }
      });
    });
  }

  bindComposerEvents() {
    const composer = this.root.querySelector('#tab-composer');
    if (!composer) return;

    composer.querySelectorAll('input, textarea, select').forEach((element) => {
      element.addEventListener('input', (event) => {
        const { name, value } = event.target;
        if (name in this.state) {
          this.state[name] = value;
        }
        if (['issueType', 'recipient', 'escalationLevel', 'urgencyLevel', 'state'].includes(name)) {
          this.updateGuidance();
        }
      });
    });

    const attachmentInput = composer.querySelector('#attachmentInput');
    attachmentInput.addEventListener('change', (event) => this.handleAttachmentUpload(event));

    composer.querySelector('#generateEmail').addEventListener('click', () => this.handleGenerate());
    composer.querySelector('#copyEmail').addEventListener('click', () => this.copyEmail());
    composer.querySelector('#downloadEmail').addEventListener('click', () => this.downloadEmail());
    composer.querySelector('#resetForm').addEventListener('click', () => this.resetForm());

    composer.querySelectorAll('[data-remove]').forEach((button) => {
      button.addEventListener('click', (event) => {
        const index = Number(event.target.dataset.remove);
        this.attachments.splice(index, 1);
        this.render();
      });
    });
  }

  bindDatasetEvents() {
    // For extensibility; currently static view.
  }

  handleAttachmentUpload(event) {
    const files = Array.from(event.target.files);
    const readers = files.map((file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          resolve({ name: file.name, type: file.type, data: reader.result });
        };
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readers)
      .then((results) => {
        this.attachments = this.attachments.concat(results);
        this.render();
        this.showStatus(`${results.length} attachment(s) added.`, 'success');
      })
      .catch((error) => {
        this.showStatus(`Attachment error: ${error.message}`, 'error');
      });
  }

  handleGenerate() {
    const { subject, body } = buildEmail(this.state, this.attachments);
    this.generatedEmail = `Subject: ${subject}\n\n${body}`;
    this.render();
    this.showStatus('Email generated successfully. Review and customize before sending.', 'success');
  }

  copyEmail() {
    if (!this.generatedEmail) return;
    navigator.clipboard
      .writeText(this.generatedEmail)
      .then(() => this.showStatus('Email copied to clipboard.', 'success'))
      .catch(() => this.showStatus('Unable to access clipboard in this browser.', 'error'));
  }

  downloadEmail() {
    if (!this.generatedEmail) return;
    const blob = new Blob([this.generatedEmail], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'HomeLLM-escalation-email.txt';
    link.click();
    URL.revokeObjectURL(link.href);
    this.showStatus('Text file downloaded.', 'success');
  }

  resetForm() {
    this.state = { ...defaultFormState };
    this.attachments = [];
    this.generatedEmail = '';
    this.render();
    this.showStatus('Form reset. All fields cleared.', 'success');
  }

  updateGuidance() {
    const container = this.root.querySelector('#guidanceContainer');
    if (container) {
      container.innerHTML = this.renderGuidance();
    }
  }

  showStatus(message, type) {
    const statusArea = this.root.querySelector('#statusArea');
    if (!statusArea) return;
    statusArea.innerHTML = `<div class="status ${type === 'error' ? 'error' : ''}">${message}</div>`;
    setTimeout(() => {
      if (statusArea) statusArea.innerHTML = '';
    }, 4000);
  }

  escape(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('app');
  if (root) {
    new HomeLLMApp(root);
  }
});
