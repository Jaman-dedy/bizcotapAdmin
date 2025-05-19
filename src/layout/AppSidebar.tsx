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
      className={`fixed mt-[6em] flex  flex-col lg:mt-0 top-0 px-5 left-0 bg-white h-screen transition-all duration-300 z-50 ${
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

      <nav className="pt-5 flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <ul className="flex flex-col gap-4">
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
        {(isExpanded || isHovered || isMobileOpen)}
      </nav>
    </aside>
  );
};

export default AppSidebar;