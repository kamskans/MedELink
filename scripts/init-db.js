const { neon } = require('@neondatabase/serverless');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function initDatabase() {
  const sql = neon(process.env.DATABASE_URL);
  
  try {
    // Read the schema file
    const schemaPath = path.join(__dirname, '..', 'sql', 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('Initializing database schema...');
    
    // Execute the entire schema as one transaction
    await sql.query(schema);
    
    console.log('Database schema initialized successfully!');
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
}

initDatabase();