const fs = require('fs');

async function run() {
    const sql = `
-- 1. Ensure columns exist
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS full_name text;

-- 2. Robust trigger function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    new.id, 
    COALESCE(new.raw_user_meta_data->>'full_name', 'New Servant'), 
    new.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO UPDATE 
  SET full_name = EXCLUDED.full_name;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Reset the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. Re-enable RLS correctly
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own profile" ON public.profiles;
CREATE POLICY "Users can manage own profile" ON public.profiles FOR ALL USING (auth.uid() = id);

-- 5. Permissions
GRANT ALL ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
`;

    console.log("Applying SQL fix...");
    const response = await fetch('https://api.supabase.com/v1/projects/lvysvebakhwidqxztrvd/database/query', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer sbp_bc295f3789ff96b3ecf5ef968e424509dd26560c',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query: sql })
    });

    const data = await response.json();
    console.log("Response:", JSON.stringify(data, null, 2));

    if (!response.ok) {
        console.error("Failed to apply fix");
        process.exit(1);
    }
    console.log("Fix applied successfully!");
}

run();
