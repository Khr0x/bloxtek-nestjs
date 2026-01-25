
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  roles: Array<{
    name: string;
    permissions: string[];
  }>;
}

export interface User {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}