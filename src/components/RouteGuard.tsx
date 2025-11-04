import React from "react";
import { Navigate } from "react-router-dom";
import { Box, Spinner, Center, Alert, AlertIcon, AlertTitle, AlertDescription } from "@chakra-ui/react";
import { usePermissions } from "@/hooks/usePermissions";
import type { Role } from "@/hooks/usePermissions";

interface RouteGuardProps {
    children: React.ReactNode;
    requiredRoles?: Role[];
    requiredPermissions?: { resource: string; action: string }[];
    fallbackPath?: string;
}

export const RouteGuard: React.FC<RouteGuardProps> = ({
    children,
    requiredRoles,
    requiredPermissions,
    fallbackPath = "/"
}) => {
    const { permissions, isLoading, error, hasAnyRole, hasPermission } = usePermissions();

    // Mostra loading enquanto valida
    if (isLoading) {
        return (
            <Center h="100vh">
                <Box textAlign="center">
                    <Spinner size="xl" color="brand.500" />
                    <Box mt={4}>Validando permissões...</Box>
                </Box>
            </Center>
        );
    }

    // Mostra erro se houver problema na validação
    if (error || !permissions) {
        return (
            <Center h="100vh" p={8}>
                <Alert status="error" maxW="md" borderRadius="lg">
                    <AlertIcon />
                    <Box>
                        <AlertTitle>Acesso Negado!</AlertTitle>
                        <AlertDescription>
                            {error || "Não foi possível validar suas permissões. Faça login novamente."}
                        </AlertDescription>
                    </Box>
                </Alert>
            </Center>
        );
    }

    // Verifica permissões de role
    if (requiredRoles && !hasAnyRole(requiredRoles)) {
        console.warn(`Acesso negado. Role atual: ${permissions.role}, Roles necessários: ${requiredRoles.join(', ')}`);
        return <Navigate to={fallbackPath} replace />;
    }

    // Verifica permissões específicas
    if (requiredPermissions) {
        for (const perm of requiredPermissions) {
            if (!hasPermission(perm.resource, perm.action)) {
                console.warn(`Acesso negado. Permissão necessária: ${perm.resource}:${perm.action}`);
                return <Navigate to={fallbackPath} replace />;
            }
        }
    }

    return <>{children}</>;
};