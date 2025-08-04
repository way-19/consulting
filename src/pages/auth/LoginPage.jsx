import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Shield } from 'lucide-react';

const LoginPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  // Test accounts
  const testAccounts = [
    {
      role: 'admin',
      email: 'admin@consulting19.com',
      password: 'Admin2024!',
      name: 'System Administrator', 
      description: 'Full system access, analytics, consultant management',
      country_id: null, // Admins are not country-specific
      primary_country_id: null
    },
    {
      role: 'consultant',
      email: 'consultant@consulting19.com',
      password: 'Consultant2024!',
      name: 'Expert Consultant',
      description: 'Client management, custom services, commission tracking',
      country_id: null, // Default consultant, not country-specific
      primary_country_id: null
    },
    {
      role: 'consultant',
      email: 'georgia_consultant@consulting19.com',
      password: 'Consultant2024!',
      name: 'Nino Kvaratskhelia',
      description: 'Georgia-specific client management and services',
      country_id: 1, // Assuming 1 is Georgia's ID for testing
      primary_country_id: 1
    },
    {
      role: 'client',
      email: 'client@consulting19.com',
      password: 'Client2024!',
      name: 'Business Client',
      description: 'Company formation, AI assistant, consultant support',
      country_id: null, // Default client, not country-specific
      primary_country_id: null
    },
    {
      role: 'client',
      email: 'ahmet@test.com',
      password: 'Client2024!',
      name: 'Ahmet Yılmaz',
      description: 'Test client for Georgia consultant',
      country_id: 1, // Georgia ID
      primary_country_id: 1,
      consultant_id: 'c3d4e5f6-a7b8-4012-8456-789012cdefab' // Georgia consultant ID
    },
    {
      role: 'client',
      email: 'maria@test.com',
      password: 'Client2024!',
      name: 'Maria Garcia',
      description: 'Test client 2 for Georgia consultant',
      country_id: 1,
      primary_country_id: 1,
      consultant_id: 'c3d4e5f6-a7b8-4012-8456-789012cdefab'
    },
    {
      role: 'client',
      email: 'david@test.com',
      password: 'Client2024!',
      name: 'David Smith',
      description: 'Test client 3 for Georgia consultant',
      country_id: 1,
      primary_country_id: 1,
      consultant_id: 'c3d4e5f6-a7b8-4012-8456-789012cdefab'
    },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate authentication
    const account = testAccounts.find(acc => 
      acc.email === formData.email && acc.password === formData.password
    );

    if (account) {
      // Store user info in localStorage (for demo purposes)
      localStorage.setItem('user', JSON.stringify({
        id: account.role === 'admin' ? 'a1b2c3d4-e5f6-4123-8901-567890abcdef' :
            account.role === 'consultant' && account.email === 'consultant@consulting19.com' ? 'b2c3d4e5-f6a7-4901-8345-678901bcdefa' :
            account.role === 'consultant' && account.email === 'georgia_consultant@consulting19.com' ? 'c3d4e5f6-a7b8-4012-8456-789012cdefab' :
            account.role === 'consultant' && account.email === 'estonia_consultant@consulting19.com' ? 'b2c3d4e5-f6a7-4901-8345-678901bcdefa' :
            account.role === 'client' && account.email === 'client@consulting19.com' ? 'd4e5f6a7-b8c9-4123-8567-890123defabc' :
            account.role === 'client' && account.email === 'ahmet@test.com' ? 'e5f6a7b8-c9d0-4234-8678-901234efabcd' :
            account.role === 'client' && account.email === 'maria@test.com' ? 'f6a7b8c9-d0e1-4345-8789-012345fabcde' :
            account.role === 'client' && account.email === 'david@test.com' ? 'a7b8c9d0-e1f2-4456-8890-123456abcdef' :
            account.role === 'client' && account.email === 'erik@test.com' ? 'b8c9d0e1-f2a3-4567-8901-234567bcdefg' :
            'c9d0e1f2-a3b4-4678-8012-345678cdefgh', // anna@test.com
        email: account.email,
        role: account.role,
        name: account.name,
        country_id: account.country_id, // Add country_id
        primary_country_id: account.primary_country_id, // Add primary_country_id
        consultant_id: account.consultant_id // Add consultant_id for clients
      }));

      // Redirect based on role
      setTimeout(() => {
        switch (account.role) {
          case 'admin':
            navigate('/admin');
            break;
          case 'consultant':
            if (account.email === 'georgia_consultant@consulting19.com') {
              navigate('/georgia/consultant-dashboard/performance');
            } else {
              navigate('/consultant-dashboard/performance');
            }
            break;
          case 'client':
            navigate('/client');
            break;
          default:
            navigate('/');
        }
      }, 1000);
    } else {
      alert('Invalid credentials. Please use one of the test accounts.');
      setLoading(false);
    }
  };

  const handleTestLogin = (account) => {
    setFormData({
      email: account.email,
      password: account.password
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-blue-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mr-3">
              <Shield className="h-7 w-7 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">CONSULTING19</span>
          </Link>
          <p className="text-purple-200 mt-2">AI-Enhanced Global Intelligence Network</p>
        </div>

        {/* Login Form */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Welcome Back</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/60" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/60" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white py-3 px-4 rounded-xl font-semibold hover:from-orange-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/" className="text-white/80 hover:text-white text-sm">
              ← Back to Home
            </Link>
          </div>
        </div>

        {/* Test Accounts */}
        <div className="mt-8 bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-white/20">
          <h3 className="text-lg font-bold text-white mb-4 text-center">Test Accounts</h3>
          <div className="space-y-3">
            {testAccounts.map((account, index) => (
              <button
                key={index}
                onClick={() => handleTestLogin(account)}
                className="w-full text-left bg-white/10 hover:bg-white/20 rounded-xl p-4 transition-all duration-300 border border-white/20"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-white font-medium">{account.name}</div>
                    <div className="text-white/70 text-sm">{account.email}</div>
                    <div className="text-white/60 text-xs mt-1">{account.description}</div>
                  </div>
                  <div className="text-white/60">
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </button>
            ))}
          </div>
          <p className="text-white/60 text-xs text-center mt-4">
            Click any account to auto-fill login credentials
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;