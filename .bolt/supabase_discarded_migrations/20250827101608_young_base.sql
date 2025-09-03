/*
  # Create Custom Enum Types

  1. Enum Types
    - `user_role` (admin, client, consultant)
    - `project_status` (pending, in_progress, completed, cancelled)
    - `document_type` (identity, business, financial, legal, other)
    - `transaction_status` (pending, completed, failed, refunded)
*/

-- Create enum types
CREATE TYPE user_role AS ENUM ('admin', 'client', 'consultant');
CREATE TYPE project_status AS ENUM ('pending', 'in_progress', 'completed', 'cancelled');
CREATE TYPE document_type AS ENUM ('identity', 'business', 'financial', 'legal', 'other');
CREATE TYPE transaction_status AS ENUM ('pending', 'completed', 'failed', 'refunded');