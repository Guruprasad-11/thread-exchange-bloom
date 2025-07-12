-- Ensure the trigger function exists and is working properly
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Add some logging for debugging
  RAISE LOG 'Creating profile for user: %', NEW.id;
  
  INSERT INTO public.profiles (id, username, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
  );
  
  RAISE LOG 'Profile created successfully for user: %', NEW.id;
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE LOG 'Error creating profile for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop and recreate the trigger to ensure it's properly attached
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Add a function to manually create profiles for existing users
CREATE OR REPLACE FUNCTION public.create_missing_profiles()
RETURNS void AS $$
DECLARE
  auth_user RECORD;
BEGIN
  FOR auth_user IN 
    SELECT au.id, au.email, au.raw_user_meta_data
    FROM auth.users au
    LEFT JOIN public.profiles p ON au.id = p.id
    WHERE p.id IS NULL
  LOOP
    BEGIN
      INSERT INTO public.profiles (id, username, full_name, avatar_url)
      VALUES (
        auth_user.id,
        COALESCE(auth_user.raw_user_meta_data->>'username', split_part(auth_user.email, '@', 1)),
        COALESCE(auth_user.raw_user_meta_data->>'full_name', ''),
        COALESCE(auth_user.raw_user_meta_data->>'avatar_url', '')
      );
      RAISE LOG 'Created missing profile for user: %', auth_user.id;
    EXCEPTION
      WHEN OTHERS THEN
        RAISE LOG 'Error creating missing profile for user %: %', auth_user.id, SQLERRM;
    END;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Run the function to create any missing profiles
SELECT public.create_missing_profiles(); 