-- Nexium Project Database Schema
-- This schema creates all necessary tables, policies, and functions for the daily mood tracking app

-- Create profiles table with email tracking
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  preferences JSONB DEFAULT '{}',
  timezone TEXT DEFAULT 'UTC',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create daily_logs table
CREATE TABLE IF NOT EXISTS daily_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  mood TEXT NOT NULL CHECK (mood IN ('Happy', 'Good', 'Okay', 'Sad', 'Terrible')),
  notes TEXT,
  ai_suggestion TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own logs" ON daily_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own logs" ON daily_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'first_name', NEW.raw_user_meta_data->>'last_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create profile
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_daily_logs_updated_at
  BEFORE UPDATE ON daily_logs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to get user statistics
CREATE OR REPLACE FUNCTION get_user_stats(user_uuid UUID)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'total_logs', COUNT(*),
    'current_streak', 0, -- This would need more complex logic
    'average_mood', AVG(CASE 
      WHEN mood = 'Happy' THEN 5
      WHEN mood = 'Good' THEN 4
      WHEN mood = 'Okay' THEN 3
      WHEN mood = 'Sad' THEN 2
      WHEN mood = 'Terrible' THEN 1
      ELSE 3
    END)
  ) INTO result
  FROM daily_logs
  WHERE user_id = user_uuid;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get mood trends
CREATE OR REPLACE FUNCTION get_mood_trends(user_uuid UUID, days_back INTEGER DEFAULT 30)
RETURNS TABLE (
  date DATE,
  mood_count INTEGER,
  average_mood_score NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    DATE(dl.created_at) as date,
    COUNT(*) as mood_count,
    AVG(CASE 
      WHEN dl.mood = 'Happy' THEN 5
      WHEN dl.mood = 'Good' THEN 4
      WHEN dl.mood = 'Okay' THEN 3
      WHEN dl.mood = 'Sad' THEN 2
      WHEN dl.mood = 'Terrible' THEN 1
      ELSE 3
    END) as average_mood_score
  FROM daily_logs dl
  WHERE dl.user_id = user_uuid
    AND dl.created_at >= NOW() - INTERVAL '1 day' * days_back
  GROUP BY DATE(dl.created_at)
  ORDER BY date DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get mood distribution
CREATE OR REPLACE FUNCTION get_mood_distribution(user_uuid UUID, days_back INTEGER DEFAULT 30)
RETURNS TABLE (
  mood TEXT,
  count INTEGER,
  percentage NUMERIC
) AS $$
DECLARE
  total_count INTEGER;
BEGIN
  -- Get total count
  SELECT COUNT(*) INTO total_count
  FROM daily_logs
  WHERE user_id = user_uuid
    AND created_at >= NOW() - INTERVAL '1 day' * days_back;
  
  -- Return mood distribution
  RETURN QUERY
  SELECT 
    dl.mood,
    COUNT(*) as count,
    ROUND((COUNT(*)::NUMERIC / total_count) * 100, 2) as percentage
  FROM daily_logs dl
  WHERE dl.user_id = user_uuid
    AND dl.created_at >= NOW() - INTERVAL '1 day' * days_back
  GROUP BY dl.mood
  ORDER BY count DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get current streak
CREATE OR REPLACE FUNCTION get_current_streak(user_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
  streak_count INTEGER := 0;
  check_date_val DATE := CURRENT_DATE;
  check_date_count INTEGER;
BEGIN
  -- Check consecutive days backwards from today
  LOOP
    SELECT COUNT(*) INTO check_date_count
    FROM daily_logs
    WHERE user_id = user_uuid
      AND DATE(created_at) = check_date_val;
    
    IF check_date_count > 0 THEN
      streak_count := streak_count + 1;
      check_date_val := check_date_val - INTERVAL '1 day';
    ELSE
      EXIT;
    END IF;
  END LOOP;
  
  RETURN streak_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get longest streak
CREATE OR REPLACE FUNCTION get_longest_streak(user_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
  max_streak INTEGER := 0;
  current_streak INTEGER := 0;
  prev_date_val DATE;
  current_date_val DATE;
BEGIN
  -- Get all dates with logs, ordered by date
  FOR current_date_val IN 
    SELECT DISTINCT DATE(created_at)
    FROM daily_logs
    WHERE user_id = user_uuid
    ORDER BY DATE(created_at)
  LOOP
    IF prev_date_val IS NULL OR current_date_val = prev_date_val + INTERVAL '1 day' THEN
      current_streak := current_streak + 1;
    ELSE
      current_streak := 1;
    END IF;
    
    IF current_streak > max_streak THEN
      max_streak := current_streak;
    END IF;
    
    prev_date_val := current_date_val;
  END LOOP;
  
  RETURN max_streak;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;

-- Create view for user dashboard data
CREATE OR REPLACE VIEW user_dashboard AS
SELECT 
  p.id as user_id,
  p.first_name,
  p.last_name,
  p.avatar_url,
  COUNT(dl.id) as total_logs,
  get_current_streak(p.id) as current_streak,
  get_longest_streak(p.id) as longest_streak,
  AVG(CASE 
    WHEN dl.mood = 'Happy' THEN 5
    WHEN dl.mood = 'Good' THEN 4
    WHEN dl.mood = 'Okay' THEN 3
    WHEN dl.mood = 'Sad' THEN 2
    WHEN dl.mood = 'Terrible' THEN 1
    ELSE 3
  END) as average_mood_score,
  MAX(dl.created_at) as last_log_date
FROM profiles p
LEFT JOIN daily_logs dl ON p.id = dl.user_id
GROUP BY p.id, p.first_name, p.last_name, p.avatar_url;

-- Grant access to the view
GRANT SELECT ON user_dashboard TO authenticated;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_daily_logs_user_date ON daily_logs(user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_daily_logs_user_mood ON daily_logs(user_id, mood);
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON profiles(created_at);

-- Add comments for documentation
COMMENT ON TABLE profiles IS 'User profiles with personal information and preferences';
COMMENT ON TABLE daily_logs IS 'Daily mood and activity logs for users';
COMMENT ON FUNCTION get_user_stats IS 'Get comprehensive user statistics including total logs and average mood';
COMMENT ON FUNCTION get_mood_trends IS 'Get mood trends over time for a user';
COMMENT ON FUNCTION get_mood_distribution IS 'Get distribution of moods for a user';
COMMENT ON FUNCTION get_current_streak IS 'Calculate current consecutive days streak';
COMMENT ON FUNCTION get_longest_streak IS 'Calculate longest consecutive days streak';
COMMENT ON VIEW user_dashboard IS 'Comprehensive view for user dashboard data'; 