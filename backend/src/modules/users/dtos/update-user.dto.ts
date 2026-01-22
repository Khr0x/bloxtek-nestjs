import { IsString, IsEmail, IsOptional, IsBoolean, MinLength, IsArray } from 'class-validator';

export class UpdateUserDto {
    @IsString()
    @IsOptional()
    name?: string;

    @IsEmail({}, { message: 'El correo debe tener un formato válido' })
    @IsOptional()
    email?: string;

    @IsBoolean()
    @IsOptional()
    isActive?: boolean;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    roleNames?: string[];
}