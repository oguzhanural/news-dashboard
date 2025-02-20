import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ChartBarIcon,
  UserIcon,
  UserGroupIcon,
  Cog6ToothIcon,
  KeyIcon,
  ShoppingCartIcon,
  WindowIcon,
  WrenchScrewdriverIcon,
} from '@heroicons/react/24/outline';

type IconComponent = typeof ChartBarIcon;

interface NavigationItem {
  name: string;
  href: string;
  icon: IconComponent;
  badge?: string;
}

interface NavigationSection {
  name: string;
  items?: NavigationItem[];
  href?: string;
  icon?: IconComponent;
}

const navigation: NavigationSection[] = [
  { name: 'Dashboards', href: '/dashboard', icon: ChartBarIcon },
  {
    name: 'USER',
    items: [
      { name: 'Public Profile', href: '/dashboard/profile', icon: UserIcon },
      { name: 'My Account', href: '/dashboard/account', icon: Cog6ToothIcon },
      { name: 'Network', href: '/dashboard/network', icon: UserGroupIcon },
      { name: 'Authentication', href: '/dashboard/auth', icon: KeyIcon },
    ],
  },
  {
    name: 'APPS',
    items: [
      { name: 'User Management', href: '/dashboard/users', icon: UserGroupIcon, badge: 'Soon' },
      { name: 'Projects', href: '/dashboard/projects', icon: WindowIcon, badge: 'Soon' },
      { name: 'eCommerce', href: '/dashboard/ecommerce', icon: ShoppingCartIcon, badge: 'Soon' },
    ],
  },
  {
    name: 'MISCELLANEOUS',
    items: [
      { name: 'Modals', href: '/dashboard/modals', icon: WindowIcon, badge: 'Soon' },
      { name: 'Wizards', href: '/dashboard/wizards', icon: WrenchScrewdriverIcon, badge: 'Soon' },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState<string[]>(['USER', 'APPS', 'MISCELLANEOUS']);

  const toggleSection = (section: string) => {
    setExpanded(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  return (
    <div className="w-64 bg-white h-full border-r border-gray-200">
      <div className="flex flex-col h-full">
        <div className="flex items-center h-16 px-4 border-b border-gray-200">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <span className="text-xl font-bold text-gray-800">News Dashboard</span>
          </Link>
        </div>
        
        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-4">
            {navigation.map((item) => (
              <li key={item.name}>
                {item.href && item.icon ? (
                  <Link
                    href={item.href}
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg ${
                      pathname === item.href
                        ? 'text-primary-600 bg-primary-50'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    {item.name}
                  </Link>
                ) : (
                  <div className="space-y-2">
                    <button
                      onClick={() => toggleSection(item.name)}
                      className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-gray-500"
                    >
                      {item.name}
                    </button>
                    {expanded.includes(item.name) && item.items && (
                      <ul className="space-y-1 ml-3">
                        {item.items.map((subItem) => (
                          <li key={subItem.name}>
                            <Link
                              href={subItem.href}
                              className={`flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg ${
                                pathname === subItem.href
                                  ? 'text-primary-600 bg-primary-50'
                                  : 'text-gray-700 hover:bg-gray-50'
                              }`}
                            >
                              <div className="flex items-center">
                                <subItem.icon className="w-5 h-5 mr-3" />
                                {subItem.name}
                              </div>
                              {subItem.badge && (
                                <span className="text-xs font-medium text-gray-500">
                                  {subItem.badge}
                                </span>
                              )}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
} 