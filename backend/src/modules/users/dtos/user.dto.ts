
export class UserDto {
    id: string;
    name: string;
    email: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export class UserRolesDto {
    id: string;
    name: string;
    permissions: string[];
}
export class UserFullDto extends UserDto {
    roles: UserRolesDto[];
    password: string;
}
