import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
    Box,
    Divider,
    Flex,
    HStack,
    Icon,
    IconButton,
    Stack,
    Text,
    Tooltip,
    useColorModeValue,
    Avatar,
    Menu,
    Link as ChakraLink,
    useBreakpointValue,
    Center,
} from "@chakra-ui/react";
import { LogOut, LucideTags } from "lucide-react";
import { Link, useNavigate, useMatch } from "react-router-dom";
import {
    ChevronLeft,
    ChevronRight,
    Menu as MenuIcon,
    FileText as LuFileText,
    FilePen as LuFilePen,
    FileVideo2 as LuFileVideo2,
    BriefcaseBusiness as LuBriefcaseBusiness,
    Briefcase as LuBriefcase,
    Users as LuUsers,
    WalletCards as LuWalletCards,
    Gift as LuGift,
    Building as LuBuilding,
} from "lucide-react";
import { LogoImage } from "../Logo";
import ToggleThemeButton from "../ToggleThemeButton";
import { useAuth } from "../../../providers/AuthProvider";

/**
 * Sidebar — sem props. Responsivo e minimizável.
 * - Decide os itens dinamicamente por "role" (candidate/company/admin) pegando de localStorage("gt.role") por padrão.
 * - Botão de minimizar/expandir AO LADO da logo.
 * - Desktop: aside fixo; Mobile: painel deslizante + botão flutuante.
 * - Navegação programática com `useNavigate()`; estado ativo via `useMatch()`.
 */

// ========= Tipos =========
export type Role = "CANDIDATE" | "COMPANY" | "ADMIN";
export type NavItem = {
    path: string;
    label: string;
    legend?: string;
    role?: Role;
    icon: React.ElementType;
    id?: string;
};

// ========= Fonte dos itens =========
const navItemsCandidate: NavItem[] = [
    { path: "/candidato/curriculo", label: "Meu Currículo", icon: LuFileText, legend: "Meu Currículo", role: "CANDIDATE", id: "tour-meu-curriculo" },
    { path: "/candidato/editar-curriculo", label: "Editar Currículo", icon: LuFilePen, legend: "Editar Currículo", role: "CANDIDATE", id: "tour-editar-curriculo" },
    { path: "/candidato/video-curriculo", label: "Vídeo Currículo", icon: LuFileVideo2, legend: "Vídeo Currículo", role: "CANDIDATE", id: "tour-video-curriculo" },
    { path: "/candidato/ver-vagas", label: "Ver Vagas", icon: LuBriefcaseBusiness, legend: "Ver Vagas", role: "CANDIDATE", id: "tour-ver-vagas" },
    { path: "/candidato/minhas-vagas", label: "Minhas Vagas", icon: LuBriefcase, legend: "Minhas Vagas", role: "CANDIDATE", id: "tour-minhas-vagas" },
];

const navItemsCompany: NavItem[] = [
    { path: "/processos-seletivos", label: "Processos", icon: LuBriefcaseBusiness, legend: "Processos Seletivos", role: "COMPANY" },
    { path: "/empresa/candidatos", label: "Candidatos", icon: LuUsers, legend: "Candidatos", role: "COMPANY" },
    { path: "/admin/beneficios", label: "Benefícios", icon: LuGift, legend: "Benefícios", role: "COMPANY" },
    { path: "/admin/cargos", label: "Cargos", icon: LuWalletCards, legend: "Cargos", role: "COMPANY" },
    { path: "/admin/tags", label: "Tags", icon: LucideTags, legend: "Tags", role: "COMPANY" },
    { path: "/empresa/processos-seletivos", label: "Processos Seletivos", icon: LuBriefcaseBusiness, legend: "Processos Seletivos", role: "COMPANY" }
];

