import { isAdminRole } from "@/lib/auth";

export function canManageResource(userRole: string | null | undefined, ownerId: number, currentUserId: number): boolean {
	return isAdminRole(userRole) || ownerId === currentUserId;
}

export function canAccessAdmin(userRole: string | null | undefined): boolean {
	return isAdminRole(userRole);
}
