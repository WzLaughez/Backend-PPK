// migrations/create-new-table.js
const sequelize = require('../config/db');

async function createNewTable() {
  try {
    // Example: If you created a new model called 'notifications'
    const query = `
      CREATE TABLE IF NOT EXISTS notifications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        message TEXT,
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `;
    
    await sequelize.query(query);
    console.log('✅ New table created successfully!');
    
  } catch (error) {
    console.error('❌ Error creating table:', error);
  } finally {
    await sequelize.close();
  }
}

// Run the migration
createNewTable();
