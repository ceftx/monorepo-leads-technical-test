export enum UserRole {
    ADMIN = "ADMIN",
    VENDEDOR = "VENDEDOR",
}

export function isValidUserRole(value: string): value is UserRole {
    return Object.values(UserRole).includes(value as UserRole);
}
