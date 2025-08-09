import React from 'react';

export const SupabaseEnvWarning: React.FC = () => {
  const missing = !import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY;
  if (!missing) return null;
  return (
    <div className="bg-yellow-100 text-yellow-800 text-center p-2 text-sm">
      Supabase env missing; contact admin
    </div>
  );
};
