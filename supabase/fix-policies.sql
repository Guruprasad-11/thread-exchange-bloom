-- Fix existing policies by dropping and recreating them

-- Drop existing policies for profiles table
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can delete own profile" ON profiles;

-- Drop existing policies for items table
DROP POLICY IF EXISTS "Anyone can view approved items" ON items;
DROP POLICY IF EXISTS "Users can view own items" ON items;
DROP POLICY IF EXISTS "Users can insert own items" ON items;
DROP POLICY IF EXISTS "Users can update own items" ON items;
DROP POLICY IF EXISTS "Users can delete own items" ON items;

-- Drop existing policies for tags table
DROP POLICY IF EXISTS "Anyone can view tags" ON tags;

-- Drop existing policies for item_tags table
DROP POLICY IF EXISTS "Anyone can view item tags" ON item_tags;

-- Drop existing policies for swap_requests table
DROP POLICY IF EXISTS "Users can view related swap requests" ON swap_requests;
DROP POLICY IF EXISTS "Users can insert swap requests" ON swap_requests;
DROP POLICY IF EXISTS "Users can update owned swap requests" ON swap_requests;

-- Drop existing policies for points_log table
DROP POLICY IF EXISTS "Users can view own points log" ON points_log;
DROP POLICY IF EXISTS "Users can insert own points log" ON points_log;

-- Now recreate all policies

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can delete own profile" ON profiles
  FOR DELETE USING (auth.uid() = id);

-- Items policies
CREATE POLICY "Anyone can view approved items" ON items
  FOR SELECT USING (status = 'approved');

CREATE POLICY "Users can view own items" ON items
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own items" ON items
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own items" ON items
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own items" ON items
  FOR DELETE USING (auth.uid() = user_id);

-- Tags policies (public read, admin write)
CREATE POLICY "Anyone can view tags" ON tags
  FOR SELECT USING (true);

-- Item tags policies
CREATE POLICY "Anyone can view item tags" ON item_tags
  FOR SELECT USING (true);

-- Swap requests policies
CREATE POLICY "Users can view related swap requests" ON swap_requests
  FOR SELECT USING (auth.uid() = requester_id OR auth.uid() = owner_id);

CREATE POLICY "Users can insert swap requests" ON swap_requests
  FOR INSERT WITH CHECK (auth.uid() = requester_id);

CREATE POLICY "Users can update owned swap requests" ON swap_requests
  FOR UPDATE USING (auth.uid() = owner_id);

-- Points log policies
CREATE POLICY "Users can view own points log" ON points_log
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own points log" ON points_log
  FOR INSERT WITH CHECK (auth.uid() = user_id); 