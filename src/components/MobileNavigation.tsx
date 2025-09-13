import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  FolderOpen, 
  MessageSquare, 
  User,
  CheckSquare
} from 'lucide-react';

const MobileNavigation = () => {
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Projects', href: '/projects', icon: FolderOpen },
    { name: 'Tasks', href: '/tasks', icon: CheckSquare },
    { name: 'Messages', href: '/messages', icon: MessageSquare },
    { name: 'Profile', href: '/settings', icon: User },
  ];

  return (
    <div className="mobile-nav md:hidden">
      <div className="flex justify-around items-center py-2 px-4">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-colors ${
                isActive
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-xs font-medium">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default MobileNavigation;