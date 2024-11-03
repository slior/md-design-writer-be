
-- Adding users as document authors.

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR NOT NULL UNIQUE,
    password VARCHAR NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


/* -- from dbeaver
CREATE TABLE public.users (
	id uuid DEFAULT uuid_generate_v4() NOT NULL,
	email varchar NOT NULL,
	"password" varchar NOT NULL,
	createdat timestamp DEFAULT now() NOT NULL,
	updatedat timestamp DEFAULT now() NOT NULL,
	CONSTRAINT users_pk PRIMARY KEY (id)
);
*/
-- Add author_id column to Documents table
ALTER TABLE "Documents" 
    ADD COLUMN author_id UUID;

-- Create an index on author_id for better query performance
CREATE INDEX idx_document_author ON "Documents"(author_id);