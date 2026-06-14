import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Test from './models/model.test.js';
import { mapTestToCategory } from './utils/util.categoryMapper.js';
import { mapTestToDepartment } from './utils/util.departmentMapper.js';

dotenv.config();

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const tests = await Test.find({});
  let updatedCategories = 0;
  let updatedDepartments = 0;
  for (const t of tests) {
    let changed = false;
    
    // Attempt category assignment
    const cat = mapTestToCategory(t.name);
    if (cat !== 'General' && (!t.category || t.category === 'General' || t.category === '')) {
      t.category = cat;
      changed = true;
      updatedCategories++;
    }
    
    // Attempt department assignment
    const dept = mapTestToDepartment(t.name);
    if (dept !== 'General' && (!t.department || t.department === 'General' || t.department === '')) {
      t.department = dept;
      changed = true;
      updatedDepartments++;
    }
    
    if (changed) await t.save();
  }
  console.log(`Successfully categorized tests: ${updatedCategories} categories, ${updatedDepartments} departments updated.`);
  process.exit(0);
}).catch(console.error);
