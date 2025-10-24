// migrations/safe-fix-foreign-key.js
const sequelize = require('../config/db');

async function safeFixForeignKey() {
  try {
    console.log('🔄 Checking and fixing foreign key constraint...');
    
    // Check if the old constraint exists
    const [constraints] = await sequelize.query(`
      SELECT CONSTRAINT_NAME 
      FROM information_schema.KEY_COLUMN_USAGE 
      WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = 'tanya_jawab' 
      AND CONSTRAINT_NAME = 'tanya_jawab_ibfk_1';
    `);
    
    if (constraints.length > 0) {
      console.log('📋 Found old foreign key constraint, dropping it...');
      
      // Drop the existing foreign key constraint
      await sequelize.query(`
        ALTER TABLE tanya_jawab 
        DROP FOREIGN KEY tanya_jawab_ibfk_1;
      `);
      console.log('✅ Dropped old foreign key constraint');
    } else {
      console.log('ℹ️  No old foreign key constraint found');
    }
    
    // Check if the new constraint already exists
    const [newConstraints] = await sequelize.query(`
      SELECT CONSTRAINT_NAME 
      FROM information_schema.KEY_COLUMN_USAGE 
      WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = 'tanya_jawab' 
      AND REFERENCED_TABLE_NAME = 'admins';
    `);
    
    if (newConstraints.length === 0) {
      console.log('📋 Adding new foreign key constraint...');
      
      // Add new foreign key constraint pointing to 'admins' table
      await sequelize.query(`
        ALTER TABLE tanya_jawab 
        ADD CONSTRAINT tanya_jawab_ibfk_1 
        FOREIGN KEY (answered_by) REFERENCES admins(id) 
        ON DELETE SET NULL ON UPDATE CASCADE;
      `);
      console.log('✅ Added new foreign key constraint');
    } else {
      console.log('ℹ️  New foreign key constraint already exists');
    }
    
    console.log('🎉 Foreign key constraint process completed!');
    
  } catch (error) {
    console.error('❌ Error fixing foreign key constraint:', error);
  } finally {
    await sequelize.close();
  }
}

// Run the migration
safeFixForeignKey();
