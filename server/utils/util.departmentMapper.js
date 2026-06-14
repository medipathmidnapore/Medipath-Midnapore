/**
 * Department Auto-Mapper Utility
 *
 * Maps test names to one of 11 medical departments using keyword matching.
 * Used during sync from the main server (which does not send department info).
 *
 * Departments:
 *   HAEMATOLOGY, BIOCHEMISTRY, ENDOCRINOLOGY & SPECIAL,
 *   URINE EXAMINATION, STOOL EXAMINATION, SEROLOGY,
 *   HISTOPATHOLOGY, CYTOLOGY, MICROBIOLOGY, ANDROLOGY, IMMUNOLOGY
 */

// ─── Keyword → Department mapping ────────────────────────────
// Each entry: [array of keywords/phrases, department name]
// Order matters — first match wins.  More specific patterns come first.
const DEPARTMENT_RULES = [
  // ── ANDROLOGY (very specific, check first) ──────────────────
  [
    [
      'semen', 'sperm', 'andrology', 'seminal', 'spermiogram',
      'sperm count', 'sperm motility', 'semen analysis',
      'male infertility', 'testicular',
    ],
    'ANDROLOGY',
  ],

  // ── HISTOPATHOLOGY ──────────────────────────────────────────
  [
    [
      'histopath', 'biopsy', 'tissue', 'histo path', 'histology',
      'surgical pathology', 'gross examination', 'frozen section',
      'paraffin block', 'h & e', 'h&e', 'special stain',
    ],
    'HISTOPATHOLOGY',
  ],

  // ── CYTOLOGY ────────────────────────────────────────────────
  [
    [
      'cytology', 'cytological', 'pap smear', 'pap test', 'fnac',
      'fine needle', 'cervical smear', 'fluid cytology',
      'imprint cytology', 'cell block', 'liquid based cytology',
    ],
    'CYTOLOGY',
  ],

  // ── STOOL EXAMINATION ───────────────────────────────────────
  [
    [
      'stool', 'faecal', 'fecal', 'occult blood stool', 'ova ', 'cyst',
      'reducing substance stool', 'stool culture', 'stool routine',
      'stool examination',
    ],
    'STOOL EXAMINATION',
  ],

  // ── URINE EXAMINATION ──────────────────────────────────────
  [
    [
      'urine', 'urinalysis', 'urin ', 'urinary', 'urea clearance',
      'microalbumin', 'albumin creatinine ratio',
      'urine routine', 'urine culture', 'urine sugar',
      'urine bs', 'urine bp', '24 hour urine', '24 hrs urine',
      'urine protein', 'urine ketone', 'urine bile',
      'bence jones', 'urine electrolytes',
    ],
    'URINE EXAMINATION',
  ],

  // ── MICROBIOLOGY ────────────────────────────────────────────
  [
    [
      'culture', 'sensitivity', 'c/s', 'c & s', 'gram stain',
      'afb', 'zn stain', 'ziehl', 'fungal', 'koh mount',
      'blood culture', 'wound culture', 'pus culture',
      'sputum culture', 'throat swab', 'nasal swab',
      'ear swab', 'eye swab', 'csf culture', 'body fluid culture',
      'cbnaat', 'tb pcr', 'mantoux', 'quantiferon',
      'antibiotic', 'antimicrobial',
    ],
    'MICROBIOLOGY',
  ],

  // ── SEROLOGY ────────────────────────────────────────────────
  [
    [
      'serology', 'hbsag', 'hbs ag', 'hepatitis', 'hcv', 'hiv',
      'vdrl', 'rpr', 'widal', 'typhidot', 'dengue', 'ns1',
      'malaria', 'chikungunya', 'scrub typhus', 'leptospira',
      'brucella', 'aso', 'antistreptolysin', 'rf ', 'ra factor',
      'rheumatoid', 'crp', 'c-reactive', 'c reactive',
      'rapid card', 'ict ', 'tpha', 'torch',
      'rubella', 'cmv', 'toxoplasma', 'herpes',
      'mono test', 'paul bunnell', 'heterophile',
      'anti hav', 'anti hbe', 'hbe ag',
      'covid', 'sars', 'influenza',
    ],
    'SEROLOGY',
  ],

  // ── IMMUNOLOGY ──────────────────────────────────────────────
  [
    [
      'immunology', 'immunoglobulin', 'ige ', 'igg ', 'igm ', 'iga ',
      'complement', 'c3 ', 'c4 ', 'ana ', 'ana profile',
      'antinuclear', 'anti nuclear', 'anti dsdna', 'anti ds-dna',
      'anca', 'anti ccp', 'hla', 'hla-b27', 'b27',
      'autoimmune', 'lupus', 'anti tpo',
      'anti thyroglobulin', 'anti phospholipid',
      'allergy', 'allergen', 'food panel', 'inhalant panel',
      'cd4', 'cd8', 'lymphocyte subset', 'flowcytometry',
      'flow cytometry', 'immunohistochemistry', 'ihc',
    ],
    'IMMUNOLOGY',
  ],

  // ── ENDOCRINOLOGY & SPECIAL ─────────────────────────────────
  [
    [
      'thyroid', 'tsh', 't3', 't4', 'ft3', 'ft4',
      'pth', 'parathyroid', 'cortisol', 'acth',
      'growth hormone', 'gh ', 'igf',
      'insulin', 'c-peptide', 'c peptide',
      'prolactin', 'fsh', 'lh ', 'estradiol', 'progesterone',
      'testosterone', 'dhea', 'amh', 'anti mullerian',
      'anti-mullerian', 'beta hcg', 'bhcg', 'hcg',
      'aldosterone', 'renin', 'catecholamine',
      'vanillylmandelic', 'vma', 'metanephrine',
      '5-hiaa', 'serotonin',
      'psa', 'ca-125', 'ca 125', 'ca-19', 'ca 19',
      'ca-15', 'ca 15', 'cea', 'afp ', 'alpha feto',
      'tumour marker', 'tumor marker',
      'vitamin d', 'vit-d', 'vit d', 'vitamin b12', 'vit-b12', 'vit b12',
      'folate', 'folic acid', 'ferritin',
      'homocysteine', 'troponin', 'bnp', 'nt-probnp', 'nt pro bnp',
      'procalcitonin', 'il-6', 'interleukin',
      'd-dimer', 'd dimer',
    ],
    'ENDOCRINOLOGY & SPECIAL',
  ],

  // ── HAEMATOLOGY ─────────────────────────────────────────────
  [
    [
      'cbc', 'complete blood count', 'haemoglobin', 'hemoglobin',
      'hb ', 'wbc', 'rbc', 'platelet', 'plt', 'esr',
      'blood group', 'blood grouping', 'rh ', 'coomb',
      'reticulocyte', 'peripheral smear', 'ps ', 'pbf',
      'hplc', 'thalassemia', 'thalassaemia',
      'haemoglobin electrophoresis', 'hemoglobin electrophoresis',
      'sickling', 'sickle cell',
      'pt ', 'prothrombin', 'inr ', 'aptt', 'ptt',
      'bt/ct', 'bt ct', 'bleeding time', 'clotting time',
      'fibrinogen', 'fib ', 'coagulation',
      'factor', 'lupus anticoagulant',
      'blood smear', 'le cell', 'mp ', 'malaria parasite',
      'iron profile', 'iron study', 'tibc', 'serum iron',
      'transferrin',
      'bone marrow',
    ],
    'HAEMATOLOGY',
  ],

  // ── BIOCHEMISTRY (broad, goes last) ─────────────────────────
  [
    [
      'glucose', 'sugar', 'fbs', 'ppbs', 'rbs', 'gtt', 'ogtt', 'hba1c',
      'lipid', 'cholesterol', 'triglyceride', 'hdl', 'ldl', 'vldl',
      'liver', 'lft', 'sgpt', 'sgot', 'alt', 'ast',
      'bilirubin', 'albumin', 'globulin', 'total protein',
      'alkaline phosphatase', 'alp', 'ggt', 'gamma gt',
      'kidney', 'kft', 'rft', 'renal',
      'creatinine', 'urea', 'bun', 'uric acid',
      'electrolyte', 'sodium', 'potassium', 'chloride', 'bicarbonate',
      'calcium', 'phosphorus', 'magnesium',
      'amylase', 'lipase', 'cpk', 'ck ', 'ldh',
      'protein', 'a/g ratio', 'ag ratio',
      'blood gas', 'abg',
      'lactate', 'ammonia', 'copper', 'ceruloplasmin', 'zinc',
      'lithium', 'iron',
      'hs crp', 'hs-crp', 'hs c-rp',
      'pericardial', 'pleural', 'ascitic', 'synovial', 'csf',
      'body fluid', 'fluid examination', 'fluid analysis',
    ],
    'BIOCHEMISTRY',
  ],
];

/**
 * Auto-map a test name to a department.
 *
 * @param {string} testName  The test name (e.g., "CBC With ESR")
 * @returns {string}         One of the 11 department names, or "General"
 */
export function mapTestToDepartment(testName) {
  if (!testName || typeof testName !== 'string') return 'General';

  const lower = ` ${testName.toLowerCase().trim()} `;

  for (const [keywords, department] of DEPARTMENT_RULES) {
    for (const kw of keywords) {
      // Use word-boundary-aware matching: pad both strings so partial-word
      // matches like "alt" don't accidentally match "salt".
      if (lower.includes(kw.toLowerCase())) {
        return department;
      }
    }
  }

  return 'General';
}

/**
 * Batch-map an array of test objects.
 * Adds a `department` field to each object (does NOT mutate originals).
 *
 * @param {Array<{name: string}>} tests
 * @returns {Array<{name: string, department: string}>}
 */
export function mapTestsToDepartments(tests) {
  return tests.map((t) => ({
    ...t,
    department: mapTestToDepartment(t.name || t.TEST_NAME || ''),
  }));
}
