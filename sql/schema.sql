-- MedELink Database Schema

-- Drop existing types if they exist
DROP TYPE IF EXISTS user_type CASCADE;
DROP TYPE IF EXISTS onboarding_status CASCADE;

-- Create user types enum
CREATE TYPE user_type AS ENUM ('CASE_MANAGER', 'INDIVIDUAL_PRACTITIONER', 'CLIENT', 'ADMIN');
CREATE TYPE onboarding_status AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED');

-- Users table (extends Neon Auth users)
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    user_type user_type NOT NULL,
    neon_user_id TEXT UNIQUE, -- Links to Neon Auth user
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Case Manager profiles
CREATE TABLE IF NOT EXISTS case_manager_profiles (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    user_id TEXT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Onboarding tracking
    onboarding_status onboarding_status DEFAULT 'NOT_STARTED',
    onboarding_step INTEGER DEFAULT 1,
    
    -- Step 1 - Personal Information
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
    
    -- Step 2 - About Your Business
    company_name VARCHAR(255),
    company_email VARCHAR(255),
    company_phone VARCHAR(50),
    business_type VARCHAR(50), -- ltd-company, partnership, other
    rehabilitation_clients TEXT,
    regulatory_body VARCHAR(255),
    practice_restrictions VARCHAR(50),
    cqc_regulated VARCHAR(50),
    additional_training TEXT,
    company_address TEXT,
    company_logo_url TEXT,
    
    -- Step 3 - Governance
    registration_number VARCHAR(255),
    insurance_doc_url TEXT,
    video_intro_url TEXT,
    terms_accepted BOOLEAN DEFAULT FALSE,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Individual Practitioner profiles
CREATE TABLE IF NOT EXISTS individual_practitioner_profiles (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    user_id TEXT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Onboarding tracking
    onboarding_status onboarding_status DEFAULT 'NOT_STARTED',
    onboarding_step INTEGER DEFAULT 1,
    
    -- Profile information
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
);

-- Client profiles
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
);

-- Admin profiles
CREATE TABLE IF NOT EXISTS admin_profiles (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    user_id TEXT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    department VARCHAR(255),
    role VARCHAR(255),
    permissions JSONB,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- File uploads tracking
CREATE TABLE IF NOT EXISTS file_uploads (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    file_name VARCHAR(255) NOT NULL,
    file_type VARCHAR(100),
    file_size INTEGER,
    url TEXT NOT NULL,
    uploaded_by TEXT NOT NULL,
    entity_type VARCHAR(50), -- 'case_manager', 'practitioner', etc.
    entity_id TEXT,
    field_name VARCHAR(100), -- 'profile_picture', 'qualification', etc.
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_users_neon_user_id ON users(neon_user_id);
CREATE INDEX idx_users_user_type ON users(user_type);
CREATE INDEX idx_case_manager_onboarding ON case_manager_profiles(onboarding_status);
CREATE INDEX idx_practitioner_onboarding ON individual_practitioner_profiles(onboarding_status);
CREATE INDEX idx_file_uploads_entity ON file_uploads(entity_type, entity_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_case_manager_profiles_updated_at BEFORE UPDATE ON case_manager_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_individual_practitioner_profiles_updated_at BEFORE UPDATE ON individual_practitioner_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_client_profiles_updated_at BEFORE UPDATE ON client_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admin_profiles_updated_at BEFORE UPDATE ON admin_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();