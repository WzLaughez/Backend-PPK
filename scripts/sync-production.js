// scripts/sync-production.js
const sequelize = require('../config/db');

async function safeSync() {
  try {
    console.log('🔄 Starting safe database sync...');
    
    // Only create tables that don't exist (won't modify existing ones)
    await sequelize.sync({ force: false, alter: false });
    
    console.log('✅ Database sync completed safely!');
    console.log('📝 Only new tables were created, existing data preserved.');
    
  } catch (error) {
    console.error('❌ Sync failed:', error);
  } finally {
    await sequelize.close();
  }
}

// Run the sync
safeSync();