const navItemsAdmin: NavItem[] = [
    { path: "/admin/empresas", label: "Empresas", icon: LuBuilding, legend: "Empresas", role: "ADMIN" },
    { path: "/admin/cargos", label: "Cargos", icon: LuWalletCards, legend: "Cargos", role: "ADMIN" },
    { path: "/admin/beneficios", label: "Benefícios", icon: LuGift, legend: "Benefícios", role: "ADMIN" },
];

function getItemsByRole(role: Role): NavItem[] {
    switch (role) {
        case "COMPANY":
            return navItemsCompany;
        case "ADMIN":
            return navItemsAdmin;
        case "CANDIDATE":
            return navItemsCandidate;
        default:
            return navItemsCandidate;
    }
}



// ========= Item =========
const roleColorMap: Record<Role, { base: string; rgba: string }> = {
    CANDIDATE: { base: "blue.500", rgba: "rgba(49, 130, 206, 0.12)" }, // blue.500 Chakra: #3182ce
    ADMIN: { base: "purple.500", rgba: "rgba(128, 90, 213, 0.12)" }, // purple.500: #805ad5
    COMPANY: { base: "orange.500", rgba: "rgba(237, 137, 54, 0.12)" }, // orange.500: #ed8936
};

function SidebarItem({ item, collapsed }: { item: NavItem; collapsed: boolean }) {
    const navigate = useNavigate();
    const match = useMatch({ path: item.path.endsWith("/") ? item.path : item.path + "/*", end: false });
    const isActive = !!match;

    // Cor baseada no role do item
    const itemRole = item.role ?? "CANDIDATE";

    const roleColor = roleColorMap[itemRole].base;
    const roleBg = roleColorMap[itemRole].rgba;

    // Cor de fundo opacitada baseada na cor da role
    const activeBg = roleBg;
    const color = useColorModeValue("stone.700", "stone.100");

    const handleClick = () => {
        navigate(item.path);
    };

    const content = (
        <HStack
            as="button"
            type="button"
            onClick={handleClick}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleClick(); } }}
            aria-label={item.label}
            spacing={collapsed ? 0 : 3}
            px={collapsed ? 0 : 3}
            py={2.5}
            borderRadius="md"
            borderWidth={isActive ? "2px" : "1px"}
            borderColor={isActive ? roleColor : "transparent"}
            bg={isActive ? activeBg : undefined}
            transition="background 0.18s, border-color 0.18s"
            _hover={{ bg: activeBg }}
            cursor={"pointer"}
            w="full"
            alignItems="center"
            justifyContent={collapsed ? "center" : "flex-start"}
        >
            <Center rounded="sm" p={1}>
                <Icon fontSize={24} as={item.icon as any} CenterSize={5} color={isActive ? roleColor : color} mx={collapsed ? "auto" : 0} />
            </Center>
            {
                !collapsed && (
                    <Text as="span" noOfLines={1} flex="1" fontWeight={isActive ? 700 : 500} fontSize="sm" ml={2} color={isActive ? roleColor : undefined}>
                        {item.label}
                    </Text>
                )
            }
        </HStack >
    );

    if (collapsed) {
        return (
            <Tooltip hasArrow placement="right" label={item.legend ?? item.label} openDelay={300}>
                <Box>{content}</Box>
            </Tooltip>
        );
    }
    return content;
}

// ========= Sidebar =========
const COLLAPSED_PX = 72; // 72px
const EXPANDED_PX = 256; // 256px
const LS_COLLAPSE = "gt.sidebar.collapsed";

const MotionBox = motion(Box);

