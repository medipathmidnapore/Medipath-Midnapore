import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Test from './models/model.test.js';

dotenv.config();

const testData = [
  // Anemia → HAEMATOLOGY
  { category: 'Anemia', department: 'HAEMATOLOGY', name: 'CBC' },
  { category: 'Anemia', department: 'HAEMATOLOGY', name: 'CBC With ESR' },
  { category: 'Anemia', department: 'HAEMATOLOGY', name: 'Blood Group' },
  { category: 'Anemia', department: 'HAEMATOLOGY', name: 'Iron Profile' },
  { category: 'Anemia', department: 'ENDOCRINOLOGY & SPECIAL', name: 'Vit-B12' },
  { category: 'Anemia', department: 'ENDOCRINOLOGY & SPECIAL', name: 'Folic Acid' },
  { category: 'Anemia', department: 'HAEMATOLOGY', name: 'Thalassemia' },

  // Diabetes → BIOCHEMISTRY
  { category: 'Diabetes', department: 'BIOCHEMISTRY', name: 'FBS' },
  { category: 'Diabetes', department: 'BIOCHEMISTRY', name: 'PPBS' },
  { category: 'Diabetes', department: 'BIOCHEMISTRY', name: 'HbA1C' },
  { category: 'Diabetes', department: 'BIOCHEMISTRY', name: 'RBS' },
  { category: 'Diabetes', department: 'ENDOCRINOLOGY & SPECIAL', name: 'Insulin Fasting' },
  { category: 'Diabetes', department: 'ENDOCRINOLOGY & SPECIAL', name: 'Insulin Postprandial' },
  { category: 'Diabetes', department: 'ENDOCRINOLOGY & SPECIAL', name: 'C-Peptide' },
  { category: 'Diabetes', department: 'BIOCHEMISTRY', name: 'GTT/OGTT (75gr glucose)' },
  { category: 'Diabetes', department: 'URINE EXAMINATION', name: 'Urin Sugar (Fasting & Postprandial)' },

  // Autoimmune → IMMUNOLOGY / SEROLOGY
  { category: 'Autoimmune', department: 'IMMUNOLOGY', name: 'Anti-TPO Antibody test' },
  { category: 'Autoimmune', department: 'SEROLOGY', name: 'RA(Rheumatoid Factor) test' },
  { category: 'Autoimmune', department: 'IMMUNOLOGY', name: 'Anti CCP Antibody test' },
  { category: 'Autoimmune', department: 'IMMUNOLOGY', name: 'Antinuclear Antibody profile' },
  { category: 'Autoimmune', department: 'IMMUNOLOGY', name: 'HLA-B27 blood test' },
  { category: 'Autoimmune', department: 'SEROLOGY', name: 'ASO (Antistreptolysin O) test' },
  { category: 'Autoimmune', department: 'SEROLOGY', name: 'C-Reactive Protein (CRP) test' },

  // Pre-Marital → mixed
  { category: 'Pre-Marital', department: 'HAEMATOLOGY', name: 'Blood group test' },
  { category: 'Pre-Marital', department: 'HAEMATOLOGY', name: 'HPLC (Thalassemia) test' },
  { category: 'Pre-Marital', department: 'SEROLOGY', name: 'HIV tests' },
  { category: 'Pre-Marital', department: 'SEROLOGY', name: 'HBsAg test' },
  { category: 'Pre-Marital', department: 'SEROLOGY', name: 'HCV test' },
  { category: 'Pre-Marital', department: 'SEROLOGY', name: 'Rubella IgG test' },
  { category: 'Pre-Marital', department: 'SEROLOGY', name: 'VDRL test' },
  { category: 'Pre-Marital', department: 'URINE EXAMINATION', name: 'Urine routine test' },
  { category: 'Pre-Marital', department: 'BIOCHEMISTRY', name: 'Glucose fasting' },
  { category: 'Pre-Marital', department: 'HAEMATOLOGY', name: 'Complete Blood Count (CBC)' },

  // Pregnancy/Fertility → ENDOCRINOLOGY & SPECIAL / ANDROLOGY
  { category: 'Pregnancy/Fertility', department: 'ENDOCRINOLOGY & SPECIAL', name: 'Beta hCG test' },
  { category: 'Pregnancy/Fertility', department: 'URINE EXAMINATION', name: 'Urine pregnancy test' },
  { category: 'Pregnancy/Fertility', department: 'URINE EXAMINATION', name: 'Routine test' },
  { category: 'Pregnancy/Fertility', department: 'ENDOCRINOLOGY & SPECIAL', name: 'FSH test' },
  { category: 'Pregnancy/Fertility', department: 'ENDOCRINOLOGY & SPECIAL', name: 'LH test' },
  { category: 'Pregnancy/Fertility', department: 'ENDOCRINOLOGY & SPECIAL', name: 'Prolactin test' },
  { category: 'Pregnancy/Fertility', department: 'ENDOCRINOLOGY & SPECIAL', name: 'Anti-Müllerian Hormone (AMH) test' },
  { category: 'Pregnancy/Fertility', department: 'ANDROLOGY', name: 'Semen analysis test' },
  { category: 'Pregnancy/Fertility', department: 'ENDOCRINOLOGY & SPECIAL', name: 'Testosterone test' },

  // Tuberculosis (TB) → MICROBIOLOGY
  { category: 'Tuberculosis (TB)', department: 'MICROBIOLOGY', name: 'Sputum for AFB/ZN stain' },
  { category: 'Tuberculosis (TB)', department: 'MICROBIOLOGY', name: 'QuantiFERON-TB Gold test' },
  { category: 'Tuberculosis (TB)', department: 'MICROBIOLOGY', name: 'CBNAAT test' },
  { category: 'Tuberculosis (TB)', department: 'MICROBIOLOGY', name: 'TB PCR test' },
  { category: 'Tuberculosis (TB)', department: 'MICROBIOLOGY', name: 'Mantoux test' },

  // Heart → BIOCHEMISTRY / ENDOCRINOLOGY & SPECIAL
  { category: 'Heart', department: 'BIOCHEMISTRY', name: 'Lipid Profile' },
  { category: 'Heart', department: 'BIOCHEMISTRY', name: 'HS C-RP' },
  { category: 'Heart', department: 'ENDOCRINOLOGY & SPECIAL', name: 'NT Pro-BNP' },
  { category: 'Heart', department: 'BIOCHEMISTRY', name: 'CPK' },
  { category: 'Heart', department: 'ENDOCRINOLOGY & SPECIAL', name: 'Troponin-I' },
  { category: 'Heart', department: 'ENDOCRINOLOGY & SPECIAL', name: 'Troponin-T' },
  { category: 'Heart', department: 'BIOCHEMISTRY', name: 'Pericardial Fluid Examination' },

  // Thyroid/Hormone → ENDOCRINOLOGY & SPECIAL
  { category: 'Thyroid/Hormone', department: 'ENDOCRINOLOGY & SPECIAL', name: 'T3,T4,TSH(Thyroid Profile)' },
  { category: 'Thyroid/Hormone', department: 'ENDOCRINOLOGY & SPECIAL', name: 'FT3,FT4,TSH(Free Thyroid Panel)' },
  { category: 'Thyroid/Hormone', department: 'IMMUNOLOGY', name: 'Anti TPO Antibody' },
  { category: 'Thyroid/Hormone', department: 'IMMUNOLOGY', name: 'Anti Thyroglobulin Antibody' },
  { category: 'Thyroid/Hormone', department: 'ENDOCRINOLOGY & SPECIAL', name: 'PTH(Parathyroid Hormone)' },

  // Fever → SEROLOGY
  { category: 'Fever', department: 'SEROLOGY', name: 'Dengue NS1' },
  { category: 'Fever', department: 'SEROLOGY', name: 'Widal test' },
  { category: 'Fever', department: 'HAEMATOLOGY', name: 'Malaria parasite' },
  { category: 'Fever', department: 'SEROLOGY', name: 'Malaria antigen' },
  { category: 'Fever', department: 'SEROLOGY', name: 'Typhidot(IgM and IgG)' },
  { category: 'Fever', department: 'SEROLOGY', name: 'Chikungunya test' },
  { category: 'Fever', department: 'SEROLOGY', name: 'Scrub typhus test' },

  // LIVER → BIOCHEMISTRY
  { category: 'Liver', department: 'BIOCHEMISTRY', name: 'ALT/SGPT' },
  { category: 'Liver', department: 'BIOCHEMISTRY', name: 'AST/SGOT' },
  { category: 'Liver', department: 'BIOCHEMISTRY', name: 'Liver Function Test' },
  { category: 'Liver', department: 'BIOCHEMISTRY', name: 'Bilirubin Total, Direct & Indirect' },
  { category: 'Liver', department: 'URINE EXAMINATION', name: 'Urine BS & BP test' },

  // Bone → BIOCHEMISTRY / ENDOCRINOLOGY & SPECIAL
  { category: 'Bone', department: 'ENDOCRINOLOGY & SPECIAL', name: 'Vit-D' },
  { category: 'Bone', department: 'BIOCHEMISTRY', name: 'Calcium' },
  { category: 'Bone', department: 'BIOCHEMISTRY', name: 'Phosphorus' },

  // Kidney → BIOCHEMISTRY / URINE EXAMINATION
  { category: 'Kidney', department: 'URINE EXAMINATION', name: 'Routine urine examination/CS' },
  { category: 'Kidney', department: 'BIOCHEMISTRY', name: 'Creatinine test' },
  { category: 'Kidney', department: 'BIOCHEMISTRY', name: 'Urea test' },
  { category: 'Kidney', department: 'BIOCHEMISTRY', name: 'Uric acid test' },
  { category: 'Kidney', department: 'BIOCHEMISTRY', name: 'Blood Electrolytes test' },
  { category: 'Kidney', department: 'BIOCHEMISTRY', name: 'Kidney function test' },
  { category: 'Kidney', department: 'URINE EXAMINATION', name: 'Microalbumin Creatinine ratio(Urine)' },
  { category: 'Kidney', department: 'BIOCHEMISTRY', name: 'Sodium blood test' },
  { category: 'Kidney', department: 'BIOCHEMISTRY', name: 'Potassium blood test' },

  // Coagulation → HAEMATOLOGY
  { category: 'Coagulation', department: 'HAEMATOLOGY', name: 'Prothrombin Time (PT)' },
  { category: 'Coagulation', department: 'HAEMATOLOGY', name: 'APTT test' },
  { category: 'Coagulation', department: 'HAEMATOLOGY', name: 'BT/CT test' },
  { category: 'Coagulation', department: 'HAEMATOLOGY', name: 'platelet count' },
];

