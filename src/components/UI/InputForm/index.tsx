// components/Forms/InputForm.tsx
import React, { forwardRef, type ReactNode } from "react";
import {
    FormControl,
    FormHelperText,
    FormLabel,
    Input,
    InputGroup,
    InputLeftElement,
    type InputProps,
} from "@chakra-ui/react";
import { motion } from "framer-motion";

interface InputFormProps extends InputProps {
    label?: string;
    errorMessage?: string;
    required?: boolean;
    icon?: ReactNode;
}

const InputForm = forwardRef<HTMLInputElement, InputFormProps>(
    ({ label, errorMessage, required, icon, ...inputProps }, ref) => {
        const hasIcon = !!icon;

        return (
            <FormControl isRequired={required} isInvalid={!!errorMessage} mb={4}>
                {label && <FormLabel m={0}>{label}</FormLabel>}

                <InputGroup>
                    {hasIcon && (
                        <InputLeftElement pointerEvents="none" color="muted">
                            {icon}
                        </InputLeftElement>
                    )}
                    <Input
                        ref={ref}
                        pl={hasIcon ? 10 : undefined}
                        {...inputProps}
                    />
                </InputGroup>

                {errorMessage && (
                    <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.18 }}
                    >
                        <FormHelperText color="red.500">{errorMessage}</FormHelperText>
                    </motion.div>
                )}
            </FormControl>
        );
    }
);

InputForm.displayName = "InputForm";
export default InputForm;
