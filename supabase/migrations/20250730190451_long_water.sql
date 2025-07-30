/*
  # Add video_url column to portfolio_projects table

  1. Changes
    - Add `video_url` column to `portfolio_projects` table
    - Column is nullable to support existing projects without videos
    - Column type is text to store video URLs

  2. Security
    - No changes to existing RLS policies needed
    - Video URLs will be publicly accessible like image URLs
*/

-- Add video_url column to portfolio_projects table
ALTER TABLE portfolio_projects 
ADD COLUMN IF NOT EXISTS video_url text;

-- Add comment to document the column
COMMENT ON COLUMN portfolio_projects.video_url IS 'URL of the project video file';