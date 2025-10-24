// migrations/fix-foreign-key-constraint.js
const sequelize = require('../config/db');

async function fixForeignKeyConstraint() {
  try {
    console.log('🔄 Fixing foreign key constraint...');
    
    // Step 1: Drop the existing foreign key constraint
    await sequelize.query(`
      ALTER TABLE tanya_jawab 
      DROP FOREIGN KEY tanya_jawab_ibfk_1;
    `);
    console.log('✅ Dropped old foreign key constraint');
    
    // Step 2: Add new foreign key constraint pointing to 'admins' table
    await sequelize.query(`
      ALTER TABLE tanya_jawab 
      ADD CONSTRAINT tanya_jawab_ibfk_1 
      FOREIGN KEY (answered_by) REFERENCES admins(id) 
      ON DELETE SET NULL ON UPDATE CASCADE;
    `);
    console.log('✅ Added new foreign key constraint');
    
    console.log('🎉 Foreign key constraint fixed successfully!');
    
  } catch (error) {
    console.error('❌ Error fixing foreign key constraint:', error);
  } finally {
    await sequelize.close();
  }
}

// Run the migration
fixForeignKeyConstraint();
