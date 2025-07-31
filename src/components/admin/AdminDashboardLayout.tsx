import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { 
  Home,
  Building,
  Users,
  DollarSign,
  Shield,
  Globe,
  Settings,
  FileText,
  BarChart3,
  AlertTriangle,
  Scale,
  Menu,
  X,
  Sparkles
} from 'lucide-react';

interface AdminDashboardLayoutProps {
  admin: any;
  children: React.ReactNode;
}

const AdminDashboardLayout: React.FC<AdminDashboardLayoutProps> = ({
  admin,
  children
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: Home },
    { name: 'Legacy Integration', href: '/admin/legacy-integration', icon: Building },
    { name: 'Consultants', href: '/admin/consultants', icon: Users },
    { name: 'Revenue Management', href: '/admin/revenue', icon: DollarSign },
    { name: 'AI Safety Center', href: '/admin/ai-safety', icon: Shield },
    { name: 'Countries', href: '/admin/countries', icon: Globe },
    { name: 'Services', href: '/admin/services', icon: Settings },
    { name: 'Clients', href: '/admin/clients', icon: FileText },
    { name: 'Legal Compliance', href: '/admin/legal-compliance', icon: Scale },
    { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  ];

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 flex z-40 lg:hidden ${sidebarOpen ? '' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white shadow-xl">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-6 w-6 text-white" />
            </button>
          </div>

          {/* Mobile navigation */}
          <nav className="mt-5 flex-1 px-2 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`group flex items-center px-2 py-2 text-base font-medium rounded-xl transition-all duration-200 ${
                  location.pathname === item.href
                    ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className="mr-4 h-6 w-6" />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 bg-white shadow-xl border-r border-gray-200">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            {/* Logo */}
            <div className="flex items-center flex-shrink-0 px-4 mb-8">
              <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center mr-3">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-red-600">Admin Panel</h1>
            </div>

            {/* Navigation */}
            <nav className="mt-5 flex-1 px-2 space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                    location.pathname === item.href
                      ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg transform scale-105'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 hover:scale-105'
                  }`}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          
          {/* Admin profile section */}
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <div className="flex items-center w-full">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-red-500 to-red-600 flex items-center justify-center">
                  <span className="text-sm font-bold text-white">
                    {admin?.first_name?.charAt(0) || 'A'}
                  </span>
                </div>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-semibold text-gray-700">
                  {admin?.first_name} {admin?.last_name}
                </p>
                <p className="text-xs text-gray-500">System Administrator</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64 flex flex-col flex-1">
        {/* Top navigation */}
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-200">
          <div className="flex justify-between items-center px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center">
              <button
                type="button"
                className="lg:hidden -ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>

            <div className="flex items-center space-x-4">
              {/* Emergency controls button */}
              <button className="bg-red-100 text-red-800 px-4 py-2 rounded-xl text-sm font-medium hover:bg-red-200 transition-colors flex items-center">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Emergency Controls
              </button>

              {/* Profile dropdown */}
              <div className="relative">
                <button
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  className="flex items-center text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 p-2 hover:bg-gray-100 transition-colors"
                >
                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-red-500 to-red-600 flex items-center justify-center">
                    <span className="text-sm font-bold text-white">
                      {admin?.first_name?.charAt(0) || 'A'}
                    </span>
                  </div>
                </button>

                {profileMenuOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-xl shadow-lg bg-white ring-1 ring-black ring-opacity-5 border border-gray-200">
                    <div className="py-1">
                      <Link
                        to="/admin/settings"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg mx-1"
                        onClick={() => setProfileMenuOpen(false)}
                      >
                        Settings
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg mx-1"
                      >
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Page content */}
        <main className="flex-1">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboardLayout;