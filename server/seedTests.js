import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Test from './models/model.test.js';

dotenv.config();

const testData = [
  // Anemia
  { category: 'Anemia', name: 'CBC' },
  { category: 'Anemia', name: 'CBC With ESR' },
  { category: 'Anemia', name: 'Blood Group' },
  { category: 'Anemia', name: 'Iron Profile' },
  { category: 'Anemia', name: 'Vit-B12' },
  { category: 'Anemia', name: 'Folic Acid' },
  { category: 'Anemia', name: 'Thalassemia' },

  // Diabetes
  { category: 'Diabetes', name: 'FBS' },
  { category: 'Diabetes', name: 'PPBS' },
  { category: 'Diabetes', name: 'HbA1C' },
  { category: 'Diabetes', name: 'RBS' },
  { category: 'Diabetes', name: 'Insulin Fasting' },
  { category: 'Diabetes', name: 'Insulin Postprandial' },
  { category: 'Diabetes', name: 'C-Peptide' },
  { category: 'Diabetes', name: 'GTT/OGTT (75gr glucose)' },
  { category: 'Diabetes', name: 'Urin Sugar (Fasting & Postprandial)' },

  // Autoimmune
  { category: 'Autoimmune', name: 'Anti-TPO Antibody test' },
  { category: 'Autoimmune', name: 'RA(Rheumatoid Factor) test' },
  { category: 'Autoimmune', name: 'Anti CCP Antibody test' },
  { category: 'Autoimmune', name: 'Antinuclear Antibody profile' },
  { category: 'Autoimmune', name: 'HLA-B27 blood test' },
  { category: 'Autoimmune', name: 'ASO (Antistreptolysin O) test' },
  { category: 'Autoimmune', name: 'C-Reactive Protein (CRP) test' },

  // Pre-Marital
  { category: 'Pre-Marital', name: 'Blood group test' },
  { category: 'Pre-Marital', name: 'HPLC (Thalassemia) test' },
  { category: 'Pre-Marital', name: 'HIV tests' },
  { category: 'Pre-Marital', name: 'HBsAg test' },
  { category: 'Pre-Marital', name: 'HCV test' },
  { category: 'Pre-Marital', name: 'Rubella IgG test' },
  { category: 'Pre-Marital', name: 'VDRL test' },
  { category: 'Pre-Marital', name: 'Urine routine test' },
  { category: 'Pre-Marital', name: 'Glucose fasting' },
  { category: 'Pre-Marital', name: 'Complete Blood Count (CBC)' },

  // Pregnancy/Fertility
  { category: 'Pregnancy/Fertility', name: 'Beta hCG test' },
  { category: 'Pregnancy/Fertility', name: 'Urine pregnancy test' },
  { category: 'Pregnancy/Fertility', name: 'Routine test' },
  { category: 'Pregnancy/Fertility', name: 'FSH test' },
  { category: 'Pregnancy/Fertility', name: 'LH test' },
  { category: 'Pregnancy/Fertility', name: 'Prolactin test' },
  { category: 'Pregnancy/Fertility', name: 'Anti-Müllerian Hormone (AMH) test' },
  { category: 'Pregnancy/Fertility', name: 'Semen analysis test' },
  { category: 'Pregnancy/Fertility', name: 'Testosterone test' },

  // Tuberculosis (TB)
  { category: 'Tuberculosis (TB)', name: 'Sputum for AFB/ZN stain' },
  { category: 'Tuberculosis (TB)', name: 'QuantiFERON-TB Gold test' },
  { category: 'Tuberculosis (TB)', name: 'CBNAAT test' },
  { category: 'Tuberculosis (TB)', name: 'TB PCR test' },
  { category: 'Tuberculosis (TB)', name: 'Mantoux test' },

  // Heart
  { category: 'Heart', name: 'Lipid Profile' },
  { category: 'Heart', name: 'HS C-RP' },
  { category: 'Heart', name: 'NT Pro-BNP' },
  { category: 'Heart', name: 'CPK' },
  { category: 'Heart', name: 'Troponin-I' },
  { category: 'Heart', name: 'Troponin-T' },
  { category: 'Heart', name: 'Pericardial Fluid Examination' },

  // Thyroid/Hormone
  { category: 'Thyroid/Hormone', name: 'T3,T4,TSH(Thyroid Profile)' },
  { category: 'Thyroid/Hormone', name: 'FT3,FT4,TSH(Free Thyroid Panel)' },
  { category: 'Thyroid/Hormone', name: 'Anti TPO Antibody' },
  { category: 'Thyroid/Hormone', name: 'Anti Thyroglobulin Antibody' },
  { category: 'Thyroid/Hormone', name: 'PTH(Parathyroid Hormone)' },

  // Fever
  { category: 'Fever', name: 'Dengue NS1' },
  { category: 'Fever', name: 'Widal test' },
  { category: 'Fever', name: 'Malaria parasite' },
  { category: 'Fever', name: 'Malaria antigen' },
  { category: 'Fever', name: 'Typhidot(IgM and IgG)' },
  { category: 'Fever', name: 'Chikungunya test' },
  { category: 'Fever', name: 'Scrub typhus test' },

  // LIVER
  { category: 'Liver', name: 'ALT/SGPT' },
  { category: 'Liver', name: 'AST/SGOT' },
  { category: 'Liver', name: 'Liver Function Test' },
  { category: 'Liver', name: 'Bilirubin Total, Direct & Indirect' },
  { category: 'Liver', name: 'Urine BS & BP test' },

  // Bone
  { category: 'Bone', name: 'Vit-D' },
  { category: 'Bone', name: 'Calcium' },
  { category: 'Bone', name: 'Phosphorus' },

  // Kidney
  { category: 'Kidney', name: 'Routine urine examination/CS' },
  { category: 'Kidney', name: 'Creatinine test' },
  { category: 'Kidney', name: 'Urea test' },
  { category: 'Kidney', name: 'Uric acid test' },
  { category: 'Kidney', name: 'Blood Electrolytes test' },
  { category: 'Kidney', name: 'Kidney function test' },
  { category: 'Kidney', name: 'Microalbumin Creatinine ratio(Urine)' },
  { category: 'Kidney', name: 'Sodium blood test' },
  { category: 'Kidney', name: 'Potassium blood test' },

  // Coagulation
  { category: 'Coagulation', name: 'Prothrombin Time (PT)' },
  { category: 'Coagulation', name: 'APTT test' },
  { category: 'Coagulation', name: 'BT/CT test' },
  { category: 'Coagulation', name: 'platelet count' },
];

async function seedDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected!');

    console.log(`Processing ${testData.length} tests...`);
    
    let added = 0;
    let updated = 0;

    for (const test of testData) {
      // Clean up whitespace and set default price
      const cleanName = test.name.trim();
      const result = await Test.updateOne(
        { name: cleanName },
        { 
          $set: { 
            name: cleanName,
            category: test.category,
            price: 0, // Placeholder price as requested
            isActive: true
          } 
        },
        { upsert: true }
      );

      if (result.upsertedCount > 0) {
        added++;
      } else if (result.modifiedCount > 0) {
        updated++;
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
