export const issueGuidance = {
  'air-quality': {
    label: 'Air Quality / Mold / VOCs',
    summary:
      'Document moisture sources, sampling data, and ventilation performance. Reference ASHRAE 62.1/62.2 ventilation targets and OSHA mold guidance when worker exposure is relevant.',
    evidencePoints: [
      'Humidity readings above 60% RH or sustained dampness support mold concerns.',
      'Photographs of visible mold growth, water intrusion, or damaged drywall strengthen the narrative.',
      'Include laboratory findings for spore counts, VOC levels, or particulate analysis if available.'
    ],
    regulations: [
      {
        title: 'EPA Mold Remediation in Schools and Commercial Buildings',
        url: 'https://www.epa.gov/mold/mold-remediation-schools-and-commercial-buildings-guide'
      },
      {
        title: 'ASHRAE Standard 62.2 – Ventilation and Acceptable Indoor Air Quality',
        url: 'https://www.ashrae.org/technical-resources/standards-and-guidelines'
      }
    ]
  },
  'water-quality': {
    label: 'Water Quality / Contamination',
    summary:
      'Report contaminant concentrations, sampling dates, and EPA Maximum Contaminant Level (MCL) comparisons. Note any boil water notices or municipal advisories.',
    evidencePoints: [
      'Include water sampling laboratory results and chain of custody if available.',
      'Photographs of discolored water, residue, or plumbing corrosion help illustrate severity.',
      'Document odors, taste issues, or health symptoms experienced by residents.'
    ],
    regulations: [
      {
        title: 'Safe Drinking Water Act (40 CFR Parts 141-149)',
        url: 'https://www.epa.gov/sdwa'
      },
      {
        title: 'EPA Lead and Copper Rule (40 CFR Part 141 Subpart I)',
        url: 'https://www.epa.gov/dwreginfo/lead-and-copper-rule'
      }
    ]
  },
  'hvac-ventilation': {
    label: 'HVAC / Ventilation Issues',
    summary:
      'Describe ventilation rates, filter performance, and maintenance history. Compare airflow measurements to ASHRAE or local building code requirements.',
    evidencePoints: [
      'Include test and balance reports or airflow readings from supply and return vents.',
      'Provide filter replacement logs and photos of clogged filters or blocked vents.',
      'Summarize comfort complaints, carbon dioxide trends, or occupancy impacts.'
    ],
    regulations: [
      {
        title: 'International Mechanical Code §403 (Ventilation)',
        url: 'https://codes.iccsafe.org'
      }
    ]
  },
  'lead-asbestos': {
    label: 'Lead / Asbestos / Hazardous Materials',
    summary:
      'Highlight accredited inspection results, abatement requirements, and occupant protection plans. Reference HUD/EPA disclosure rules for pre-1978 housing.',
    evidencePoints: [
      'Attach certified laboratory reports showing lead paint or asbestos concentrations.',
      'Document containment failures, friable material, or dust wipe exceedances.',
      'Describe vulnerable populations (children under six, pregnant residents) impacted.'
    ],
    regulations: [
      {
        title: 'EPA Renovation, Repair, and Painting Rule (40 CFR Part 745 Subpart E)',
        url: 'https://www.epa.gov/lead'
      },
      {
        title: 'AHERA Asbestos Requirements (40 CFR Part 763)',
        url: 'https://www.epa.gov/asbestos/asbestos-laws-and-regulations'
      }
    ]
  },
  'utility-access': {
    label: 'Utility Access / Service Issues',
    summary:
      'Document service interruptions, billing disputes, or unsafe utility infrastructure. Reference state public utility commission rules for response times and reliability.',
    evidencePoints: [
      'Capture outage logs, communication records, and meter readings.',
      'Show invoices or notices reflecting disputed charges or shutoff threats.',
      'Document any medical baseline customers requiring uninterrupted service.'
    ],
    regulations: [
      {
        title: 'Public Utility Commission customer service standards (state-specific)',
        url: 'https://www.naruc.org/about-naruc/regulatory-commissions'
      }
    ]
  }
};

