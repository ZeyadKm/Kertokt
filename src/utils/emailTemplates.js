import {
  issueGuidance,
  recipientGuidance,
  escalationStyles,
  urgencyGuidance,
  stateRegulations,
  federalReferences
} from '../data/escalationRules.js';

const fallback = (value, placeholder) => (value && value.trim().length ? value.trim() : placeholder);

function formatList(items) {
  return items && items.length
    ? items.map((item, index) => `${index + 1}. ${item}`).join('\n')
    : '';
}

export function buildEmail(formData, attachments = []) {
  const {
    issueType,
    recipient,
    location,
    city,
    state,
    evidence,
    measurements,
    previousContact,
    healthImpact,
    regulations,
    desiredOutcome,
    escalationLevel,
    affectedResidents,
    propertyAge,
    urgencyLevel,
    senderName,
    senderEmail,
    senderPhone,
    senderAddress
  } = formData;

  const issueData = issueGuidance[issueType] || null;
  const recipientData = recipientGuidance[recipient] || null;
  const escalation = escalationStyles[escalationLevel] || escalationStyles.professional;
  const urgency = urgencyGuidance[urgencyLevel] || '';
  const stateRefs = state && stateRegulations[state] ? stateRegulations[state] : [];

  const subjectParts = [
    issueData ? issueData.label : 'Indoor Environmental Concern',
    location ? `– ${location}` : '',
    city ? `(${city})` : ''
  ].filter(Boolean);
  const subject = subjectParts.join(' ');

  const greeting = recipientData ? `To the ${recipientData.label},` : 'To whom it may concern,';

  const introLines = [
    `I am writing on behalf of ${fallback(senderName, 'our assessment team')} regarding ${issueData ? issueData.label.toLowerCase() : 'an indoor environmental issue'} at ${fallback(location, 'the property')} in ${[city, state].filter(Boolean).join(', ')}.`,
    escalation.guidance
  ].filter(Boolean);

  const evidenceLines = [];
  if (measurements) {
    evidenceLines.push(`Measured data: ${measurements}.`);
  }
  if (evidence) {
    evidenceLines.push(`Supporting evidence: ${evidence}.`);
  }
  if (healthImpact) {
    evidenceLines.push(`Resident impact: ${healthImpact}.`);
  }
  if (affectedResidents) {
    evidenceLines.push(`Affected residents/units: ${affectedResidents}.`);
  }
  if (propertyAge) {
    evidenceLines.push(`Property details: ${propertyAge}.`);
  }
  if (attachments.length) {
    evidenceLines.push(`Attachments provided: ${attachments.map((file) => file.name).join(', ')}.`);
  }

  const regulatoryLines = [];
  if (issueData && issueData.regulations.length) {
    regulatoryLines.push(
      `Applicable technical guidance includes ${issueData.regulations
        .map((reg) => reg.title)
        .join('; ')}.`
    );
  }
  if (stateRefs.length) {
    regulatoryLines.push(
      `Relevant ${state} provisions: ${stateRefs.map((ref) => `${ref.citation} (${ref.summary})`).join('; ')}.`
    );
  }
  if (regulations) {
    regulatoryLines.push(`Local code references provided by residents: ${regulations}.`);
  }
  if (recipientData) {
    regulatoryLines.push(
      `As noted, your obligations include ${recipientData.obligations.join(' ')} ${urgency ? `The current urgency level is ${urgency}` : ''}`.trim()
    );
  }
  if (!stateRefs.length) {
    regulatoryLines.push(
      `Federal references to consider: ${federalReferences
        .map((ref) => `${ref.citation} – ${ref.summary}`)
        .join('; ')}.`
    );
  }

  const actionLines = [];
  if (recipientData) {
    actionLines.push(`Requested actions: ${formatList(recipientData.requestedActions)}`);
  }
  if (desiredOutcome) {
    actionLines.push(`Desired outcome from residents: ${desiredOutcome}.`);
  }
  if (previousContact) {
    actionLines.push(`Previous contact history: ${previousContact}.`);
  }

  const closingLines = [
    'Please reply with confirmation of receipt, assigned point of contact, and the proposed timeline for resolution.',
    senderName ? `Sincerely,\n${senderName}` : 'Sincerely,\nHomeLLM Advocacy Team'
  ];

  const contactLines = [];
  if (senderAddress) contactLines.push(senderAddress);
  if (senderEmail) contactLines.push(senderEmail);
  if (senderPhone) contactLines.push(senderPhone);

  const bodySections = [
    greeting,
    '',
    ...introLines,
    '',
    evidenceLines.length ? 'Key Findings:\n' + evidenceLines.map((line) => `• ${line}`).join('\n') : '',
    regulatoryLines.length ? 'Regulatory Context:\n' + regulatoryLines.map((line) => `• ${line}`).join('\n') : '',
    actionLines.length ? 'Requested Next Steps:\n' + actionLines.join('\n') : '',
    '',
    ...closingLines,
    contactLines.length ? contactLines.join('\n') : ''
  ].filter((section) => section && section.trim().length);

  return {
    subject,
    body: bodySections.join('\n\n')
  };
}
