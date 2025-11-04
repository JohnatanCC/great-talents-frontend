import { Box, Flex } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Layout from "@/Layout";
import Sidebar from "@/components/UI/Sidebar";
import { useAuth } from "@/providers/AuthProvider";

export const ProtectedRoute = () => {
    const location = useLocation();
    const { token } = useAuth();
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        setIsAnimating(true); // Ativar animação após a montagem inicial
    }, []);

    // Se o usuário não estiver autenticado, redireciona para a página de login
    if (!token) {
        return <Navigate to="/" />;
    }

    return (
        <AnimatePresence mode="wait">
            {isAnimating && (
                <Flex flexDir="row" position="relative">
                    <Box
                        position="fixed"
                        inset={0}
                        height="100vh"
                        w="full"
                        sx={{
                            background:
                                `radial-gradient(60rem 60rem at 10% 20%, rgba(237, 109, 58, 0.10), transparent 50%),
               radial-gradient(40rem 40rem at 70% 30%, rgba(145, 88, 22, 0.10), transparent 55%),
               radial-gradient(50rem 50rem at 40% 80%, rgba(53, 16, 185, 0.10), transparent 55%),
               linear-gradient(120deg, rgba(99, 120, 241, 0.10), rgba(236, 138, 72, 0.10))` as any,
                        }}
                    />
                    <Sidebar />
                    <Flex w="full" flexDir="column">

                        <Layout>
                            <motion.div
                                key={location.pathname}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.4, ease: "easeInOut" }}
                            >
                                <Outlet />  {/* Aqui é onde as rotas protegidas são renderizadas */}
                            </motion.div>
                        </Layout>

                    </Flex>
                </Flex>
            )}
        </AnimatePresence>
    );
};
