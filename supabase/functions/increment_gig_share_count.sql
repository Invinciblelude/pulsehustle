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