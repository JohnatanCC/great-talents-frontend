import React, { useCallback, useEffect, useRef, useState } from "react"
import {
    Box,
    Button,
    Center,
    Flex,
    HStack,
    Icon,
    IconButton,
    Image,
    Input,
    Progress,
    Text,
    Tooltip,
    useColorModeValue,
    useToast,
    VisuallyHidden,
} from "@chakra-ui/react"
import { AddIcon, EditIcon, RepeatIcon, CloseIcon } from "@chakra-ui/icons"

/**
 * AvatarUploader.tsx — Great Talents (Chakra UI v2)
 *
 * Componente acessível e robusto para upload de foto de perfil com:
 *  - clique, teclado (Enter/Espaço) e drag&drop
 *  - validações de tipo e tamanho
 *  - preview imediato com ObjectURL e limpeza para evitar leaks
 *  - overlay de ação, barra de progresso e toasts
 *  - API flexível: onFileSelected e onUpload (async) retornando URL
 */

export type AvatarUploaderProps = {
    /** URL inicial da foto (ex.: do backend) */
    initialUrl?: string
    /** Disparado ao selecionar um arquivo válido, antes do upload */
    onFileSelected?: (file: File) => void
    /** Função opcional de upload. Deve retornar a URL final da imagem. */
    onUpload?: (file: File, abortSignal?: AbortSignal) => Promise<string>
    /** Tamanho (px) do avatar circular */
    size?: number
    /** Tipos aceitos */
    accept?: string
    /** Tamanho máximo (MB) */
    maxSizeMB?: number
    /** Rótulo acessível */
    ariaLabel?: string
}

export default function AvatarUploader({
    initialUrl,
    onFileSelected,
    onUpload,
    size = 128,
    accept = "image/png,image/jpeg,image/jpg",
    maxSizeMB = 5,
    ariaLabel = "Enviar foto de perfil",
}: AvatarUploaderProps) {
    const inputRef = useRef<HTMLInputElement | null>(null)
    const toast = useToast()
    const [preview, setPreview] = useState<string | undefined>(initialUrl)
    const [objectUrl, setObjectUrl] = useState<string | undefined>()
    const [isDragging, setDragging] = useState(false)
    const [isUploading, setUploading] = useState(false)
    const [progress, setProgress] = useState(0)
    const abortRef = useRef<AbortController | null>(null)

    const border = useColorModeValue("gray.200", "whiteAlpha.300")
    const bg = useColorModeValue("white", "gray.800")
    const overlayBg = useColorModeValue("blackAlpha.400", "blackAlpha.600")

    // Cleanup: revoke ObjectURL
    useEffect(() => {
        return () => {
            if (objectUrl) URL.revokeObjectURL(objectUrl)
            if (abortRef.current) abortRef.current.abort()
        }
    }, [objectUrl])

    const openFileDialog = () => inputRef.current?.click()

    const validateFile = (file: File) => {
        const okType = accept.split(",").some((t) => file.type === t.trim())
        if (!okType) throw new Error("Formato inválido. Use PNG ou JPEG.")
        const maxBytes = maxSizeMB * 1024 * 1024
        if (file.size > maxBytes) throw new Error(`Arquivo muito grande. Máximo ${maxSizeMB}MB.`)
    }

    const createPreview = (file: File) => {
        // Revoke anterior
        if (objectUrl) URL.revokeObjectURL(objectUrl)
        const url = URL.createObjectURL(file)
        setObjectUrl(url)
        setPreview(url)
    }

    const handleFile = async (file: File) => {
        try {
            validateFile(file)
            onFileSelected?.(file)
            createPreview(file)

            if (onUpload) {
                setUploading(true)
                setProgress(10)
                abortRef.current = new AbortController()

                // Simulação de progresso suave durante o upload
                const tick = setInterval(() => setProgress((p) => Math.min(p + 8, 90)), 120)
                try {
                    const url = await onUpload(file, abortRef.current.signal)
                    clearInterval(tick)
                    setProgress(100)
                    setUploading(false)
                    setTimeout(() => setProgress(0), 400)
                    setPreview(url || objectUrl)
                    toast({ title: "Foto atualizada", status: "success" })
                } catch (err: any) {
                    clearInterval(tick)
                    setUploading(false)
                    setProgress(0)
                    toast({
                        title: "Falha ao enviar",
                        description: err?.message || "Tente novamente mais tarde.",
                        status: "error",
                    })
                }
            }
        } catch (err: any) {
            toast({ title: "Arquivo inválido", description: err?.message, status: "error" })
        }
    }

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0]
        if (f) void handleFile(f)
    }

    // Drag & drop
    const onDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setDragging(false)
        const f = e.dataTransfer.files?.[0]
        if (f) void handleFile(f)
    }

    const onKeyUp = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" || e.key === " ") openFileDialog()
    }

    const removePhoto = () => {
        if (objectUrl) URL.revokeObjectURL(objectUrl)
        setObjectUrl(undefined)
        setPreview(undefined)
    }

    return (
        <Box>
            <Input ref={inputRef} type="file" accept={accept} display="none" onChange={onChange} />

            <Box
                role="button"
                aria-label={ariaLabel}
                tabIndex={0}
                onKeyUp={onKeyUp}
                onClick={openFileDialog}
                onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
                onDragLeave={() => setDragging(false)}
                onDrop={onDrop}
                position="relative"
                w={`${size}px`}
                h={`${size}px`}
                rounded="full"
                overflow="hidden"
                borderWidth="1px"
                borderColor={isDragging ? "brand.400" : border}
                bg={bg}
                transition="all .18s ease"
                outline="none"
                _focusVisible={{ boxShadow: "0 0 0 2px var(--chakra-colors-ring)" }}
            >
                {/* imagem */}
                {preview ? (
                    <Image src={preview} alt="Foto do perfil" w="100%" h="100%" objectFit="cover" />
                ) : (
                    <Center w="full" h="full" fontSize="xs" color="gray.500" px={3} textAlign="center">
                        Clique ou solte a imagem aqui
                    </Center>
                )}

                {/* overlay de ação */}
                <Flex
                    position="absolute"
                    inset={0}
                    align="center"
                    justify="center"
                    bg={isDragging ? overlayBg : "transparent"}
                    opacity={isDragging ? 1 : 0}
                    transition="opacity .18s ease"
                >
                    <HStack spacing={2} color="white">
                        <Icon as={AddIcon} />
                        <Text>Adicionar</Text>
                    </HStack>
                </Flex>

                {/* progresso de upload */}
                {isUploading && (
                    <Box position="absolute" bottom={0} left={0} right={0}>
                        <Progress size="xs" value={progress} colorScheme="orange" borderRadius={0} />
                    </Box>
                )}
            </Box>

            {/* ações secundárias */}
            <HStack align="center" justifyContent="center" spacing={2} mt={3}>
                <Tooltip label="Alterar foto">
                    <IconButton colorScheme="blue" aria-label="Alterar foto" icon={<EditIcon />} size="sm" onClick={openFileDialog} variant="outline" />
                </Tooltip>
                <Tooltip label="Remover">
                    <IconButton colorScheme="red" aria-label="Remover foto" icon={<CloseIcon />} size="sm" onClick={removePhoto} variant="ghost" />
                </Tooltip>
            </HStack>

            <VisuallyHidden>
                <Text>Tipos aceitos: {accept}. Tamanho máximo: {maxSizeMB}MB.</Text>
            </VisuallyHidden>
        </Box>
    )
}
