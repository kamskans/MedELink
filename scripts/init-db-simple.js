const { neon } = require('@neondatabase/serverless');
require('dotenv').config();

async function initDatabase() {
  const sql = neon(process.env.DATABASE_URL);
  
  try {
    console.log('Initializing database schema...');
    
    // Create types
    console.log('Creating types...');
    await sql`CREATE TYPE user_type AS ENUM ('CASE_MANAGER', 'INDIVIDUAL_PRACTITIONER', 'CLIENT', 'ADMIN')`;
    await sql`CREATE TYPE onboarding_status AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED')`;
    
    // Create users table
    console.log('Creating users table...');
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255),
        user_type user_type NOT NULL,
        neon_user_id TEXT UNIQUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    // Create case_manager_profiles table
    console.log('Creating case_manager_profiles table...');
    await sql`
      CREATE TABLE IF NOT EXISTS case_manager_profiles (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
        user_id TEXT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        onboarding_status onboarding_status DEFAULT 'NOT_STARTED',
        onboarding_step INTEGER DEFAULT 1,
        name VARCHAR(255),
        email VARCHAR(255),
        address TEXT,
        date_of_birth DATE,
        phone_number VARCHAR(50),
        qualification VARCHAR(255),
        qualification_year VARCHAR(4),
        profession VARCHAR(255),
        job_title VARCHAR(255),
        profile_picture_url TEXT,
        qualification_doc_url TEXT,
        company_name VARCHAR(255),
        company_email VARCHAR(255),
        company_phone VARCHAR(50),
        business_type VARCHAR(50),
        rehabilitation_clients TEXT,
        regulatory_body VARCHAR(255),
        practice_restrictions VARCHAR(50),
        cqc_regulated VARCHAR(50),
        additional_training TEXT,
        company_address TEXT,
        company_logo_url TEXT,
        registration_number VARCHAR(255),
        insurance_doc_url TEXT,
        video_intro_url TEXT,
        terms_accepted BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    // Create other tables
    console.log('Creating other profile tables...');
    await sql`
      CREATE TABLE IF NOT EXISTS individual_practitioner_profiles (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
        user_id TEXT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        onboarding_status onboarding_status DEFAULT 'NOT_STARTED',
        onboarding_step INTEGER DEFAULT 1,
        name VARCHAR(255),
        email VARCHAR(255),
        phone VARCHAR(50),
        address TEXT,
        date_of_birth DATE,
        specialization VARCHAR(255),
        license_number VARCHAR(255),
        qualification VARCHAR(255),
        years_of_experience INTEGER,
        bio TEXT,
        verified BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    await sql`
      CREATE TABLE IF NOT EXISTS client_profiles (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
        user_id TEXT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        date_of_birth DATE,
        phone_number VARCHAR(50),
        address TEXT,
        emergency_contact TEXT,
        medical_history TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    await sql`
      CREATE TABLE IF NOT EXISTS admin_profiles (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
        user_id TEXT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        department VARCHAR(255),
        role VARCHAR(255),
        permissions JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    // Create file uploads table
    console.log('Creating file_uploads table...');
    await sql`
      CREATE TABLE IF NOT EXISTS file_uploads (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
        file_name VARCHAR(255) NOT NULL,
        file_type VARCHAR(100),
        file_size INTEGER,
        url TEXT NOT NULL,
        uploaded_by TEXT NOT NULL,
        entity_type VARCHAR(50),
        entity_id TEXT,
        field_name VARCHAR(100),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    // Create indexes
    console.log('Creating indexes...');
    await sql`CREATE INDEX IF NOT EXISTS idx_users_neon_user_id ON users(neon_user_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_users_user_type ON users(user_type)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_case_manager_onboarding ON case_manager_profiles(onboarding_status)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_practitioner_onboarding ON individual_practitioner_profiles(onboarding_status)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_file_uploads_entity ON file_uploads(entity_type, entity_id)`;
    
    console.log('Database schema initialized successfully!');
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
}

initDatabase();