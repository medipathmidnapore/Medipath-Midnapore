/**
 * Category Auto-Mapper Utility
 *
 * Maps test names to patient-friendly body parts or conditions (e.g. "Liver", "Heart", "Diabetes").
 */

const CATEGORY_RULES = [
  [
    ['cbc', 'complete blood count', 'blood group', 'iron profile', 'vit-b12', 'vitamin b12', 'folic acid', 'thalassemia', 'hplc'],
    'Anemia'
  ],
  [
    ['fbs', 'ppbs', 'hba1c', 'rbs', 'insulin', 'c-peptide', 'gtt', 'ogtt', 'urin sugar', 'glucose'],
    'Diabetes'
  ],
  [
    ['anti-tpo', 'anti tpo', 'rheumatoid factor', 'ra factor', 'anti ccp', 'antinuclear antibody', 'ana profile', 'hla-b27', 'hla b27', 'aso', 'antistreptolysin', 'c-reactive protein', 'crp'],
    'Autoimmune'
  ],
  [
    ['hiv', 'hbsag', 'hcv', 'rubella', 'vdrl'],
    'Pre-Marital'
  ],
  [
    ['beta hcg', 'urine pregnancy', 'fsh', 'lh ', 'prolactin', 'amh', 'anti-mullerian', 'semen analysis', 'testosterone'],
    'Pregnancy/Fertility'
  ],
  [
    ['sputum for afb', 'zn stain', 'quantiferon', 'cbnaat', 'tb pcr', 'mantoux', 'tuberculosis'],
    'Tuberculosis (TB)'
  ],
  [
    ['t3', 't4', 'tsh', 'thyroid profile', 'ft3', 'ft4', 'free thyroid', 'anti thyroglobulin', 'pth', 'parathyroid'],
    'Thyroid/Hormone'
  ],
  [
    ['lipid profile', 'hs c-rp', 'nt pro-bnp', 'nt pro bnp', 'cpk', 'troponin', 'pericardial fluid'],
    'Heart'
  ],
  [
    ['vit-d', 'vitamin d', 'calcium', 'phosphorus'],
    'Bone'
  ],
  [
    ['dengue', 'widal', 'malaria', 'typhidot', 'chikungunya', 'scrub typhus'],
    'Fever'
  ],
  [
    ['alt', 'sgpt', 'ast', 'sgot', 'liver function', 'bilirubin', 'urine bs', 'urine bp'],
    'Liver'
  ],
  [
    ['creatinine', 'urea', 'uric acid', 'blood electrolytes', 'kidney function', 'microalbumin', 'sodium', 'potassium'],
    'Kidney'
  ],
  [
    ['prothrombin time', 'pt ', 'aptt', 'bt/ct', 'bleeding time', 'clotting time', 'platelet count'],
    'Coagulation'
  ]
];

export function mapTestToCategory(testName) {
  if (!testName || typeof testName !== 'string') return 'General';

  const lower = ` ${testName.toLowerCase().trim()} `;

  for (const [keywords, category] of CATEGORY_RULES) {
    for (const kw of keywords) {
      if (lower.includes(kw.toLowerCase())) {
        return category;
      }
    }
  }

  return 'General';
}
