export const trainingDataset = [
  {
    id: 'hoa-mold-followup',
    prompt:
      'Draft a professional follow-up email to an HOA about mold in shared HVAC ducts. Include humidity readings, prior requests, and cite UCIOA obligations.',
    completion:
      'Subject: Follow-up: Mold Remediation Required for Building HVAC Ducts\n\nDear Board Members,\n\nThank you for acknowledging our initial request regarding the visible mold inside the shared HVAC ducts serving Building C. On 3 May we measured relative humidity above 68% inside the trunks and confirmed condensation along the insulation. As referenced in the UCIOA §3-107, the association must maintain common elements in a condition that protects resident health.\n\nWe respectfully ask the Board to confirm the remediation contractor selection and schedule no later than 10 May. Please provide the written work plan, including containment procedures and post-remediation verification.\n\nKind regards,\nHomeLLM Resident Advocacy Team'
  },
  {
    id: 'utility-water-billing',
    prompt:
      'Create an escalation email to a water utility disputing bills after documented service interruptions. Reference state PUC complaint procedures and request credits.',
    completion:
      'Subject: Escalation: Billing Adjustment Request for Service Interruptions\n\nTo the Customer Relations Manager,\n\nBetween 12–15 April our monitoring equipment recorded four pressure drops below 20 psi at 145 Cedar Street, leading to boil water advisories for residents. The outages were reported via ticket #44821, yet the April invoice still reflects full volumetric and service charges. Under Texas Administrative Code 16 TAC §24.173, utilities must investigate disputed bills before disconnecting service or assessing late fees.\n\nPlease apply an outage credit, waive penalties, and share the mitigation steps to prevent recurrence. If we do not receive written confirmation within five business days, we will file a formal complaint with the Public Utility Commission of Texas.\n\nSincerely,\nHomeLLM Resident Advocacy Team'
  },
  {
    id: 'state-lead-hazard',
    prompt:
      'Write a formal complaint to a state health agency about lead dust hazards in pre-1978 apartments, referencing EPA RRP rules and requesting inspection.',
    completion:
      'Subject: Formal Complaint: Lead Dust Hazards at 218 Harbor Avenue\n\nTo the Lead Hazard Control Program,\n\nHomeLLM conducted XRF screening and dust wipe sampling at 218 Harbor Avenue on 22 March. Two bedroom sills exceeded the EPA dust-lead hazard standard (140 µg/ft²) and deteriorated lead-based paint was observed on common stair rails. These conditions fall under the EPA Renovation, Repair, and Painting Rule (40 CFR Part 745 Subpart E) and require certified abatement.\n\nWe request that the Department open an investigation, inspect the property, and direct the owner to submit a compliant abatement plan within 10 days. Please confirm the assigned investigator and next steps.\n\nRespectfully,\nHomeLLM Resident Advocacy Team'
  }
];
