import { Box, Card, CardBody } from "@chakra-ui/react";
import React from "react";

interface ContentProps {
    children: React.ReactNode; // Conteúdo dinâmico dentro do card
}

const Content: React.FC<ContentProps> = ({ children }) => {
    return (
        <Card position="relative" minH="80vh">
            <Box
                position="absolute"
                top={0}
                left={0}
                width="120px"
                height="120px"
                background="linear-gradient(135deg, rgba(255, 156, 43, 0.3) , rgba(255, 255, 255, 0), transparent)"
                borderRadius="8px 0 60px 8px"
                pointerEvents="none"
            />
            <Box
                position="absolute"
                bottom={0}
                right={0}
                width="120px"
                height="120px"
                background="linear-gradient(135deg,  transparent, rgba(255, 255, 255, 0),rgba(255, 156, 43, 0.3) )"
                borderRadius="60px 8px 8px 0"
                pointerEvents="none"
            />
            {children}
        </Card>
    );
};

export default Content;
