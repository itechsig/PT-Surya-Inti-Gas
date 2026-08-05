import { Briefcase, FolderKanban, GalleryHorizontal, Images, LayoutDashboard, Package, Users, UserCog, ScrollText, type LucideIcon } from 'lucide-react';
import { AdminRole } from '../../context';

export interface AdminNavItem {
  label: string;
  to: string;
  icon: LucideIcon;
  roles?: AdminRole[];
}

// Each CMS module (Products, Jobs, Gallery, ...) appends its entry here as it's built.
// `roles` mirrors the backend's route middleware in routes/api.php — keep both in sync.
const CONTENT_ROLES: AdminRole[] = ['super_admin', 'admin', 'editor'];
// Editor has no access to recruitment data; HR manages it alongside super_admin/admin.
const RECRUITMENT_ROLES: AdminRole[] = ['super_admin', 'admin', 'hr'];

export const adminNavItems: AdminNavItem[] = [
  { label: 'Dashboard', to: '/admin', icon: LayoutDashboard },
  { label: 'Hero Slides', to: '/admin/hero-slides', icon: GalleryHorizontal, roles: CONTENT_ROLES },
  { label: 'Produk', to: '/admin/products', icon: Package, roles: CONTENT_ROLES },
  { label: 'Galeri', to: '/admin/gallery', icon: Images, roles: CONTENT_ROLES },
  { label: 'Portofolio', to: '/admin/portfolios', icon: FolderKanban, roles: CONTENT_ROLES },
  { label: 'Lowongan Kerja', to: '/admin/job-vacancies', icon: Briefcase, roles: RECRUITMENT_ROLES },
  { label: 'Pelamar Kerja', to: '/admin/career-applications', icon: Users, roles: RECRUITMENT_ROLES },
  { label: 'Manajemen User', to: '/admin/users', icon: UserCog, roles: ['super_admin'] },
  { label: 'Log Aktivitas', to: '/admin/audit-logs', icon: ScrollText, roles: ['super_admin'] },
];
