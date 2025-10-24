// migrations/check-and-fix-all-constraints.js
const sequelize = require('../config/db');

async function checkAndFixAllConstraints() {
  try {
    console.log('🔍 Checking all foreign key constraints on tanya_jawab table...');
    
    // Get all foreign key constraints on tanya_jawab table
    const [constraints] = await sequelize.query(`
      SELECT 
        CONSTRAINT_NAME,
        COLUMN_NAME,
        REFERENCED_TABLE_NAME,
        REFERENCED_COLUMN_NAME
      FROM information_schema.KEY_COLUMN_USAGE 
      WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = 'tanya_jawab' 
      AND REFERENCED_TABLE_NAME IS NOT NULL;
    `);
    
    console.log('📋 Found constraints:', constraints);
    
    // Fix each constraint that points to 'admin' table
    for (const constraint of constraints) {
      if (constraint.REFERENCED_TABLE_NAME === 'admin') {
        console.log(`🔧 Fixing constraint: ${constraint.CONSTRAINT_NAME}`);
        
        // Drop the old constraint
        await sequelize.query(`
          ALTER TABLE tanya_jawab 
          DROP FOREIGN KEY ${constraint.CONSTRAINT_NAME};
        `);
        console.log(`✅ Dropped constraint: ${constraint.CONSTRAINT_NAME}`);
        
        // Add new constraint pointing to 'admins' table
        await sequelize.query(`
          ALTER TABLE tanya_jawab 
          ADD CONSTRAINT ${constraint.CONSTRAINT_NAME} 
          FOREIGN KEY (${constraint.COLUMN_NAME}) REFERENCES admins(${constraint.REFERENCED_COLUMN_NAME}) 
          ON DELETE SET NULL ON UPDATE CASCADE;
        `);
        console.log(`✅ Added new constraint: ${constraint.CONSTRAINT_NAME}`);
      }
    }
    
    console.log('🎉 All foreign key constraints fixed!');
    
  } catch (error) {
    console.error('❌ Error fixing constraints:', error);
  } finally {
    await sequelize.close();
  }
}

// Run the migration
checkAndFixAllConstraints();
