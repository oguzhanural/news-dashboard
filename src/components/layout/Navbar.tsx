import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  HomeIcon,
  UserCircleIcon,
  UserGroupIcon,
  KeyIcon,
  QuestionMarkCircleIcon,
  MagnifyingGlassIcon,
  BellIcon,
  Squares2X2Icon,
  ChatBubbleLeftIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Home', href: '/dashboard', icon: HomeIcon },
  { name: 'Profiles', href: '/dashboard/profiles', icon: UserCircleIcon },
  { name: 'My Account', href: '/dashboard/account', icon: UserCircleIcon },
  { name: 'Network', href: '/dashboard/network', icon: UserGroupIcon },
  { name: 'Authentication', href: '/dashboard/auth', icon: KeyIcon },
  { name: 'Help', href: '/dashboard/help', icon: QuestionMarkCircleIcon },
];

export function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  return (
    <div className="h-16 bg-white border-b border-gray-200">
      <div className="h-full px-4 flex items-center justify-between">
        {/* Navigation Links */}
        <nav className="hidden md:flex space-x-4">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Right side icons */}
        <div className="flex items-center space-x-4">
          <button className="p-2 text-gray-600 hover:text-gray-900">
            <MagnifyingGlassIcon className="w-6 h-6" />
          </button>
          <button className="p-2 text-gray-600 hover:text-gray-900">
            <ChatBubbleLeftIcon className="w-6 h-6" />
          </button>
          <button className="p-2 text-gray-600 hover:text-gray-900">
            <BellIcon className="w-6 h-6" />
          </button>
          <button className="p-2 text-gray-600 hover:text-gray-900">
            <Squares2X2Icon className="w-6 h-6" />
          </button>
          
          {/* User Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button 
              className="flex items-center space-x-2"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
            >
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                {user?.name ? (
                  <span className="text-sm font-medium text-gray-600">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                ) : (
                  <UserCircleIcon className="w-6 h-6 text-gray-600" />
                )}
              </div>
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                </div>
                <Link
                  href="/dashboard/profile"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsProfileOpen(false)}
                >
                  <Cog6ToothIcon className="w-5 h-5 mr-2" />
                  Profile Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <ArrowRightOnRectangleIcon className="w-5 h-5 mr-2" />
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 