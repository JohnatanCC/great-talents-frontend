import { useAuth } from "@/providers/AuthProvider";
import { useEffect, useState } from "react";
import api from "@/services/api";

export type Role = "CANDIDATE" | "COMPANY" | "ADMIN";

interface Permission {
    resource: string;
    action: string;
}

interface UserPermissions {
    role: Role;
    permissions: Permission[];
}

export const usePermissions = () => {
    const { token, profile } = useAuth();
    const [permissions, setPermissions] = useState<UserPermissions | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!token) {
            setPermissions(null);
            setIsLoading(false);
            return;
        }

        validateTokenAndGetPermissions();
    }, [token, profile]);

    const validateTokenAndGetPermissions = async () => {
        try {
            setIsLoading(true);
            setError(null);

            // Validar token no backend
            const response = await api.get('/auth/validate-token');

            if (response.data.valid) {
                setPermissions({
                    role: response.data.user.role as Role,
                    permissions: response.data.user.permissions || []
                });
            } else {
                throw new Error('Token inválido');
            }
        } catch (err) {
            console.error('Erro ao validar permissões:', err);
            setError('Erro ao validar permissões');
            setPermissions(null);
        } finally {
            setIsLoading(false);
        }
    };

    const hasPermission = (resource: string, action: string): boolean => {
        if (!permissions) return false;

        return permissions.permissions.some(
            p => p.resource === resource && p.action === action
        );
    };

    const hasRole = (requiredRole: Role): boolean => {
        return permissions?.role === requiredRole;
    };

    const hasAnyRole = (requiredRoles: Role[]): boolean => {
        return permissions ? requiredRoles.includes(permissions.role) : false;
    };

    return {
        permissions,
        isLoading,
        error,
        hasPermission,
        hasRole,
        hasAnyRole,
        validateToken: validateTokenAndGetPermissions
    };
};