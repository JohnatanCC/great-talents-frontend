import { Flex } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Layout from "@/Layout";
import Sidebar from "@/components/UI/Sidebar";

export const ProtectedRoute = () => {
    const location = useLocation();

    // Estado para evitar animação "travada" na primeira renderização
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        setIsAnimating(true); // Ativar animação após a montagem inicial
    }, []);

    // Se o usuário não estiver autenticado, redireciona para a página de login


    return (
        <AnimatePresence mode="wait">
            {isAnimating && (
                <Flex flexDir="row">
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
