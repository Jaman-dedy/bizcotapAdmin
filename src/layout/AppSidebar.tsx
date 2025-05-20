"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSidebar } from "../context/SidebarContext";
import useAuth from "@/hooks/useAuth";

import {
  ChevronDownIcon,
  GridIcon,
  ListIcon,
  PieChartIcon,
  PlugInIcon,
  TableIcon,
  CalenderIcon,
  UserCircleIcon,
  MailIcon
} from "../icons/index";
import SidebarWidget from "./SidebarWidget";

type UserRole = "super_admin" | "company_admin" | "individual";

type NavItem = {
  name: string;
  path: string;
  roles: UserRole[];
  icon: React.ReactNode;
};
const navItems: NavItem[] = [
  { name: "Dashboard", path: "/dashboard", roles: ["super_admin", "individual"], icon: <GridIcon /> },
  { name: "Dashboard", path: "/companyAdmin/dashboard", roles: ["company_admin",], icon: <GridIcon /> },
  { name: "Tags & Cards", path: "/tags", roles: ["super_admin"], icon: <PlugInIcon /> },
  { name: "Profiles", path: "/companyAdmin/profiles", roles: ["company_admin"], icon: <UserCircleIcon /> },
  { name: "Contacts", path: "/companyAdmin/contacts", roles: ["company_admin"], icon: <MailIcon /> },
  { name: "Orders", path: "/orders", roles: ["super_admin"], icon: <ListIcon /> },
  { name: "Companies", path: "/companies", roles: ["super_admin"], icon: <TableIcon /> },
  { name: "Employees", path: "/employees", roles: ["company_admin"], icon: <ListIcon /> },
  { name: "Leads", path: "/leads", roles: ["company_admin", "individual"], icon: <PieChartIcon /> },
  { name: "Insights", path: "/insights", roles: ["company_admin", "individual"], icon: <CalenderIcon /> },
  { name: "Profiles", path: "/profiles", roles: ["individual"], icon: <UserCircleIcon /> },
  { name: "Transactions", path: "/transactions", roles: ["super_admin"], icon: <TableIcon /> },
  { name: "Users", path: "/users", roles: ["super_admin"], icon: <UserCircleIcon /> },
  { name: "Settings", path: "/settings", roles: ["super_admin", "company_admin", "individual"], icon: <ChevronDownIcon /> },
  { name: "Support", path: "/support", roles: ["company_admin", "individual"], icon: <ListIcon /> },
];

// Premium Sidebar Advertisement Component
const PremiumSidebarAd = ({ isExpanded, isHovered, isMobileOpen }: { isExpanded: boolean, isHovered: boolean, isMobileOpen: boolean }) => {
  const isCompact = !isExpanded && !isHovered && !isMobileOpen;
  
  return (
    <div className={`mt-auto mb-5 mx-auto w-full transition-all duration-300 ${isCompact ? 'px-1' : 'px-3'}`}>
      {/* Main Card Container */}
      <div className={`
        relative overflow-hidden rounded-2xl
        bg-gradient-to-br from-indigo-900 via-blue-800 to-purple-900
        shadow-lg transform transition-all duration-300 hover:shadow-xl
        ${isCompact ? 'p-2 w-16 h-16 mx-auto' : 'p-4'}
      `}>
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Geometric shapes */}
          <div className="absolute top-0 right-0 w-20 h-20 rounded-full bg-blue-400 opacity-10 transform translate-x-6 -translate-y-6"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 rounded-full bg-purple-300 opacity-10 transform -translate-x-6 translate-y-6"></div>
          
          {/* Shimmering effect */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white via-transparent to-transparent opacity-5"></div>
          
          {/* Subtle grid pattern */}
          <div className="absolute inset-0 opacity-5" 
               style={{ 
                 backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                 backgroundSize: '15px 15px' 
               }}>
          </div>
        </div>
        
        {/* Content container */}
        <div className="relative z-10 flex flex-col items-center">
          {/* Image with glow effect */}
          <div className={`
            relative flex items-center justify-center
            ${isCompact ? '' : 'mb-3'}
          `}>
            <div className={`
              absolute inset-0 rounded-full bg-blue-400 filter blur-md opacity-30
              ${isCompact ? 'scale-90' : 'scale-100'}
            `}></div>
            <Image 
              src="/images/isco.png" 
              alt="Premium Feature" 
              width={isCompact ? 40 : 70} 
              height={isCompact ? 40 : 70}
              className="relative z-10 rounded-full object-cover ring-2 ring-white/30"
            />
          </div>
          
          {/* Text content - only show when sidebar is expanded */}
          {!isCompact && (
            <div className="text-white text-center">
              <h3 className="font-bold text-sm">Premium Features</h3>
              <p className="text-xs mt-1 opacity-80 px-1">Unlock advanced tools and analytics</p>
              <button className="mt-3 bg-white text-blue-800 hover:bg-blue-50 text-xs font-semibold px-3 py-1.5 rounded-lg shadow-sm transition-colors w-full">
                Visit Now
              </button>
            </div>
          )}
        </div>
        
        {/* Animated shine effect */}
        <div className="absolute top-0 -left-40 h-full w-20 bg-white opacity-10 transform rotate-15 animate-shine"></div>
      </div>
    </div>
  );
};

const AppSidebar: React.FC = () => {
  const { user } = useAuth();
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const pathname = usePathname();

  const isActive = useCallback((path: string) => pathname === path, [pathname]);

  const filteredNavItems = navItems.filter((item) =>
    item.roles.includes(user?.role!)
  );

  return (
    <aside
      className={`fixed mt-[6em] flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white h-screen transition-all duration-300 z-50 ${
        isExpanded || isMobileOpen
          ? "w-[270px]"
          : isHovered
          ? "w-[270px]"
          : "w-[90px]"
      } ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-3 flex lg:block hidden ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-center border-b"
        }`}
      >
        <Link href="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <Image
              src="/images/logo/logo.svg"
              alt="Logo"
              width={100}
              height={32}
              className="dark:hidden"
            />
          ) : (
            <Image
              src="/images/logo/logo-icon.svg"
              alt="Logo"
              width={32}
              height={32}
            />
          )}
        </Link>
      </div>

      <nav className="pt-5 flex flex-col h-full overflow-y-auto duration-300 ease-linear no-scrollbar">
        <ul className="flex flex-col gap-4 mb-6">
          {filteredNavItems.map((nav) => (
            <li key={nav.name}>
              <Link
                href={nav.path!}
                className={`flex items-center gap-3 rounded-lg px-4 py-3 font-medium transition-colors ${
                  isActive(nav.path!) 
                    ? "!bg-[#1d40ad] text-white" 
                    : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                }`}
              >
                <span
                  className={`flex items-center justify-center text-xl ${
                    isActive(nav.path!)
                      ? "text-white" 
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="whitespace-nowrap">{nav.name}</span>
                )}
              </Link>
            </li>
          ))}
        </ul>
        
        {/* Spacer to push ad to bottom */}
        <div className="flex-grow"></div>
        
        {/* Premium advertisement component */}
        <PremiumSidebarAd 
          isExpanded={isExpanded} 
          isHovered={isHovered} 
          isMobileOpen={isMobileOpen} 
        />
      </nav>
    </aside>
  );
};

// Add the animation class to your global CSS or a CSS module
// .animate-shine { animation: shine 3s infinite linear; }
// @keyframes shine { 
//   0% { transform: translateX(-100%) rotate(15deg); }
//   100% { transform: translateX(200%) rotate(15deg); }
// }

export default AppSidebar;