import { useEffect, useRef, useState, Suspense } from 'react';
import { Outlet, useLocation, useNavigate, Link } from 'react-router-dom';
import { ThemeProvider, useTheme } from 'next-themes';
import { ChevronsUpDown, ExternalLink, Moon, Sun, LogOut, UserCog } from 'lucide-react';
import { useAuth } from '../../context';
import { adminNavGroups, adminNavItems } from './navConfig';
import { ProfileDialog } from './ProfileDialog';
import { ForceChangePasswordPage } from './ForceChangePasswordPage';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarInset,
  SidebarRail,
  SidebarSeparator,
  useSidebar,
} from '../components/ui/sidebar';
import { Button } from '../components/ui/button';
import { Separator } from '../components/ui/separator';
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

function getInitials(name?: string) {
  const parts = (name ?? '').trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function isNavActive(to: string, pathname: string) {
  return to === '/admin' ? pathname === '/admin' : pathname === to || pathname.startsWith(`${to}/`);
}

// On mobile the sidebar is a Sheet overlay; close it after navigating so the new page is visible.
function CloseMobileSidebarOnNavigate() {
  const { pathname } = useLocation();
  const { isMobile, setOpenMobile } = useSidebar();
  useEffect(() => {
    if (isMobile) setOpenMobile(false);
  }, [pathname, isMobile, setOpenMobile]);
  return null;
}

function AdminShell() {
  const { user, logout, hasRole, can } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [profileOpen, setProfileOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);

  // On route change, reset scroll and move focus to the content region so keyboard/screen
  // reader users land on the new page instead of staying on the clicked sidebar link.
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    window.scrollTo({ top: 0 });
    contentRef.current?.focus({ preventScroll: true });
  }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login', { replace: true });
  };

  const visibleNavItems = adminNavItems.filter((item) => {
    if (item.superAdminOnly) return hasRole('super_admin');
    if (item.permission) return can(item.permission);
    return true;
  });

  const currentItem = adminNavItems.find((item) => isNavActive(item.to, location.pathname));
  const currentGroup = adminNavGroups.find((group) => group.id === currentItem?.group);

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
      <CloseMobileSidebarOnNavigate />
      <a
        href="#admin-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-background focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:shadow-lg focus:ring-2 focus:ring-ring"
      >
        Lewati ke konten utama
      </a>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild size="lg" tooltip="Surya Inti Gas — Dashboard">
                <Link to="/admin">
                  <div className="flex aspect-square size-8 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white ring-1 ring-border">
                    <img src="/logo.png" alt="" className="h-full w-full object-contain p-0.5" />
                  </div>
                  <div className="grid flex-1 text-left leading-tight">
                    <span className="truncate text-sm font-semibold">Surya Inti Gas</span>
                    <span className="truncate text-xs text-muted-foreground">Admin Dashboard</span>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarSeparator className="mx-0" />
        <SidebarContent>
          {adminNavGroups.map((group) => {
            const items = visibleNavItems.filter((item) => item.group === group.id);
            if (items.length === 0) return null;
            return (
              <SidebarGroup key={group.id}>
                <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {items.map((item) => {
                      const active = isNavActive(item.to, location.pathname);
                      return (
                        <SidebarMenuItem key={item.to}>
                          <SidebarMenuButton asChild isActive={active} tooltip={item.label}>
                            <Link to={item.to} aria-current={active ? 'page' : undefined}>
                              <item.icon aria-hidden="true" />
                              <span>{item.label}</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      );
                    })}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            );
          })}
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    tooltip={user?.name}
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  >
                    <div
                      className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-xs font-semibold text-primary-foreground"
                      aria-hidden="true"
                    >
                      {getInitials(user?.name)}
                    </div>
                    <div className="grid flex-1 text-left leading-tight">
                      <span className="truncate text-sm font-medium">{user?.name}</span>
                      <span className="truncate text-xs text-muted-foreground">{user?.role_label ?? ''}</span>
                    </div>
                    <ChevronsUpDown className="ml-auto size-4 text-muted-foreground" aria-hidden="true" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="top" align="start" className="w-(--radix-dropdown-menu-trigger-width) min-w-56">
                  <DropdownMenuLabel className="flex flex-col gap-0.5 font-normal">
                    <span className="truncate text-sm font-medium">{user?.name}</span>
                    <span className="truncate text-xs text-muted-foreground">{user?.email}</span>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setProfileOpen(true)}>
                    <UserCog className="h-4 w-4" />
                    Edit Profil
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <a href="/" target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                      Lihat Website
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem variant="destructive" onClick={handleLogout}>
                    <LogOut className="h-4 w-4" />
                    Keluar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset className="min-w-0">
        <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-2 border-b bg-background/85 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/65">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-1 data-[orientation=vertical]:h-4" />
          <nav aria-label="Breadcrumb" className="min-w-0 flex-1">
            <ol className="flex min-w-0 items-center gap-1.5 text-sm">
              {currentGroup && currentItem?.to !== '/admin' && (
                <>
                  <li className="hidden shrink-0 text-muted-foreground sm:block">{currentGroup.label}</li>
                  <li className="hidden shrink-0 text-muted-foreground/60 sm:block" aria-hidden="true">/</li>
                </>
              )}
              <li className="truncate font-medium" aria-current="page">
                {currentItem?.label ?? 'Admin'}
              </li>
            </ol>
          </nav>
          <ThemeToggle />
        </header>
        <div
          id="admin-content"
          ref={contentRef}
          tabIndex={-1}
          className="mx-auto w-full max-w-7xl flex-1 p-4 outline-none sm:p-6 lg:p-8"
        >
          {/* Nested admin pages are code-split; keep the sidebar/header mounted
              while a section's chunk loads instead of falling back to the
              outer route Suspense (which would hide this whole shell). */}
          <Suspense fallback={<div style={{ minHeight: '40vh' }} aria-hidden="true" />}>
            <Outlet />
          </Suspense>
        </div>
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