export const recipientGuidance = {
  hoa: {
    label: 'Homeowners Association (HOA)',
    tone: 'professional and cooperative',
    obligations: [
      'HOAs must enforce CC&Rs consistently and maintain common areas affecting health and safety.',
      'Many states adopt the Uniform Common Interest Ownership Act (UCIOA) which requires prompt action on hazards.',
      'Fair Housing Act protections apply when indoor environmental issues disproportionately impact protected classes.'
    ],
    requestedActions: [
      'Schedule inspection of common infrastructure affecting the unit(s).',
      'Provide written remediation plan with timelines and responsible vendors.',
      'Reimburse residents for out-of-pocket mitigation costs when delays are attributable to the HOA.'
    ]
  },
  'property-mgmt': {
    label: 'Property Management / Landlord',
    tone: 'firm and reference habitability statutes',
    obligations: [
      'Landlords must maintain habitable premises under the implied warranty of habitability.',
      'Many jurisdictions require response to essential service complaints within 24–72 hours.',
      'Retaliation for reporting health hazards is prohibited under most landlord-tenant acts.'
    ],
    requestedActions: [
      'Acknowledge the complaint in writing and provide inspection schedule.',
      'Engage licensed contractors for assessment and remediation.',
      'Offer temporary relocation support if the dwelling is unsafe during repairs.'
    ]
  },
  utility: {
    label: 'Utility Company',
    tone: 'escalatory yet collaborative',
    obligations: [
      'Utilities are regulated by state Public Utility Commissions (PUCs) and must follow outage communication protocols.',
      'Critical care and medical baseline customers are entitled to prioritized restoration.',
      'Billing disputes must be investigated before disconnection when raised in good faith.'
    ],
    requestedActions: [
      'Provide written confirmation of the investigation timeline and responsible department.',
      'Issue credit adjustments or service restoration where warranted.',
      'Share contingency plans for vulnerable residents during extended outages.'
    ]
  },
  'local-govt': {
    label: 'Local Government / City Council',
    tone: 'civic and data-driven',
    obligations: [
      'Municipal code enforcement divisions can cite properties that violate property maintenance codes.',
      'Local health departments may issue orders to abate indoor environmental hazards.',
      'City councils track systemic issues and can escalate to special hearings or funding programs.'
    ],
    requestedActions: [
      'Initiate inspection under applicable municipal code sections.',
      'Coordinate with public health officials to evaluate community-level risk.',
      'Consider allocating resources or grants to resolve infrastructure deficiencies.'
    ]
  },
  'state-agency': {
    label: 'State Environmental/Health Agency',
    tone: 'formal and evidence-heavy',
    obligations: [
      'State environmental quality and health departments enforce state statutes and EPA-delegated programs.',
      'Agencies maintain complaint hotlines for drinking water, mold, radon, and lead.',
      'They can compel responsible parties to submit corrective action plans and progress reports.'
    ],
    requestedActions: [
      'Open a case number and assign investigator contact information.',
      'Review submitted data and schedule on-site sampling if needed.',
      'Issue enforcement orders or guidance to the HOA/utility/owner as appropriate.'
    ]
  },
  'federal-agency': {
    label: 'Federal Agency (EPA, HUD, etc.)',
    tone: 'formal and compliant with federal reporting procedures',
    obligations: [
      'Federal agencies oversee national programs such as the Safe Drinking Water Act, HUD Healthy Homes, and OSHA worker safety standards.',
      'They rely on detailed documentation to prioritize enforcement actions.',
      'Whistleblower protections may apply when reporting violations of federal law.'
    ],
    requestedActions: [
      'Confirm receipt and advise on required federal forms or supplemental data.',
      'Coordinate with delegated state agencies to ensure rapid response.',
      'Provide technical assistance resources and enforcement timeline expectations.'
    ]
  },
  nonprofit: {
    label: 'Advocacy Nonprofit / Legal Aid',
    tone: 'collaborative and impact-focused',
    obligations: [
      'Nonprofits can offer strategic guidance, legal support, and media engagement.',
      'Documented cases help organizations demonstrate trends and secure funding.',
      'They typically require consent to share resident stories or data.'
    ],
    requestedActions: [
      'Review attached evidence and advise on strategic next steps.',
      'Support outreach to regulators, media, or pro bono counsel.',
      'Provide template filings or scripts for additional resident testimonies.'
    ]
  }
};

