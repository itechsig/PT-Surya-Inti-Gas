import { useState, Suspense } from 'react';
import { Outlet, useLocation, useNavigate, Link } from 'react-router-dom';
import { ThemeProvider, useTheme } from 'next-themes';
import { Moon, Sun, LogOut, User as UserIcon, UserCog } from 'lucide-react';
import { useAuth } from '../../context';
import { adminNavItems } from './navConfig';
import { ProfileDialog } from './ProfileDialog';
import { ForceChangePasswordPage } from './ForceChangePasswordPage';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarInset,
} from '../components/ui/sidebar';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Toaster } from '../components/ui/sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={isDark ? 'Beralih ke mode terang' : 'Beralih ke mode gelap'}
    >
      <Sun className="h-4 w-4 dark:hidden" />
      <Moon className="hidden h-4 w-4 dark:block" />
    </Button>
  );
}

function AdminShell() {
  const { user, logout, hasRole, can } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login', { replace: true });
  };

  const visibleNavItems = adminNavItems.filter((item) => {
    if (item.superAdminOnly) return hasRole('super_admin');
    if (item.permission) return can(item.permission);
    return true;
  });

  if (user?.must_change_password) {
    return (
      <>
        <ForceChangePasswordPage />
        <Toaster position="top-right" />
      </>
    );
  }

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <div className="flex items-center gap-2 px-2 py-1.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white ring-1 ring-border">
              <img src="/logo.png" alt="PT Surya Inti Gas" className="h-full w-full object-contain p-0.5" />
            </div>
            <div className="flex flex-col overflow-hidden group-data-[collapsible=icon]:hidden">
              <span className="truncate text-sm font-semibold">Surya Inti Gas</span>
              <span className="truncate text-xs text-muted-foreground">Admin Dashboard</span>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {visibleNavItems.map((item) => {
              const active =
                item.to === '/admin'
                  ? location.pathname === '/admin'
                  : location.pathname === item.to || location.pathname.startsWith(`${item.to}/`);
              return (
                <SidebarMenuItem key={item.to}>
                  <SidebarMenuButton asChild isActive={active} tooltip={item.label}>
                    <Link to={item.to} aria-current={active ? 'page' : undefined}>
                      <item.icon />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton size="lg">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted">
                  <UserIcon className="h-3.5 w-3.5" />
                </div>
                <div className="flex flex-col overflow-hidden text-left group-data-[collapsible=icon]:hidden">
                  <span className="truncate text-sm font-medium">{user?.name}</span>
                  <span className="truncate text-xs text-muted-foreground">
                    {user?.role_label ?? ''}
                  </span>
                </div>
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="top" align="start" className="w-56">
              <DropdownMenuLabel>{user?.email}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setProfileOpen(true)}>
                <UserCog className="h-4 w-4" />
                Edit Profil
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
                Keluar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center justify-between border-b px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger />
            {user && (
              <Badge variant="secondary" className="hidden sm:inline-flex">
                {user.role_label}
              </Badge>
            )}
          </div>
          <ThemeToggle />
        </header>
        <main className="flex-1 p-4 md:p-6">
          {/* Nested admin pages are code-split; keep the sidebar/header mounted
              while a section's chunk loads instead of falling back to the
              outer route Suspense (which would hide this whole shell). */}
          <Suspense fallback={<div style={{ minHeight: '40vh' }} aria-hidden="true" />}>
            <Outlet />
          </Suspense>
        </main>
      </SidebarInset>
      <Toaster position="top-right" />
      <ProfileDialog open={profileOpen} onOpenChange={setProfileOpen} />
    </SidebarProvider>
  );
}

export function AdminLayout() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem storageKey="admin-theme">
      <AdminShell />
    </ThemeProvider>
  );
}
