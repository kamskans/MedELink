import { neon } from '@neondatabase/serverless';

// Create a database connection
const sql = neon(process.env.DATABASE_URL!);

export default sql;

// Helper functions for common queries
export async function createUser(email: string, name: string | null, userType: string, neonUserId: string) {
  const result = await sql`
    INSERT INTO users (email, name, user_type, neon_user_id)
    VALUES (${email}, ${name}, ${userType}::user_type, ${neonUserId})
    RETURNING *
  `;
  return result[0];
}

export async function getUserByNeonId(neonUserId: string) {
  const result = await sql`
    SELECT * FROM users WHERE neon_user_id = ${neonUserId}
  `;
  return result[0];
}

export async function getUserById(userId: string) {
  const result = await sql`
    SELECT * FROM users WHERE id = ${userId}
  `;
  return result[0];
}

export async function getCaseManagerProfile(userId: string) {
  const result = await sql`
    SELECT * FROM case_manager_profiles WHERE user_id = ${userId}
  `;
  return result[0];
}

export async function createCaseManagerProfile(userId: string) {
  const result = await sql`
    INSERT INTO case_manager_profiles (user_id)
    VALUES (${userId})
    RETURNING *
  `;
  return result[0];
}

export async function updateCaseManagerProfile(userId: string, data: any) {
  // Update case manager profile with all provided fields
  const result = await sql`
    UPDATE case_manager_profiles
    SET
      name = COALESCE(${data.name}, name),
      email = COALESCE(${data.email}, email),
      address = COALESCE(${data.address}, address),
      date_of_birth = COALESCE(${data.date_of_birth}, date_of_birth),
      phone_number = COALESCE(${data.phone_number}, phone_number),
      qualification = COALESCE(${data.qualification}, qualification),
      qualification_year = COALESCE(${data.qualification_year}, qualification_year),
      profession = COALESCE(${data.profession}, profession),
      job_title = COALESCE(${data.job_title}, job_title),
      company_name = COALESCE(${data.company_name}, company_name),
      company_email = COALESCE(${data.company_email}, company_email),
      company_phone = COALESCE(${data.company_phone}, company_phone),
      business_type = COALESCE(${data.business_type}, business_type),
      rehabilitation_clients = COALESCE(${data.rehabilitation_clients}, rehabilitation_clients),
      regulatory_body = COALESCE(${data.regulatory_body}, regulatory_body),
      practice_restrictions = COALESCE(${data.practice_restrictions}, practice_restrictions),
      cqc_regulated = COALESCE(${data.cqc_regulated}, cqc_regulated),
      additional_training = COALESCE(${data.additional_training}, additional_training),
      company_address = COALESCE(${data.company_address}, company_address),
      registration_number = COALESCE(${data.registration_number}, registration_number),
      terms_accepted = COALESCE(${data.terms_accepted}, terms_accepted),
      onboarding_status = COALESCE(${data.onboarding_status}::onboarding_status, onboarding_status),
      onboarding_step = COALESCE(${data.onboarding_step}, onboarding_step)
    WHERE user_id = ${userId}
    RETURNING *
  `;
  return result[0];
}

export async function updateOnboardingStatus(userId: string, status: string, step: number) {
  const result = await sql`
    UPDATE case_manager_profiles 
    SET onboarding_status = ${status}::onboarding_status, 
        onboarding_step = ${step}
    WHERE user_id = ${userId}
    RETURNING *
  `;
  return result[0];
}

// Individual Practitioner functions
export async function getIndividualPractitionerProfile(userId: string) {
  const result = await sql`
    SELECT * FROM individual_practitioner_profiles WHERE user_id = ${userId}
  `;
  return result[0];
}

export async function createIndividualPractitionerProfile(userId: string) {
  const result = await sql`
    INSERT INTO individual_practitioner_profiles (user_id)
    VALUES (${userId})
    RETURNING *
  `;
  return result[0];
}

// File upload functions
export async function saveFileUpload(fileData: {
  fileName: string;
  fileType: string;
  fileSize: number;
  url: string;
  uploadedBy: string;
  entityType: string;
  entityId: string;
  fieldName: string;
}) {
  const result = await sql`
    INSERT INTO file_uploads (
      file_name, file_type, file_size, url, uploaded_by, 
      entity_type, entity_id, field_name
    )
    VALUES (
      ${fileData.fileName}, ${fileData.fileType}, ${fileData.fileSize}, 
      ${fileData.url}, ${fileData.uploadedBy}, ${fileData.entityType}, 
      ${fileData.entityId}, ${fileData.fieldName}
    )
    RETURNING *
  `;
  return result[0];
}