export default function Sidebar() {
    const { name, profile, logout } = useAuth();
    const navigate = useNavigate();

    // Usa o profile diretamente do contexto, com fallback para CANDIDATE
    // Usa o profile diretamente do contexto, com validação de segurança
    const role: Role = (profile && ["CANDIDATE", "COMPANY", "ADMIN"].includes(profile)) ? profile as Role : "CANDIDATE";
    const items = useMemo(() => getItemsByRole(role), [role]);
    const isDesktop = useBreakpointValue({ base: false, lg: true });

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const getUserDisplayName = () => {
        return name || "Usuário";
    };

    const getRoleDisplayName = (role: string | null) => {
        switch (role?.toUpperCase()) {
            case "CANDIDATE":
                return "CANDIDATO";
            case "COMPANY":
                return "EMPRESA";
            case "ADMIN":
                return "ADMINISTRADOR";
            default:
                return "USUÁRIO";
        }
    };

    const [collapsed, setCollapsed] = useState(false);
    useEffect(() => {
        const saved = localStorage.getItem(LS_COLLAPSE);
        if (saved != null) setCollapsed(saved === "1");
    }, []);
    useEffect(() => {
        localStorage.setItem(LS_COLLAPSE, collapsed ? "1" : "0");
    }, [collapsed]);

    const [mobileOpen, setMobileOpen] = useState(false);

    const MenuHeader = (
        <HStack h={14} px={3} borderBottomWidth="1px" borderColor="border" justify="space-between">
            <HStack spacing={2}>
                <LogoImage isIcon={collapsed} />
            </HStack>
            {/* Botão AO LADO da logo para minimizar/expandir */}
            <IconButton
                aria-label={collapsed ? "Expandir sidebar" : "Recolher sidebar"}
                size="sm"
                variant="solid"
                icon={collapsed ? <ChevronRight /> : <ChevronLeft />}
                onClick={() => setCollapsed((s) => !s)}
            />
        </HStack>
    );

    const MenuContent = (
        <Flex direction="column" h="100%" w="full">
            {MenuHeader}

            <Box flex="1" px={collapsed ? 1 : 2} py={3} overflowY="auto" w="full">
                <Stack spacing={1} w="full">
                    {items.map((it, idx) => (
                        <motion.div key={it.path} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.03 * idx, duration: 0.18 }}>
                            <SidebarItem item={it} collapsed={collapsed} />
                        </motion.div>
                    ))}
                </Stack>
            </Box>

            <Box px={collapsed ? 1 : 3} pb={3} mt="auto" w="full">
                <Divider mb={2} />
                <Flex align="center" mb={collapsed ? 2 : 3} px={collapsed ? 0 : 2} justify={collapsed ? "center" : "flex-start"}>
                    <Menu placement="top-start">
                        <ChakraLink as={Link} to="/candidato/perfil" fontSize="xs" color="brand.600" _dark={{ color: "brand.300" }} _hover={{ textDecoration: "underline" }} display="flex" alignItems="center" mt={0.5}>
                            <HStack spacing={collapsed ? 0 : 3}>
                                <Avatar size={collapsed ? "sm" : "md"} name={getUserDisplayName()} />
                                {!collapsed && (
                                    <Box textAlign="left">
                                        <Text fontWeight={600} fontSize="sm" noOfLines={1} maxW={36}>{getUserDisplayName()}</Text>
                                        <Text fontSize="xs" color="muted">{getRoleDisplayName(profile)}</Text>
                                    </Box>
                                )}
                            </HStack>
                        </ChakraLink>
                    </Menu>
                </Flex>
                <Flex align="center" flexDir={collapsed ? "column" : "row"} justify="center" px={collapsed ? 0 : 2} gap={2}>
                    <ToggleThemeButton variant="outline" />
                    <Tooltip hasArrow placement="right" label="Sair" openDelay={300}>
                        <IconButton aria-label="Sair" size="sm" variant="outline" icon={<LogOut size={18} />} onClick={handleLogout} />
                    </Tooltip>
                </Flex>
                <Text display={collapsed ? "none" : "block"} fontSize="xs" color="muted" px={2} textAlign="center" mt={2}>© 2024 Great Talents. Todos os direitos reservados.</Text>
            </Box>
        </Flex>
    );

    // ===== Desktop Aside (com animação de largura e boxShadow condicionado) =====
    const Aside = (
        <MotionBox
            as="aside"
            position="fixed"
            top={0}
            left={0}
            h="100vh"
            bg="surface"
            borderRightWidth="1px"
            borderColor="border"
            initial={false}
            animate={{ width: collapsed ? COLLAPSED_PX : EXPANDED_PX, boxShadow: collapsed ? "var(--chakra-shadows-none)" : "var(--chakra-shadows-lg)" }}
            transition={{ type: "spring", stiffness: 280, damping: 26 }}
            display={{ base: "none", lg: "block" }}
            zIndex={100}

        >
            {MenuContent}
        </MotionBox>
    );

    // ===== Mobile Nav =====
    const MobileBar = (
        <Box
            as="nav"
            bg="surface"
            borderRightWidth="1px"
            borderColor="border"
            w={EXPANDED_PX}
            position="fixed"
            insetY={0}
            left={mobileOpen ? 0 : -EXPANDED_PX}
            transition="left 0.2s cubic-bezier(.4,0,.2,1)"
            zIndex={200}
            boxShadow="lg"
            h="100vh"
            display={{ base: "block", lg: "none" }}
        >
            <HStack h={14} px={3} borderBottomWidth="1px" borderColor="border" justify="space-between">
                <LogoImage />
                <IconButton aria-label="Fechar menu" variant="ghost" onClick={() => setMobileOpen(false)} icon={<ChevronLeft />} />
            </HStack>
            <Box flex="1" px={2} py={3} overflowY="auto">
                <Stack spacing={1} w="full">
                    {items.map((it) => (<SidebarItem key={it.path} item={it} collapsed={false} />))}
                </Stack>
            </Box>
            <Box px={3} pb={3} mt="auto" w="full">
                <Divider mb={2} />
                <Flex align="center" mb={3} px={2} justify="flex-start">
                    <Menu placement="top-start">
                        <ChakraLink as={Link} to="/candidato/perfil" fontSize="xs" color="brand.600" _dark={{ color: "brand.300" }} _hover={{ textDecoration: "underline" }} display="flex" alignItems="center" mt={0.5}>
                            <HStack spacing={3}>
                                <Avatar size="md" name={getUserDisplayName()} />
                                <Box textAlign="left">
                                    <Text fontWeight={600} fontSize="sm" noOfLines={1} maxW={36}>{getUserDisplayName()}</Text>
                                    <Text fontSize="xs" color="muted">{getRoleDisplayName(profile)}</Text>
                                </Box>
                            </HStack>
                        </ChakraLink>
                    </Menu>
                </Flex>
                <Flex align="center" flexDir="row" justify="center" px={2} gap={2}>
                    <ToggleThemeButton label="Tema" variant="outline" />
                    <Tooltip hasArrow placement="right" label="Sair" openDelay={300}>
                        <Flex align="center" gap={2}>
                            <IconButton aria-label="Sair" size="sm" variant="outline" icon={<LogOut size={18} />} onClick={handleLogout} />
                            <Text fontSize="sm" color="muted">Sair</Text>
                        </Flex>
                    </Tooltip>
                </Flex>
                <Text fontSize="xs" color="muted" px={2} textAlign="center" mt={2}>v1.0 • Great Talents</Text>
            </Box>
        </Box>
    );

    return (
        <>
            {/* Botão flutuante para abrir no mobile */}
            <Box display={{ base: "block", lg: "none" }}>
                <IconButton
                    aria-label="Abrir menu"
                    position="fixed"
                    top={4}
                    left={4}
                    zIndex={250}
                    variant="solid"
                    display={mobileOpen ? "none" : "flex"}
                    colorScheme="brand"
                    icon={<MenuIcon />}
                    onClick={() => setMobileOpen(true)}
                    size="lg"
                    boxShadow="lg"
                />
            </Box>

            {isDesktop ? Aside : MobileBar}

            {/* Espaçador (empurra o conteúdo) no desktop */}
            <Box display={{ base: "none", lg: "block" }} w={`${collapsed ? COLLAPSED_PX : EXPANDED_PX}px`} flexShrink={0} />
        </>
    );
}
