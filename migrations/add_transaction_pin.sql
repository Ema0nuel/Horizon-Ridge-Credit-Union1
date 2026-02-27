-- Add transaction_pin column to user_profiles table
-- transaction_pin: 4-digit PIN (stored as TEXT for security - should be hashed in production)
-- pin_set_at: timestamp when PIN was first set
-- pin_updated_at: timestamp when PIN was last updated
-- pin_attempts: track failed PIN attempts

ALTER TABLE public.user_profiles
ADD COLUMN IF NOT EXISTS transaction_pin TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS pin_set_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
ADD COLUMN IF NOT EXISTS pin_updated_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
ADD COLUMN IF NOT EXISTS pin_attempts INTEGER DEFAULT 0;

-- Create index for faster PIN lookups
CREATE INDEX IF NOT EXISTS idx_user_profiles_transaction_pin 
ON public.user_profiles(id) 
WHERE transaction_pin IS NOT NULL;

-- PostgreSQL function to validate PIN format (4 digits, not 1234)
CREATE OR REPLACE FUNCTION validate_transaction_pin(pin TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  -- Check if PIN is exactly 4 digits
  IF pin IS NULL OR pin !~ '^\d{4}$' THEN
    RETURN FALSE;
  END IF;
  
  -- Check if PIN is not the default 1234
  IF pin = '1234' THEN
    RETURN FALSE;
  END IF;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Add constraint using the validation function
ALTER TABLE public.user_profiles
ADD CONSTRAINT check_valid_transaction_pin
CHECK (
  transaction_pin IS NULL 
  OR validate_transaction_pin(transaction_pin)
);

-- Add comment documenting the column
COMMENT ON COLUMN public.user_profiles.transaction_pin IS 
'4-digit transaction PIN for transfers and financial operations. 
Must be 4 digits and cannot be 1234. Should be hashed in production.';

COMMENT ON COLUMN public.user_profiles.pin_set_at IS 
'Timestamp when transaction PIN was first set';

COMMENT ON COLUMN public.user_profiles.pin_updated_at IS 
'Timestamp when transaction PIN was last updated';

COMMENT ON COLUMN public.user_profiles.pin_attempts IS 
'Number of consecutive failed PIN verification attempts';
