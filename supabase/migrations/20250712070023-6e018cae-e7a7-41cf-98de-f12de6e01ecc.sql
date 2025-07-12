
-- Create enums for better data integrity
CREATE TYPE item_status AS ENUM ('pending', 'approved', 'rejected', 'swapped');
CREATE TYPE item_condition AS ENUM ('new', 'like_new', 'good', 'fair', 'worn');
CREATE TYPE item_category AS ENUM ('tops', 'bottoms', 'dresses', 'outerwear', 'shoes', 'accessories');
CREATE TYPE clothing_size AS ENUM ('xs', 's', 'm', 'l', 'xl', 'xxl', 'xxxl');
CREATE TYPE swap_status AS ENUM ('pending', 'accepted', 'rejected', 'completed', 'cancelled');
CREATE TYPE transaction_type AS ENUM ('earned', 'spent', 'refunded');

-- Create profiles table (extends auth.users)
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  points INTEGER DEFAULT 100,
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tags table
CREATE TABLE public.tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create items table
CREATE TABLE public.items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category item_category NOT NULL,
  size clothing_size,
  condition item_condition NOT NULL,
  status item_status DEFAULT 'pending',
  point_value INTEGER DEFAULT 50,
  image_urls TEXT[] DEFAULT '{}',
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create item_tags junction table
CREATE TABLE public.item_tags (
  item_id UUID NOT NULL REFERENCES public.items(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
  PRIMARY KEY (item_id, tag_id)
);

-- Create swap_requests table
CREATE TABLE public.swap_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  requester_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  requested_item_id UUID NOT NULL REFERENCES public.items(id) ON DELETE CASCADE,
  offered_item_id UUID REFERENCES public.items(id) ON DELETE CASCADE,
  points_offered INTEGER DEFAULT 0,
  message TEXT,
  status swap_status DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create points_log table
CREATE TABLE public.points_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  transaction_type transaction_type NOT NULL,
  description TEXT,
  swap_request_id UUID REFERENCES public.swap_requests(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.swap_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.points_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.item_tags ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Create RLS policies for items
CREATE POLICY "Anyone can view approved items" ON public.items FOR SELECT USING (status = 'approved' OR user_id = auth.uid());
CREATE POLICY "Users can insert own items" ON public.items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own items" ON public.items FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can update any item" ON public.items FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND (bio LIKE '%admin%' OR bio LIKE '%moderator%'))
);

-- Create RLS policies for swap_requests
CREATE POLICY "Users can view their swap requests" ON public.swap_requests FOR SELECT USING (
  auth.uid() = requester_id OR auth.uid() = owner_id
);
CREATE POLICY "Users can create swap requests" ON public.swap_requests FOR INSERT WITH CHECK (auth.uid() = requester_id);
CREATE POLICY "Users can update swap requests they're involved in" ON public.swap_requests FOR UPDATE USING (
  auth.uid() = requester_id OR auth.uid() = owner_id
);

-- Create RLS policies for points_log
CREATE POLICY "Users can view own points log" ON public.points_log FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can insert points log" ON public.points_log FOR INSERT WITH CHECK (true);

-- Create RLS policies for tags
CREATE POLICY "Anyone can view tags" ON public.tags FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create tags" ON public.tags FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Create RLS policies for item_tags
CREATE POLICY "Anyone can view item tags" ON public.item_tags FOR SELECT USING (true);
CREATE POLICY "Item owners can manage tags" ON public.item_tags FOR ALL USING (
  EXISTS (SELECT 1 FROM public.items WHERE id = item_id AND user_id = auth.uid())
);

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at timestamps
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_items_updated_at BEFORE UPDATE ON public.items FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_swap_requests_updated_at BEFORE UPDATE ON public.swap_requests FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for live updates
ALTER TABLE public.items REPLICA IDENTITY FULL;
ALTER TABLE public.swap_requests REPLICA IDENTITY FULL;
ALTER TABLE public.points_log REPLICA IDENTITY FULL;
ALTER TABLE public.profiles REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.items;
ALTER PUBLICATION supabase_realtime ADD TABLE public.swap_requests;
ALTER PUBLICATION supabase_realtime ADD TABLE public.points_log;
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;

-- Insert some default tags
INSERT INTO public.tags (name) VALUES 
('vintage'), ('casual'), ('formal'), ('summer'), ('winter'), 
('sustainable'), ('designer'), ('handmade'), ('rare'), ('trendy');
