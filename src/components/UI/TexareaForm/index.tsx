// components/Forms/TextareaForm.tsx
import { FormControl, FormHelperText, FormLabel, Textarea, type TextareaProps } from "@chakra-ui/react";
import React, { forwardRef } from "react";

type TextareaFormProps = TextareaProps & {
    label?: string;
    errorMessage?: string;
};

const TextareaForm = forwardRef<HTMLTextAreaElement, TextareaFormProps>(
    ({ label, errorMessage, ...textareaProps }, ref) => {
        return (
            <FormControl mb={4} isInvalid={!!errorMessage}>
                {label && <FormLabel m={0}>{label}</FormLabel>}
                <Textarea
                    ref={ref}
                    {...textareaProps}
                />
                {errorMessage && <FormHelperText color="red.500">{errorMessage}</FormHelperText>}
            </FormControl>
        );
    }
);

TextareaForm.displayName = "TextareaForm";
export default TextareaForm;
