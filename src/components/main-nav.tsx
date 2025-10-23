'use client';

import {
  GitMerge,
  LayoutDashboard,
  Bug,
  Sparkles,
  Settings,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
  SidebarMenuBadge,
} from '@/components/ui/sidebar';
import { Badge } from '@/components/ui/badge';

const GitlabIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36" {...props} fill="none" >
        <path d="M29.642 21.033L21.012 2.668a1.233 1.233 0 0 0-2.122-.001L10.26 21.033h19.382z" fill="#E24329"></path>
        <path d="M10.26 21.033L6.357 21.03a1.233 1.233 0 0 0-1.144 1.838l12.788 11.237a1.233 1.233 0 0 0 1.895 0l12.788-11.237a1.233 1.233 0 0 0-1.144-1.838l-3.903.002H10.26z" fill="#FC6D26"></path>
        <path d="M6.357 21.032l3.903.001-3.15 9.773a1.233 1.233 0 0 1-2.287-1.09l1.534-8.684z" fill="#FCA326"></path>
        <path d="M6.357 21.03h3.903L18 34.108 6.357 21.03z" fill="#FC6D26"></path>
        <path d="M29.642 21.033h-9.69L18 34.108l11.642-13.075z" fill="#E24329"></path>
        <path d="M29.642 21.032l-3.903.001 3.15 9.773a1.233 1.233 0 0 0 2.287-1.09l-1.534-8.684z" fill="#FCA326"></path>
    </svg>
);


export function MainNav() {
  const pathname = usePathname();

  const menuItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/repository/gitlab-navigator', label: 'Repository', icon: GitMerge, match: '/repository' },
    { href: '/issues', label: 'Issues', icon: Bug, badge: '6' },
    { href: '/assistant', label: 'AI Assistant', icon: Sparkles, match: '/assistant' },
  ];

  return (
    <Sidebar collapsible="icon" className="group-data-[variant=sidebar]:bg-sidebar group-data-[variant=sidebar]:text-sidebar-foreground">
      <SidebarHeader>
        <div className="flex items-center gap-2 p-2 font-headline text-lg font-semibold">
          <GitlabIcon className="h-8 w-8" />
          <span className="group-data-[collapsible=icon]:hidden">Gitlab Navigator</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.label}>
              <Link href={item.href} legacyBehavior passHref>
                <SidebarMenuButton
                  isActive={pathname.startsWith(item.match || item.href)}
                  tooltip={item.label}
                  className="data-[active=true]:bg-sidebar-primary data-[active=true]:text-sidebar-primary-foreground"
                >
                  <item.icon />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </Link>
              {item.badge && <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>}
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarSeparator />
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Settings">
              <Settings />
              <span>Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <div className="flex items-center gap-3 p-2">
                <Avatar className="h-8 w-8">
                    <AvatarImage src="https://picsum.photos/seed/user/40/40" alt="User" />
                    <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <div className="flex flex-col group-data-[collapsible=icon]:hidden">
                    <span className="text-sm font-medium">User</span>
                    <span className="text-xs text-muted-foreground">user@gitlab.com</span>
                </div>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
