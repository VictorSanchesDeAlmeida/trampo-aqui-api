export enum UserRole {
  ADMIN = 1,  // ID 1 no banco
  USER = 2,   // ID 2 no banco  
  COMPANY = 3 // ID 3 no banco
}

export const ROLE_NAMES = {
  [UserRole.ADMIN]: 'Admin',
  [UserRole.USER]: 'User', 
  [UserRole.COMPANY]: 'Company'
} as const;