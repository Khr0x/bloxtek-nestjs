import { RolesService } from "@/services";
import { Role } from "@/types";
import { useState } from "react";

export function useRoles() {

    const [roles, setRoles] = useState<Role[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);


    async function fetchRoles(): Promise<Role[]> {
        setIsLoading(true);
        setError(null);
        try {
            const data = await RolesService.findAll();
            setRoles(data);
            return data;
        } catch (err: any) {
            const message = err.response?.data?.message || 'Error fetching roles';
            setError(message);
            return [];
        } finally {
            setIsLoading(false);
        }
    }

    return {
        roles,
        isLoading,
        error,
        fetchRoles,
    };
}