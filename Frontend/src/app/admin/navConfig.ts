import { Briefcase, FolderKanban, GalleryHorizontal, Images, LayoutDashboard, Package, Users, UserCog, ScrollText, ShieldCheck, type LucideIcon } from 'lucide-react';

export interface AdminNavItem {
  label: string;
  to: string;
  icon: LucideIcon;
  // Dynamic permission slug required to see this item — mirrors the backend's `permission:...`
  // route middleware (see routes/api.php). Omit for items every authenticated admin can see.
  permission?: string;
  // A handful of endpoints (role/permission management itself) stay hardcoded to the literal
  // super_admin role rather than going through the dynamic permission system, to avoid a
  // privilege-escalation loop where a role could grant itself the power to grant roles.
  superAdminOnly?: boolean;
}

export const adminNavItems: AdminNavItem[] = [
  { label: 'Dashboard', to: '/admin', icon: LayoutDashboard },
  { label: 'Hero Slides', to: '/admin/hero-slides', icon: GalleryHorizontal, permission: 'hero_slides.manage' },
  { label: 'Produk', to: '/admin/products', icon: Package, permission: 'products.manage' },
  { label: 'Galeri', to: '/admin/gallery', icon: Images, permission: 'gallery.manage' },
  { label: 'Portofolio', to: '/admin/portfolios', icon: FolderKanban, permission: 'portfolios.manage' },
  { label: 'Lowongan Kerja', to: '/admin/job-vacancies', icon: Briefcase, permission: 'job_vacancies.manage' },
  { label: 'Pelamar Kerja', to: '/admin/career-applications', icon: Users, permission: 'career_applications.manage' },
  { label: 'Manajemen User', to: '/admin/users', icon: UserCog, permission: 'users.manage' },
  { label: 'Manajemen Role', to: '/admin/roles', icon: ShieldCheck, superAdminOnly: true },
  { label: 'Log Aktivitas', to: '/admin/audit-logs', icon: ScrollText, permission: 'audit_logs.view' },
];
