const { neon } = require('@neondatabase/serverless');
require('dotenv').config();

async function cleanupDatabase() {
  const sql = neon(process.env.DATABASE_URL);
  
  try {
    console.log('Cleaning up database...');
    
    // Drop tables in reverse order of dependencies
    await sql`DROP TABLE IF EXISTS file_uploads CASCADE`;
    await sql`DROP TABLE IF EXISTS admin_profiles CASCADE`;
    await sql`DROP TABLE IF EXISTS client_profiles CASCADE`;
    await sql`DROP TABLE IF EXISTS individual_practitioner_profiles CASCADE`;
    await sql`DROP TABLE IF EXISTS case_manager_profiles CASCADE`;
    await sql`DROP TABLE IF EXISTS users CASCADE`;
    
    // Drop types
    await sql`DROP TYPE IF EXISTS user_type CASCADE`;
    await sql`DROP TYPE IF EXISTS onboarding_status CASCADE`;
    
    console.log('Database cleanup completed!');
  } catch (error) {
    console.error('Error cleaning up database:', error);
    process.exit(1);
  }
}

cleanupDatabase();