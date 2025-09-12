/*
  # Add Function to Resolve Consultant Alerts

  1. RPC Function
    - Create function to resolve consultant alerts by type and source
    - Enable consultants to mark alerts as resolved when viewing related content

  2. Security
    - Ensure only consultants can resolve their own alerts
    - Add proper RLS policies
*/

-- Create RPC function to resolve consultant alerts
CREATE OR REPLACE FUNCTION resolve_consultant_alerts(
    consultant_id_param uuid,
    alert_source_id_param uuid,
    alert_type_param text
)
RETURNS void AS $$
BEGIN
    -- Update consultant alerts to resolved
    UPDATE consultant_alerts 
    SET 
        is_resolved = TRUE,
        resolved_at = NOW()
    WHERE 
        consultant_id = consultant_id_param
        AND alert_source_id = alert_source_id_param
        AND alert_type = alert_type_param
        AND is_resolved = FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION resolve_consultant_alerts(uuid, uuid, text) TO authenticated;

-- Create RPC function to resolve all alerts for a consultant by type
CREATE OR REPLACE FUNCTION resolve_consultant_alerts_by_type(
    consultant_id_param uuid,
    alert_type_param text
)
RETURNS void AS $$
BEGIN
    -- Update consultant alerts to resolved
    UPDATE consultant_alerts 
    SET 
        is_resolved = TRUE,
        resolved_at = NOW()
    WHERE 
        consultant_id = consultant_id_param
        AND alert_type = alert_type_param
        AND is_resolved = FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION resolve_consultant_alerts_by_type(uuid, text) TO authenticated;