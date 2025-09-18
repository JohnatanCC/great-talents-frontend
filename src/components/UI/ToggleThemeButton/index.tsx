import { IconButton, useColorMode, HStack, Text } from "@chakra-ui/react";
import { Moon, Sun } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ToggleThemeButton(props: {
    size?: string;
    variant?: string;
    label?: string;
}) {
    const { colorMode, toggleColorMode } = useColorMode();

    return (
        <AnimatePresence initial={false} mode="wait">
            <motion.div
                key={colorMode}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                style={{ display: "inline-block" }}
            >
                <HStack spacing={2}>
                    <IconButton
                        aria-label="Trocar tema"
                        size={props.size || "sm"}
                        variant={props.variant || "ghost"}
                        icon={colorMode === "dark" ? <Sun size={18} /> : <Moon size={18} />}
                        onClick={toggleColorMode}
                    />
                    {props.label && <Text color="muted" fontSize="sm">{props.label}</Text>}
                </HStack>
            </motion.div>
        </AnimatePresence>
    );
}
