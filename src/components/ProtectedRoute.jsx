import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

const ProtectedRoute = ({ children, requiredRole }) => {
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  const [profileError, setProfileError] = useState(null);

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { user }
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      let profile = null;
      const stored = localStorage.getItem('user');
      if (stored) {
        profile = JSON.parse(stored);
      } else {
        const { data: profileData } = await supabase
          .from('users')
          .select('*')
          .eq('auth_user_id', user.id)
          .maybeSingle();
        if (profileData) {
          profile = profileData;
          localStorage.setItem('user', JSON.stringify(profileData));
        } else {
          setProfileError('Your profile was not found. Please contact an administrator.');
        }
      }

      setUserProfile(profile);
      setLoading(false);
    };

    checkSession();
  }, []);

  if (loading) return null;

  if (profileError) {
    return (
      <div className="p-4 text-center text-red-500">{profileError}</div>
    );
  }

  if (!userProfile) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && userProfile.role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;