export const escalationStyles = {
  initial: {
    label: 'Initial Request',
    guidance:
      'Open with appreciation, describe the issue succinctly, and request confirmation of receipt. Offer collaboration and avoid accusatory language.'
  },
  professional: {
    label: 'Professional Follow-up',
    guidance:
      'Reference prior communications, cite relevant obligations, and request a written action plan with deadlines.'
  },
  formal: {
    label: 'Formal Complaint',
    guidance:
      'Cite statutes, attach evidence, and clearly state expectations for remediation timelines. Note that the correspondence will be retained for potential enforcement.'
  },
  legal: {
    label: 'Legal Notice',
    guidance:
      'State that failure to act may result in legal remedies, reference counsel if retained, and provide a firm deadline for compliance.'
  }
};

export const urgencyGuidance = {
  low: 'Issue affects quality of life but does not present an immediate health risk. Request action within 14 days.',
  medium: 'Residents experience health or comfort impacts. Request action within 7 days and ask for interim mitigation steps.',
  high: 'Significant health impacts or ongoing code violations. Request action within 48 hours and emphasize duty of care.',
  emergency: 'Immediate threat to life or property. Demand urgent response (24 hours or less) and consider temporary relocation or emergency services.'
};

export const stateRegulations = {
  California: [
    {
      citation: 'California Health & Safety Code §17920.3',
      summary: 'Defines substandard building conditions including dampness, mold, and inadequate sanitation.'
    },
    {
      citation: 'California Civil Code §1941.1',
      summary: 'Lists landlord obligations to maintain habitable dwellings, including plumbing, heating, and weatherproofing.'
    },
    {
      citation: 'California Public Utilities Code §777-779',
      summary: 'Requires utilities to provide notice and protections before service disconnection.'
    }
  ],
  'New York': [
    {
      citation: 'NYC Administrative Code §27-2017.3',
      summary: 'Classifies indoor mold hazards and timelines for remediation depending on apartment size.'
    },
    {
      citation: 'New York Public Health Law §1110',
      summary: 'Authorizes the health department to address public health nuisances including contaminated water.'
    }
  ],
  Texas: [
    {
      citation: 'Texas Property Code §92.052',
      summary: 'Requires landlords to repair conditions that materially affect the health or safety of tenants.'
    },
    {
      citation: 'Texas Administrative Code Title 25 Part 1 Chapter 295',
      summary: 'Details mold assessment and remediation licensing and notification requirements.'
    }
  ],
  Florida: [
    {
      citation: 'Florida Statutes §83.51',
      summary: 'Obligates landlords to maintain property in compliance with applicable building, housing, and health codes.'
    },
    {
      citation: 'Florida Administrative Code Rule 62-550',
      summary: 'Implements federal drinking water regulations and reporting requirements.'
    }
  ]
};

export const federalReferences = [
  {
    citation: 'Fair Housing Act (42 U.S.C. §3601 et seq.)',
    summary: 'Prohibits discriminatory housing practices, including failure to address hazards impacting protected classes.'
  },
  {
    citation: 'Americans with Disabilities Act Title II',
    summary: 'Public entities must ensure programs and services are accessible, including reasonable accommodations for environmental sensitivities.'
  },
  {
    citation: 'Safe Drinking Water Act',
    summary: 'Establishes national standards for public drinking water systems and enforcement mechanisms.'
  }
];
