const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

async function addYangMenjawabField() {
  try {
    console.log("Adding yangMenjawab field to tanya_jawab table...");
    
    // Add the new column
    await sequelize.query(`
      ALTER TABLE tanya_jawab 
      ADD COLUMN yangMenjawab VARCHAR(255) NULL 
      COMMENT 'Name of person who answered (input by admin)'
    `);
    
    console.log("✅ yangMenjawab field added successfully!");
    
  } catch (error) {
    console.error("❌ Error adding yangMenjawab field:", error.message);
    
    // Check if column already exists
    if (error.message.includes("Duplicate column name") || error.message.includes("already exists")) {
      console.log("ℹ️  yangMenjawab field already exists, skipping...");
    } else {
      throw error;
    }
  }
}

async function removeYangMenjawabField() {
  try {
    console.log("Removing yangMenjawab field from tanya_jawab table...");
    
    await sequelize.query(`
      ALTER TABLE tanya_jawab 
      DROP COLUMN yangMenjawab
    `);
    
    console.log("✅ yangMenjawab field removed successfully!");
    
  } catch (error) {
    console.error("❌ Error removing yangMenjawab field:", error.message);
    throw error;
  }
}

// Run the migration
if (require.main === module) {
  addYangMenjawabField()
    .then(() => {
      console.log("Migration completed successfully!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Migration failed:", error);
      process.exit(1);
    });
}

module.exports = {
  addYangMenjawabField,
  removeYangMenjawabField
};
