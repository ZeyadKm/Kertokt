import {
  issueGuidance,
  recipientGuidance,
  escalationStyles,
  urgencyGuidance,
  stateRegulations
} from './data/escalationRules.js';
import { trainingDataset } from './data/trainingDataset.js';
import { buildEmail } from './utils/emailTemplates.js';
import { findWaterStandard } from './data/waterStandards.js';

const defaultFormState = {
  issueType: 'air-quality',
  recipient: 'hoa',
  location: '',
  city: '',
  state: '',
  concernSummary: '',
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
  apiKey: '',
  waterAnalysis: null,
  waterAnalysisRaw: ''
};

class HomeLLMApp {
  constructor(root) {
    this.root = root;
    this.state = { ...defaultFormState };
    this.attachments = [];
    this.activeTab = 'composer';
    this.generatedEmail = '';
    this.pendingFocus = null;
    this.sectionState = {
      findings: false,
      regulatory: false,
      documentation: false,
      sender: false,
      integration: false
    };
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
    this.applyPendingFocus();
  }

  renderComposer() {
    const stateOptions = [''].concat(Object.keys(stateRegulations)).sort();
    return `
      <div class="layout-stack">
        <div class="panel highlight">
          <h2 class="section-title">Quick Start</h2>
          <p class="panel-lede">Only the fields below are needed to draft a clear escalation email. Add more detail later if you have it.</p>
          <div class="grid-two">
            <div class="field">
              <label for="issueType">Issue Type</label>
              <select id="issueType" name="issueType">
                ${Object.entries(issueGuidance)
                  .map(
                    ([value, data]) => `<option value="${value}" ${this.state.issueType === value ? 'selected' : ''}>${
                      data.label
                    }</option>`
                  )
                  .join('')}
              </select>
            </div>
            <div class="field">
              <label for="recipient">Recipient</label>
              <select id="recipient" name="recipient">
                ${Object.entries(recipientGuidance)
                  .map(
                    ([value, data]) => `<option value="${value}" ${this.state.recipient === value ? 'selected' : ''}>${
                      data.label
                    }</option>`
                  )
                  .join('')}
              </select>
            </div>
            <div class="field">
              <label for="urgencyLevel">Urgency</label>
              <select id="urgencyLevel" name="urgencyLevel">
                ${Object.entries(urgencyGuidance)
                  .map(
                    ([value]) => `<option value="${value}" ${this.state.urgencyLevel === value ? 'selected' : ''}>${
                      value.charAt(0).toUpperCase() + value.slice(1)
                    }</option>`
                  )
                  .join('')}
              </select>
            </div>
            <div class="field">
              <label for="escalationLevel">Escalation Style</label>
              <select id="escalationLevel" name="escalationLevel">
                ${Object.entries(escalationStyles)
                  .map(
                    ([value, data]) => `<option value="${value}" ${this.state.escalationLevel === value ? 'selected' : ''}>${
                      data.label
                    }</option>`
                  )
                  .join('')}
              </select>
            </div>
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
              <label for="desiredOutcome">Desired Outcome</label>
              <textarea id="desiredOutcome" name="desiredOutcome" placeholder="Describe the fix, reimbursement, or response you need">${this.escape(
                this.state.desiredOutcome
              )}</textarea>
          </div>
        </div>
        <div class="field full-width">
          <label for="concernSummary">What needs attention?</label>
          <textarea id="concernSummary" name="concernSummary" placeholder="Summarize the primary risk or failure in 2-3 sentences">${this.escape(
            this.state.concernSummary
          )}</textarea>
        </div>
      </div>

      ${this.state.issueType !== 'water-quality' ? this.renderWaterCallout() : ''}

      ${this.state.issueType === 'water-quality' ? this.renderWaterAnalysisPanel() : ''}

      <div class="panel collapsible">
        <details data-section="findings" ${this.sectionState.findings ? 'open' : ''}>
          <summary>Detailed Findings & Resident Impacts</summary>
            <div class="details-body">
              <div class="grid-two">
                <div class="field">
                  <label for="measurements">Measurements</label>
                  <textarea id="measurements" name="measurements" placeholder="Sampling results, humidity, ppm data">${this.escape(
                    this.state.measurements
                  )}</textarea>
                </div>
                <div class="field">
                  <label for="evidence">Observations / Evidence</label>
                  <textarea id="evidence" name="evidence" placeholder="Visible issues, logs, corrective actions taken">${this.escape(
                    this.state.evidence
                  )}</textarea>
                </div>
              </div>
              <div class="grid-two" style="margin-top: 16px;">
                <div class="field">
                  <label for="healthImpact">Health Impacts</label>
                  <textarea id="healthImpact" name="healthImpact" placeholder="Symptoms, doctor notes, vulnerable residents">${this.escape(
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
              <div class="field" style="margin-top: 16px;">
                <label for="propertyAge">Property / Equipment Age</label>
                <input id="propertyAge" name="propertyAge" placeholder="e.g., Constructed 1995, last HVAC retrofit 2018" value="${this.escape(
                  this.state.propertyAge
                )}" />
              </div>
            </div>
          </details>
        </div>

        <div class="panel collapsible">
          <details data-section="regulatory" ${this.sectionState.regulatory ? 'open' : ''}>
            <summary>Regulatory References & History</summary>
            <div class="details-body">
              <div class="grid-two">
                <div class="field">
                  <label for="regulations">Local Regulations Referenced</label>
                  <textarea id="regulations" name="regulations" placeholder="Cite municipal codes or standards residents identified">${this.escape(
                    this.state.regulations
                  )}</textarea>
                </div>
                <div class="field">
                  <label for="previousContact">Previous Contact History</label>
                  <textarea id="previousContact" name="previousContact" placeholder="Ticket numbers, calls, inspection requests">${this.escape(
                    this.state.previousContact
                  )}</textarea>
                </div>
              </div>
            </div>
          </details>
        </div>

        <div class="panel collapsible">
          <details data-section="documentation" ${this.sectionState.documentation ? 'open' : ''}>
            <summary>Documentation & Attachments</summary>
            <div class="details-body">
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
          </details>
        </div>

        <div class="panel collapsible">
          <details data-section="sender" ${this.sectionState.sender ? 'open' : ''}>
            <summary>Sender Details</summary>
            <div class="details-body">
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
          </details>
        </div>

        <div class="panel collapsible">
          <details data-section="integration" ${this.sectionState.integration ? 'open' : ''}>
            <summary>Optional API Configuration</summary>
            <div class="details-body">
              <p class="panel-lede">Store a model key locally if you trigger custom automations.</p>
              <div class="grid-two">
                <div class="field">
                  <label for="apiKey">Model API Key</label>
                  <input type="password" id="apiKey" name="apiKey" placeholder="Paste provider key (optional)" value="${this.escape(
                    this.state.apiKey
                  )}" />
                  <small>Keys never leave your browser session.</small>
                </div>
              </div>
            </div>
          </details>
        </div>

        <div class="panel guidance">
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

  renderWaterCallout() {
    return `
      <div class="panel water-cta">
        <div class="water-cta-body">
          <div>
            <h3>Need to review a water lab report?</h3>
            <p>Switch to the water quality workflow to upload CSVs, paste lab tables, and benchmark readings automatically.</p>
          </div>
          <div class="water-cta-actions">
            <button type="button" id="activateWaterTools" class="btn btn-secondary">Show Water Analysis Tools</button>
            <small>Instantly highlights EPA exceedances and copies a summary into your measurements field.</small>
          </div>
        </div>
      </div>
    `;
  }

  renderWaterAnalysisPanel() {
    const analysis = this.state.waterAnalysis;
    const hasData = analysis && Array.isArray(analysis.entries) && analysis.entries.length;
    const exceedanceCount = hasData ? analysis.exceedances.length : 0;
    const rows = hasData
      ? analysis.entries
          .map((entry) => {
            const reference = entry.reference || findWaterStandard(entry.parameter) || null;
            const referenceText = reference
              ? `${reference.thresholdLabel}: ${reference.mcl} ${reference.unit}`
              : 'No reference matched';
            const statusLabel =
              entry.status === 'exceeds'
                ? 'Exceeds limit'
                : entry.status === 'within'
                ? 'Within limit'
                : 'Not compared';
            return `
              <tr class="${entry.status === 'exceeds' ? 'alert' : 'ok'}">
                <td>${this.escape(entry.parameter)}</td>
                <td>${this.escape(this.formatWaterValue(entry))}</td>
                <td>${this.escape(referenceText)}</td>
                <td>${statusLabel}</td>
              </tr>`;
          })
          .join('')
      : '';

    const highlight = hasData
      ? exceedanceCount
        ? `<ul class="water-flags">${analysis.exceedances
            .map(
              (entry) =>
                `<li><strong>${this.escape(entry.parameter)}</strong> at ${this.escape(this.formatWaterValue(entry))}</li>`
            )
            .join('')}</ul>`
        : '<p class="water-good">All reported readings are within EPA reference limits.</p>'
      : '<div class="water-placeholder">Upload or paste readings to summarize exceedances instantly.</div>';

    return `
      <div class="panel water-panel">
        <h2 class="section-title">Water Analysis Assistant</h2>
        <p class="panel-lede">Upload or paste lab data to automatically highlight readings that exceed EPA thresholds.</p>
        <div class="water-layout">
          <div class="water-inputs">
            <div class="field">
              <label for="waterAnalysisFile">Upload Lab Report (.csv, .txt, .json)</label>
              <input id="waterAnalysisFile" type="file" accept=".csv,.txt,.json" />
            </div>
            <div class="field">
              <label for="waterAnalysisRaw">Paste table or readings</label>
              <textarea id="waterAnalysisRaw" name="waterAnalysisRaw" placeholder="Parameter,Value,Unit&#10;Lead,0.02,mg/L&#10;Copper,1.5,mg/L">${this.escape(
                this.state.waterAnalysisRaw
              )}</textarea>
            </div>
            <div class="button-row">
              <button type="button" class="btn btn-secondary" id="analyzeWater">Analyze Readings</button>
              <button type="button" class="btn btn-tertiary" id="clearWater" ${
                hasData || (this.state.waterAnalysisRaw && this.state.waterAnalysisRaw.trim()) ? '' : 'disabled'
              }>Clear</button>
            </div>
          </div>
          <div class="water-summary">
            ${
              hasData
                ? `
              <div class="water-result-header">
                <div>
                  <strong>${this.escape(analysis.fileName || 'Lab analysis')}</strong>
                  <div class="water-result-sub">${analysis.entries.length} parameter${
                    analysis.entries.length === 1 ? '' : 's'
                  } reviewed</div>
                </div>
                <span class="status-chip ${exceedanceCount ? 'alert' : 'ok'}">${
                  exceedanceCount
                    ? `${exceedanceCount} exceedance${exceedanceCount > 1 ? 's' : ''}`
                    : 'Within limits'
                }</span>
              </div>
              ${highlight}
              <table class="water-table">
                <thead>
                  <tr>
                    <th>Parameter</th>
                    <th>Result</th>
                    <th>Reference</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  ${rows}
                </tbody>
              </table>`
                : highlight
            }
          </div>
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
        if (name === 'issueType') {
          if (value !== 'water-quality') {
            this.state.waterAnalysis = null;
            this.state.waterAnalysisRaw = '';
          }
          this.render();
          return;
        }
        if (['issueType', 'recipient', 'escalationLevel', 'urgencyLevel', 'state'].includes(name)) {
          this.updateGuidance();
        }
      });
    });

    const activateWaterTools = composer.querySelector('#activateWaterTools');
    if (activateWaterTools) {
      activateWaterTools.addEventListener('click', () => this.activateWaterTools());
    }

    composer.querySelectorAll('details[data-section]').forEach((details) => {
      details.addEventListener('toggle', (event) => {
        const section = event.target.dataset.section;
        if (section) {
          this.sectionState[section] = event.target.open;
        }
      });
    });

    const attachmentInput = composer.querySelector('#attachmentInput');
    if (attachmentInput) {
      attachmentInput.addEventListener('change', (event) => this.handleAttachmentUpload(event));
    }

    const waterFile = composer.querySelector('#waterAnalysisFile');
    if (waterFile) {
      waterFile.addEventListener('change', (event) => this.handleWaterAnalysisUpload(event));
    }

    const analyzeWater = composer.querySelector('#analyzeWater');
    if (analyzeWater) {
      analyzeWater.addEventListener('click', () => this.analyzeWaterText());
    }

    const clearWater = composer.querySelector('#clearWater');
    if (clearWater) {
      clearWater.addEventListener('click', () => this.clearWaterAnalysis());
    }

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

  handleWaterAnalysisUpload(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const text = typeof reader.result === 'string' ? reader.result : '';
      try {
        const sanitized = text.trim();
        const analysis = this.parseWaterAnalysis(sanitized, file.name);
        this.state.waterAnalysis = analysis;
        this.state.waterAnalysisRaw = sanitized;
        this.sectionState.findings = true;
        this.mergeWaterSummary(analysis);
        this.render();
        this.showStatus(`Analyzed ${analysis.entries.length} reading(s) from ${file.name}.`, 'success');
      } catch (error) {
        this.showStatus(`Unable to interpret ${file.name}: ${error.message}`, 'error');
      }
    };
    reader.onerror = () => {
      this.showStatus(`Upload failed: ${reader.error ? reader.error.message : 'Unknown error'}`, 'error');
    };
    reader.readAsText(file);
    event.target.value = '';
  }

  analyzeWaterText() {
    const raw = (this.state.waterAnalysisRaw || '').trim();
    if (!raw) {
      this.showStatus('Paste lab readings before analyzing.', 'error');
      return;
    }

    try {
      const analysis = this.parseWaterAnalysis(raw, 'manual input');
      this.state.waterAnalysis = analysis;
      this.state.waterAnalysisRaw = raw;
      this.sectionState.findings = true;
      this.mergeWaterSummary(analysis);
      this.render();
      this.showStatus(`Analyzed ${analysis.entries.length} reading(s).`, 'success');
    } catch (error) {
      this.showStatus(`Unable to analyze pasted results: ${error.message}`, 'error');
    }
  }

  parseWaterAnalysis(raw, fileName = 'analysis') {
    if (!raw || !raw.trim()) {
      throw new Error('No data provided.');
    }

    const text = raw.trim();
    let entries = [];

    try {
      const json = JSON.parse(text);
      entries = this.extractEntriesFromJson(json);
    } catch (error) {
      // Ignore JSON parse errors and fall back to text parsing.
    }

    if (!entries.length) {
      entries = this.extractEntriesFromText(text);
    }

    if (!entries.length) {
      throw new Error('Provide CSV or JSON with parameter and value columns.');
    }

    const normalized = entries
      .map((entry) => this.normalizeWaterEntry(entry))
      .filter((entry) => entry);

    if (!normalized.length) {
      throw new Error('No numeric readings detected.');
    }

    const exceedances = normalized.filter((entry) => entry.status === 'exceeds');

    return {
      fileName,
      entries: normalized,
      exceedances
    };
  }

  extractEntriesFromJson(data) {
    if (!data) {
      return [];
    }

    if (Array.isArray(data)) {
      return data;
    }

    if (Array.isArray(data.results)) {
      return data.results;
    }

    if (Array.isArray(data.readings)) {
      return data.readings;
    }

    if (typeof data === 'object') {
      return Object.entries(data).map(([parameter, value]) => ({ parameter, value }));
    }

    return [];
  }

  extractEntriesFromText(text) {
    const lines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
    if (!lines.length) {
      return [];
    }

    const delimiter = lines[0].includes('\t')
      ? '\t'
      : lines[0].includes(';')
      ? ';'
      : lines[0].includes(',')
      ? ','
      : null;

    const entries = [];

    if (delimiter) {
      const hasHeader = /[a-zA-Z]/.test(lines[0]);
      let start = 0;
      let paramIdx = 0;
      let valueIdx = 1;
      let unitIdx = 2;

      if (hasHeader) {
        const headers = lines[0].split(delimiter).map((h) => h.trim().toLowerCase());
        paramIdx = headers.findIndex((h) => ['parameter', 'contaminant', 'analyte', 'name'].some((key) => h.includes(key)));
        valueIdx = headers.findIndex((h) => ['value', 'result', 'concentration', 'reading', 'level'].some((key) => h.includes(key)));
        unitIdx = headers.findIndex((h) => h.includes('unit'));

        if (paramIdx === -1) paramIdx = 0;
        if (valueIdx === -1) valueIdx = headers.length > 1 ? 1 : -1;
        if (unitIdx === -1) unitIdx = headers.length > 2 ? 2 : -1;
        start = 1;
      }

      lines.slice(start).forEach((line) => {
        if (!line) return;
        const parts = line.split(delimiter).map((part) => part.trim());
        if (!parts.length) return;

        if (parts.length === 1 && line.includes(':')) {
          const [parameter, value] = line.split(':');
          entries.push({ parameter: parameter.trim(), value: value.trim() });
          return;
        }

        const parameter = parts[paramIdx] || parts[0];
        const value = valueIdx !== -1 ? parts[valueIdx] : parts[1] || parts[0];
        const unit = unitIdx !== -1 ? parts[unitIdx] : parts[2] || '';
        entries.push({ parameter, value, unit });
      });
    } else {
      lines.forEach((line) => {
        if (!line.includes(':')) return;
        const [parameter, value] = line.split(':');
        entries.push({ parameter: parameter.trim(), value: value.trim() });
      });
    }

    return entries;
  }

  normalizeWaterEntry(entry) {
    if (!entry) {
      return null;
    }

    if (typeof entry === 'string') {
      const parts = entry.split(/[:,]/);
      if (parts.length >= 2) {
        entry = { parameter: parts[0], value: parts.slice(1).join(':') };
      } else {
        return null;
      }
    }

    const parameter = (entry.parameter || entry.name || entry.contaminant || entry.analyte || entry.id || '').toString().trim();
    if (!parameter) {
      return null;
    }

    let unit = entry.unit || entry.units || entry.measure || '';
    const valueSource =
      entry.value ??
      entry.result ??
      entry.reading ??
      entry.concentration ??
      entry.level ??
      entry.amount ??
      '';

    const parsed = this.parseValueUnit(valueSource);
    const numericValue = parsed.number;
    if (!Number.isFinite(numericValue)) {
      return null;
    }

    if (!unit && parsed.unit) {
      unit = parsed.unit;
    }

    const roundedValue = Number(numericValue.toFixed(4));
    const reference = findWaterStandard(parameter);
    const status =
      reference && Number.isFinite(roundedValue)
        ? roundedValue > reference.mcl
          ? 'exceeds'
          : 'within'
        : 'unknown';

    return {
      parameter,
      value: roundedValue,
      unit,
      status,
      reference: reference
        ? {
            label: reference.label,
            mcl: reference.mcl,
            unit: reference.unit,
            thresholdLabel: reference.thresholdLabel
          }
        : null
    };
  }

  parseValueUnit(value) {
    if (typeof value === 'number' && Number.isFinite(value)) {
      return { number: value, unit: '' };
    }

    if (typeof value !== 'string') {
      return { number: NaN, unit: '' };
    }

    const cleaned = value.replace(/,/g, '').replace(/[<>]/g, '').trim();
    const match = cleaned.match(/-?\d*\.?\d+(?:e[+\-]?\d+)?/i);
    if (!match) {
      return { number: NaN, unit: '' };
    }

    const number = Number.parseFloat(match[0]);
    const unit = cleaned.slice(match.index + match[0].length).trim();
    return { number, unit };
  }

  formatWaterValue(entry) {
    if (!entry) {
      return '';
    }

    if (Number.isFinite(entry.value)) {
      const abs = Math.abs(entry.value);
      const formatted = abs >= 1 ? entry.value.toFixed(2) : entry.value.toPrecision(3);
      const normalized = Number.parseFloat(formatted).toString();
      return `${normalized}${entry.unit ? ` ${entry.unit}` : ''}`.trim();
    }

    return `${entry.value}${entry.unit ? ` ${entry.unit}` : ''}`.trim();
  }

  mergeWaterSummary(analysis) {
    if (!analysis || !analysis.entries || !analysis.entries.length) {
      return;
    }

    const summaryLines = analysis.entries.map((entry) => {
      const indicator = entry.status === 'exceeds' ? '⚠️' : '•';
      const reference = entry.reference
        ? `${entry.reference.thresholdLabel} ${entry.reference.mcl} ${entry.reference.unit}`
        : 'no reference benchmark';
      return `${indicator} ${entry.parameter}: ${this.formatWaterValue(entry)} (${reference})`;
    });

    const summaryText = `Water analysis${analysis.fileName ? ` from ${analysis.fileName}` : ''}: ${summaryLines.join('; ')}`;

    if (this.state.measurements && this.state.measurements.trim().length) {
      if (!this.state.measurements.includes(summaryText)) {
        this.state.measurements = `${this.state.measurements.trim()}\n${summaryText}`;
      }
    } else {
      this.state.measurements = summaryText;
    }
  }

  clearWaterAnalysis() {
    if (!this.state.waterAnalysis && !(this.state.waterAnalysisRaw && this.state.waterAnalysisRaw.trim())) {
      return;
    }

    this.state.waterAnalysis = null;
    this.state.waterAnalysisRaw = '';
    this.render();
    this.showStatus('Cleared water analysis data.', 'success');
  }

  activateWaterTools() {
    this.state.issueType = 'water-quality';
    this.sectionState.findings = true;
    this.pendingFocus = '#waterAnalysisFile';
    this.render();
    this.showStatus('Water quality tools ready – upload a file or paste your readings.', 'success');
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
    this.sectionState = {
      findings: false,
      regulatory: false,
      documentation: false,
      sender: false,
      integration: false
    };
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

  applyPendingFocus() {
    if (!this.pendingFocus) {
      return;
    }

    const target = this.root.querySelector(this.pendingFocus);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      if (typeof target.focus === 'function') {
        try {
          target.focus({ preventScroll: true });
        } catch (error) {
          target.focus();
        }
      }
    }
    this.pendingFocus = null;
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
