"use client";

import * as React from "react";
import {
  BookOpen,
  LayoutDashboard,
  CalendarDays,
  UserCircle,
  Tag,
  Star,
  Search,
  Pill,
  PenLine,
  KeyRound,
  MessageSquareWarning,
} from "lucide-react";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import Link from "next/link";

const ADMIN_NAV = [
  {
    title: "Overview",
    url: "/dashboard",
    icon: LayoutDashboard,
    isActive: true,
    items: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
      },
      {
        title: "All Students",
        url: "/dashboard/all-students",
        icon: Search,
      },
      {
        title: "All Doctors",
        url: "/dashboard/all-doctors",
        icon: Search,
      },
      {
        title: "All Prescriptions",
        url: "/dashboard/all-prescriptions",
        icon: Search,
      },
      {
        title: "All Visits",
        url: "/dashboard/all-visits",
        icon: Search,
      },
      {
        title: "All Medicines",
        url: "/dashboard/all-medicines",
        icon: Pill,
      },
       {
        title: "All Notifications",
        url: "/dashboard/all-notifications",
        icon: Star,
      },
      {
        title: "All Complaints",
        url: "/dashboard/all-complaints",
        icon: MessageSquareWarning,
      },
      {
        title: "All Blogs",
        url: "/dashboard/all-blogs",
        icon: BookOpen,
      },
      {
        title: "Create Doctor",
        url: "/dashboard/create-doctor",
        icon: Tag,
      },
      {
        title: "Update Profile",
        url: "/dashboard/update-profile",
        icon: Tag,
      },
      {
        title: "My Profile",
        url: "/dashboard/me",
        icon: UserCircle,
      },
      {
        title: "Change Password",
        url: "/dashboard/change-password",
        icon: KeyRound,
      },
    ],
  },
];

const STUDENT_NAV = [
  {
    title: "Overview",
    url: "/dashboard",
    icon: LayoutDashboard,
    isActive: true,
    items: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
      },
      {
        title: "My Prescriptions",
        url: "/dashboard/prescriptions",
        icon: Search,
      },
      {
        title: "My Visits",
        url: "/dashboard/visits",
        icon: Search,
      },
      {
        title: "My notifications",
        url: "/dashboard/notifications",
        icon: Search,
      },
      {
        title: "Update Profile",
        url: "/dashboard/update-profile",
        icon: Tag,
      },
      {
        title: "My Profile",
        url: "/dashboard/me",
        icon: UserCircle,
      },
      {
        title: "Change Password",
        url: "/dashboard/change-password",
        icon: KeyRound,
      },
    ],
  },
];

const DOCTOR_NAV = [
  {
    title: "Overview",
    url: "/dashboard",
    icon: LayoutDashboard,
    isActive: true,
    items: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
      },
      {
        title: "All Medicines",
        url: "/dashboard/medicines",
        icon: Pill,
      },
      {
        title: "My Prescriptions",
        url: "/dashboard/prescriptions",
        icon: Search,
      },
      {
        title: "My Visits",
        url: "/dashboard/visits",
        icon: CalendarDays,
      },
       {
        title: "Create Visit",
        url: "/dashboard/create-visit",
        icon: CalendarDays,
      },
       {
        title: "Create Prescription",
        url: "/dashboard/create-prescription",
        icon: Tag,
      },
      {
        title: "Write Blog",
        url: "/dashboard/write-blog",
        icon: PenLine,
      },
      {
        title: "My Blogs",
        url: "/dashboard/my-blogs",
        icon: BookOpen,
      },
      {
        title: "Update Profile",
        url: "/dashboard/update-profile",
        icon: Tag,
      },
      {
        title: "My Profile",
        url: "/dashboard/me",
        icon: UserCircle,
      },
      {
        title: "Change Password",
        url: "/dashboard/change-password",
        icon: KeyRound,
      },
    ],
  },
];

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  userRole: "ADMIN" | "STUDENT" | "DOCTOR";
  userName: string;
  userEmail: string;
}

export function AppSidebar({
  userRole,
  userName,
  userEmail,
  ...props
}: AppSidebarProps) {
  let navItem = null;
  if (userRole === "ADMIN") {
    navItem = ADMIN_NAV;
  } else if (userRole === "DOCTOR") {
    navItem = DOCTOR_NAV;
  } else {
    navItem = STUDENT_NAV;
  }
  return (
    <Sidebar collapsible="icon" data-role={userRole} {...props}>

      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className={`flex aspect-square size-8 items-center justify-center rounded-lg text-white ${
                  userRole === "ADMIN" ? "bg-linear-to-br from-blue-600 to-indigo-600" :
                  userRole === "DOCTOR" ? "bg-linear-to-br from-emerald-600 to-teal-600" :
                  "bg-linear-to-br from-violet-600 to-purple-600"
                }`}>
                  <BookOpen className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-bold">UMC, JSTU</span>
                  <span className="truncate text-xs text-muted-foreground capitalize">
                    {userRole} Dashboard
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={navItem} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser
          user={{
            name: userName,
            email: userEmail,
            avatar: "",
          }}
        />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
