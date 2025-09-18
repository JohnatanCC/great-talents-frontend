import { useRef } from "react"
import { Box, FormControl, FormErrorMessage, FormLabel } from "@chakra-ui/react"
import ReCAPTCHA from "react-google-recaptcha"


/**
 * ReCaptchaField
 * Wrapper do Google reCAPTCHA v2 (checkbox) pronto para integrar com RHF.
 * - Usa ref para ler o token
 * - Chama onVerify(token) ao validar
 * - Chama onExpired() quando expira
 */
export default function ReCaptchaField({
    siteKey,
    label = "Verificação de segurança",
    error,
    onVerify,
    onExpired,
}: {
    siteKey: string
    label?: string
    error?: string
    onVerify?: (token: string | null) => void
    onExpired?: () => void
}) {
    const recaptchaRef = useRef<ReCAPTCHA | null>(null)

    return (
        <FormControl w="full" isInvalid={!!error}>
            <FormLabel>{label}
                <ReCAPTCHA
                    ref={recaptchaRef}
                    sitekey={siteKey}
                    onChange={(token: string | null) => onVerify?.(token)}
                    onExpired={onExpired}
                    theme="light"
                />
            </FormLabel>
            <FormErrorMessage>{error}</FormErrorMessage>
        </FormControl>
    )
}