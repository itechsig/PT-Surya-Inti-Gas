import { Briefcase, FolderKanban, GalleryHorizontal, Image, Images, LayoutDashboard, Package, Users, UserCog, ScrollText, ShieldCheck, type LucideIcon } from 'lucide-react';

export type AdminNavGroup = 'overview' | 'content' | 'career' | 'system';

// Sidebar section order + headings. Items render under their group in this order.
export const adminNavGroups: { id: AdminNavGroup; label: string }[] = [
  { id: 'overview', label: 'Ringkasan' },
  { id: 'content', label: 'Konten Website' },
  { id: 'career', label: 'Karir' },
  { id: 'system', label: 'Sistem' },
];

export interface AdminNavItem {
  label: string;
  group: AdminNavGroup;
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
  { label: 'Dashboard', to: '/admin', group: 'overview', icon: LayoutDashboard },
  { label: 'Hero Slides', to: '/admin/hero-slides', group: 'content', icon: GalleryHorizontal, permission: 'hero_slides.manage' },
  { label: 'Produk', to: '/admin/products', group: 'content', icon: Package, permission: 'products.manage' },
  { label: 'Foto Kategori', to: '/admin/category-photos', group: 'content', icon: Image, permission: 'products.manage' },
  { label: 'Galeri', to: '/admin/gallery', group: 'content', icon: Images, permission: 'gallery.manage' },
  { label: 'Portofolio', to: '/admin/portfolios', group: 'content', icon: FolderKanban, permission: 'portfolios.manage' },
  { label: 'Lowongan Kerja', to: '/admin/job-vacancies', group: 'career', icon: Briefcase, permission: 'job_vacancies.manage' },
  { label: 'Pelamar Kerja', to: '/admin/career-applications', group: 'career', icon: Users, permission: 'career_applications.manage' },
  { label: 'Manajemen User', to: '/admin/users', group: 'system', icon: UserCog, permission: 'users.manage' },
  { label: 'Manajemen Role', to: '/admin/roles', group: 'system', icon: ShieldCheck, superAdminOnly: true },
  { label: 'Log Aktivitas', to: '/admin/audit-logs', group: 'system', icon: ScrollText, permission: 'audit_logs.view' },
];
