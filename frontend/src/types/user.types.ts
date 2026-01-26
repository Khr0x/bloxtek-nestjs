
export interface CreateUser {
  name: string;
  email: string;
  password: string;
  roleNames?: string[];
}

export interface UpdateUser {
  name?: string;
  email?: string;
  isActive?: boolean;
  roleNames?: string[];
}

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
  roles?: Array<{
    name: string;
    permissions?: string[];
  }>;
  createdAt?: string;
  updatedAt?: string;
}
