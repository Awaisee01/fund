-- Create or update admin user that bypasses 2FA
DO $$
DECLARE
  v_id uuid;
BEGIN
  SELECT id INTO v_id FROM public.admin_users WHERE email = 'rohansamad@proton.me';
  IF v_id IS NULL THEN
    INSERT INTO public.admin_users (
      email,
      password_hash,
      is_active,
      totp_verified,
      role,
      totp_secret,
      created_at,
      updated_at
    ) VALUES (
      'rohansamad@proton.me',
      'R3oN!7vZk#Q2b8M^yL6p@wX4Tz',
      true,
      true,
      'admin',
      NULL,
      now(),
      now()
    );
  ELSE
    UPDATE public.admin_users
    SET password_hash = 'R3oN!7vZk#Q2b8M^yL6p@wX4Tz',
        is_active = true,
        totp_verified = true,
        totp_secret = NULL,
        role = 'admin',
        updated_at = now()
    WHERE id = v_id;
  END IF;
END $$;