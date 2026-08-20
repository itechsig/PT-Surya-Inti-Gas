export interface Permission {
  id: number;
  slug: string;
  name: string;
  group: string;
}

export interface AdminRoleRecord {
  id: number;
  slug: string;
  name: string;
  is_system: boolean;
  users_count: number;
  permissions: Permission[];
  created_at: string;
  updated_at: string;
}

export interface RoleFormValues {
  name: string;
  permissionIds: number[];
}
