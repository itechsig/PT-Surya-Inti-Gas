import { GalleryHorizontal, LayoutDashboard, Package, type LucideIcon } from 'lucide-react';
import { AdminRole } from '../../context';

export interface AdminNavItem {
  label: string;
  to: string;
  icon: LucideIcon;
  roles?: AdminRole[];
}

// Each CMS module (Products, Jobs, Gallery, ...) appends its entry here as it's built.
export const adminNavItems: AdminNavItem[] = [
  { label: 'Dashboard', to: '/admin', icon: LayoutDashboard },
  { label: 'Hero Slides', to: '/admin/hero-slides', icon: GalleryHorizontal },
  { label: 'Produk', to: '/admin/products', icon: Package },
];
