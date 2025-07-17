const { neon } = require('@neondatabase/serverless');
require('dotenv').config();

async function addPasswordField() {
  const sql = neon(process.env.DATABASE_URL);
  
  try {
    console.log('Adding password field to users table...');
    
    await sql`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255)
    `;
    
    console.log('Password field added successfully!');
  } catch (error) {
    console.error('Error adding password field:', error);
    process.exit(1);
  }
}

addPasswordField();