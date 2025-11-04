// components/auth/RecoveryPassword.tsx
import { Button, Flex, Heading, Text, useToast } from "@chakra-ui/react";
import InputForm from "@/components/UI/InputForm";

import AuthService from "@/services/AuthService";
import { toastTemplate } from "@/templates/toast";
import { motion } from "framer-motion";
import { useForm, type SubmitHandler } from "react-hook-form";

type ValuesFormRecoveryPassword = { email: string };
interface RecoveryPasswordProps { onBack: () => void; }

const MotionFlex = motion(Flex);

export const RecoveryPassword: React.FC<RecoveryPasswordProps> = ({ onBack }) => {
    const toast = useToast();
    const { register, handleSubmit } = useForm<ValuesFormRecoveryPassword>({ defaultValues: { email: "" } });

    const onSubmit: SubmitHandler<ValuesFormRecoveryPassword> = async ({ email }) => {
        try {
            await AuthService.recoveryPassword(email);
            toast(toastTemplate({ description: "Email enviado com sucesso", status: "success" }));
            onBack();
        } catch {
            toast(toastTemplate({ description: "Falha ao tentar recuperar senha", status: "error" }));
        }
    };

    return (
        <MotionFlex
            key="recovery"
            direction="column"
            align="center"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            as="form"
            onSubmit={handleSubmit(onSubmit)}
            w="full"
        >
            <Heading mb={6} size="lg" textAlign="center">Redefinir senha</Heading>

            <Flex maxW="320px" w="full" direction="column" gap={3}>
                <InputForm
                    {...register("email", { required: true })}
                    label="Para recuperar sua senha digite seu email:"
                    placeholder="Insira seu email de usuário"
                    required
                />
                <Button type="submit" width="full" colorScheme="brand">Enviar</Button>
                <Button onClick={onBack} variant="link" colorScheme="brand">
                    <Text mt={2}>Voltar ao login</Text>
                </Button>
            </Flex>
        </MotionFlex>
    );
};