async function seedDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected!');

    console.log(`Processing ${testData.length} tests...`);
    
    let added = 0;
    let updated = 0;

    for (let i = 0; i < testData.length; i++) {
      const test = testData[i];
      const cleanName = test.name.trim();
      // Generate a seed code like SEED-001, SEED-002, etc.
      const seedCode = `SEED-${String(i + 1).padStart(3, '0')}`;

      // Check if this test already exists (by name)
      const existing = await Test.findOne({ name: cleanName });

      if (existing) {
        // Only update department and category — preserve code, price, and sync data
        const result = await Test.updateOne(
          { _id: existing._id },
          {
            $set: {
              category: test.category,
              department: test.department,
            },
          }
        );
        if (result.modifiedCount > 0) updated++;
      } else {
        // Insert new test with a seed code
        try {
          await Test.create({
            name: cleanName,
            code: seedCode,
            category: test.category,
            department: test.department,
            price: 0,
            isActive: true,
          });
          added++;
        } catch (err) {
          // If seed code already exists, try with a more unique code
          if (err.code === 11000) {
            const fallbackCode = `SEED-${Date.now()}-${i}`;
            await Test.create({
              name: cleanName,
              code: fallbackCode,
              category: test.category,
              department: test.department,
              price: 0,
              isActive: true,
            });
            added++;
          } else {
            throw err;
          }
        }
      }
    }

    console.log(`Seeding complete! Added: ${added}, Updated: ${updated}`);
    
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  }
}

seedDatabase();

