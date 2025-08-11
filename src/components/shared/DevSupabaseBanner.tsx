import React from 'react';

const DevSupabaseBanner: React.FC = () => {
  if (!import.meta.env.DEV) return null;
  const url = import.meta.env.VITE_SUPABASE_URL?.replace(/\/+$/, '');
  if (!url) return null;
  let host: string;
  try {
    host = new URL(url).host;
  } catch {
    host = url;
  }
  return (
    <div className="fixed top-0 right-0 bg-black text-white text-xs px-2 py-1 z-50 opacity-70">
      {host}
    </div>
  );
};

export default DevSupabaseBanner;
