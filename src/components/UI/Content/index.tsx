import { Box, Card, CardBody } from "@chakra-ui/react";
import React from "react";

interface ContentProps {
    children: React.ReactNode; // Conteúdo dinâmico dentro do card
}

const Content: React.FC<ContentProps> = ({ children }) => {
    return (
        <Card position="relative" minH="80vh">
            {children}
        </Card>
    );
};

export default Content;
