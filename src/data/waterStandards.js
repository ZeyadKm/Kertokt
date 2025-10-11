export const waterStandards = [
  {
    aliases: ['lead', 'pb'],
    label: 'Lead',
    mcl: 0.015,
    unit: 'mg/L',
    thresholdLabel: 'EPA action level',
    summary: 'Lead action level is 0.015 mg/L (15 ppb). Levels above this require corrective action.'
  },
  {
    aliases: ['copper', 'cu'],
    label: 'Copper',
    mcl: 1.3,
    unit: 'mg/L',
    thresholdLabel: 'EPA action level',
    summary: 'Copper action level is 1.3 mg/L. Exceedances can trigger corrosion control requirements.'
  },
  {
    aliases: ['arsenic', 'as'],
    label: 'Arsenic',
    mcl: 0.01,
    unit: 'mg/L',
    thresholdLabel: 'EPA maximum contaminant level',
    summary: 'Arsenic MCL is 0.01 mg/L. Chronic exposure above this poses significant health risks.'
  },
  {
    aliases: ['nitrate', 'no3'],
    label: 'Nitrate',
    mcl: 10,
    unit: 'mg/L',
    thresholdLabel: 'EPA maximum contaminant level',
    summary: 'Nitrate MCL is 10 mg/L measured as nitrogen. Elevated levels are dangerous for infants.'
  },
  {
    aliases: ['nitrite', 'no2'],
    label: 'Nitrite',
    mcl: 1,
    unit: 'mg/L',
    thresholdLabel: 'EPA maximum contaminant level',
    summary: 'Nitrite MCL is 1 mg/L measured as nitrogen. High readings require immediate response.'
  },
  {
    aliases: ['turbidity'],
    label: 'Turbidity',
    mcl: 5,
    unit: 'NTU',
    thresholdLabel: 'EPA secondary standard',
    summary: 'Turbidity should remain below 5 NTU. Elevated turbidity can indicate microbial risk.'
  }
];

export function findWaterStandard(parameter) {
  if (!parameter) return null;
  const normalized = parameter.toLowerCase().trim();
  return waterStandards.find((standard) =>
    standard.aliases.some((alias) => normalized.includes(alias))
  );
}
