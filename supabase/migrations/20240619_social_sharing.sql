-- Add a social_shares table to track individual share events
CREATE TABLE IF NOT EXISTS social_shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gig_id UUID REFERENCES gigs(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  platform TEXT NOT NULL,
  ip_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Add index for querying
  CONSTRAINT valid_platform CHECK (platform IN ('twitter', 'facebook', 'linkedin', 'copy', 'native', 'other'))
);

-- Add a share_stats column to the gigs table
ALTER TABLE gigs 
ADD COLUMN IF NOT EXISTS share_stats JSONB DEFAULT jsonb_build_object('total', 0);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS social_shares_gig_id_idx ON social_shares(gig_id);
CREATE INDEX IF NOT EXISTS social_shares_platform_idx ON social_shares(platform);
CREATE INDEX IF NOT EXISTS social_shares_created_at_idx ON social_shares(created_at);

-- Add the RPC function
CREATE OR REPLACE FUNCTION increment_gig_share_count(gig_id UUID, platform TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  gig_exists BOOLEAN;
  platform_count JSONB;
BEGIN
  -- Check if the gig exists
  SELECT EXISTS(SELECT 1 FROM gigs WHERE id = gig_id) INTO gig_exists;
  
  IF NOT gig_exists THEN
    RAISE EXCEPTION 'Gig with ID % does not exist', gig_id;
  END IF;
  
  -- Get the current platform count
  SELECT share_stats FROM gigs WHERE id = gig_id INTO platform_count;
  
  -- If share_stats is null, initialize it
  IF platform_count IS NULL THEN
    platform_count := jsonb_build_object(
      'total', 1,
      platform, 1
    );
  ELSE
    -- Increment the total count
    platform_count := jsonb_set(
      platform_count,
      '{total}',
      to_jsonb(COALESCE((platform_count->>'total')::int, 0) + 1)
    );
    
    -- Check if the platform key exists
    IF platform_count ? platform THEN
      -- Increment the platform count
      platform_count := jsonb_set(
        platform_count,
        ARRAY[platform],
        to_jsonb(COALESCE((platform_count->>platform)::int, 0) + 1)
      );
    ELSE
      -- Add the platform count
      platform_count := platform_count || jsonb_build_object(platform, 1);
    END IF;
  END IF;
  
  -- Update the gig
  UPDATE gigs
  SET 
    share_stats = platform_count,
    updated_at = NOW()
  WHERE id = gig_id;
END;
$$;

-- Grant access to the function
GRANT EXECUTE ON FUNCTION increment_gig_share_count(UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION increment_gig_share_count(UUID, TEXT) TO anon;

-- Create view for share analytics
CREATE OR REPLACE VIEW gig_share_analytics AS
SELECT 
  g.id AS gig_id,
  g.title AS gig_title,
  g.user_id AS creator_id,
  COALESCE((g.share_stats->>'total')::int, 0) AS total_shares,
  COUNT(DISTINCT s.user_id) AS unique_sharers,
  jsonb_object_agg(
    s.platform, 
    COUNT(s.id)
  ) FILTER (WHERE s.platform IS NOT NULL) AS platform_breakdown,
  COUNT(s.id) FILTER (WHERE s.created_at > NOW() - INTERVAL '7 days') AS shares_last_week,
  g.updated_at
FROM 
  gigs g
LEFT JOIN 
  social_shares s ON g.id = s.gig_id
GROUP BY 
  g.id, g.title, g.user_id, g.share_stats, g.updated_at;

-- Create policy for social_shares table
CREATE POLICY "Users can insert their own social shares" 
ON social_shares FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view shares for public gigs" 
ON social_shares FOR SELECT 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM gigs 
    WHERE gigs.id = social_shares.gig_id 
    AND (gigs.user_id = auth.uid() OR gigs.status = 'published')
  )
);

-- Enable RLS on social_shares
ALTER TABLE social_shares ENABLE ROW LEVEL SECURITY; 