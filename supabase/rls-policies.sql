-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  location TEXT,
  points INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create items table
CREATE TABLE IF NOT EXISTS items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  condition TEXT NOT NULL,
  size TEXT,
  point_value INTEGER,
  image_urls TEXT[],
  status TEXT DEFAULT 'pending',
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security on profiles table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to read their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Policy to allow users to insert their own profile
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Policy to allow users to update their own profile
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Policy to allow users to delete their own profile
CREATE POLICY "Users can delete own profile" ON profiles
  FOR DELETE USING (auth.uid() = id);

-- Enable RLS on items table
ALTER TABLE items ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to view all approved items
CREATE POLICY "Anyone can view approved items" ON items
  FOR SELECT USING (status = 'approved');

-- Policy to allow users to view their own items
CREATE POLICY "Users can view own items" ON items
  FOR SELECT USING (auth.uid() = user_id);

-- Policy to allow users to insert their own items
CREATE POLICY "Users can insert own items" ON items
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy to allow users to update their own items
CREATE POLICY "Users can update own items" ON items
  FOR UPDATE USING (auth.uid() = user_id);

-- Policy to allow users to delete their own items
CREATE POLICY "Users can delete own items" ON items
  FOR DELETE USING (auth.uid() = user_id);

-- Enable RLS on swap_requests table
ALTER TABLE swap_requests ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to view swap requests they're involved in
CREATE POLICY "Users can view related swap requests" ON swap_requests
  FOR SELECT USING (auth.uid() = requester_id OR auth.uid() = owner_id);

-- Policy to allow users to insert swap requests
CREATE POLICY "Users can insert swap requests" ON swap_requests
  FOR INSERT WITH CHECK (auth.uid() = requester_id);

-- Policy to allow users to update swap requests they own
CREATE POLICY "Users can update owned swap requests" ON swap_requests
  FOR UPDATE USING (auth.uid() = owner_id);

-- Enable RLS on points_log table
ALTER TABLE points_log ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to view their own points log
CREATE POLICY "Users can view own points log" ON points_log
  FOR SELECT USING (auth.uid() = user_id);

-- Policy to allow users to insert their own points log entries
CREATE POLICY "Users can insert own points log" ON points_log
  FOR INSERT WITH CHECK (auth.uid() = user_id); 