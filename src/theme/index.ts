// src/theme/index.ts
import { background, extendTheme, type ThemeConfig } from "@chakra-ui/react";

const config: ThemeConfig = {
    initialColorMode: "light",
    useSystemColorMode: false,
};

// === Paletas ===
// Neutros do Tailwind "stone"
const colors = {
    stone: {
        50: "#FAFAF9",
        100: "#F5F5F4",
        200: "#E7E5E4",
        300: "#D6D3D1",
        400: "#A6A09B",
        500: "#79716B",
        600: "#57534D",
        700: "#44403B",
        800: "#292524",
        900: "#1C1917",
        950: "#0C0A09",
    },
    brand: {
        50: '#FFF8F1', 100: '#FEECDC', 200: '#FCD9B6', 300: '#FDBA74', 400: '#FB923C',
        500: '#F97316', 600: '#EA580C', 700: '#C2410C', 800: '#9A3412', 900: '#7C2D12',
    },
    secondary: {
        50: '#F0F7FF', 100: '#DBEAFE', 200: '#BFDBFE', 300: '#93C5FD', 400: '#60A5FA',
        500: '#3B82F6', 600: '#2563EB', 700: '#1D4ED8', 800: '#1E40AF', 900: '#1E3A8A',
    },
    success: {
        50: '#F0FDF4', 100: '#DCFCE7', 200: '#BBF7D0', 300: '#86EFAC', 400: '#4ADE80',
        500: '#22C55E', 600: '#16A34A', 700: '#15803D', 800: '#166534', 900: '#14532D',
    },
    danger: {
        50: '#FEF2F2', 100: '#FEE2E2', 200: '#FECACA', 300: '#FCA5A5', 400: '#F87171',
        500: '#EF4444', 600: '#DC2626', 700: '#B91C1C', 800: '#991B1B', 900: '#7F1D1D',
    },

    gray: {
        50: '#FAFAFA', 100: '#F5F5F5', 200: '#EEEEEE', 300: '#E0E0E0', 400: '#BDBDBD',
        500: '#9E9E9E', 600: '#757575', 700: '#616161', 800: '#424242', 900: '#212121',
    },

    brandAlpha: {
        50: 'rgba(249, 115, 22, 0.04)',
        100: 'rgba(249, 115, 22, 0.06)',
        200: 'rgba(249, 115, 22, 0.08)',
        300: 'rgba(249, 115, 22, 0.16)',
        400: 'rgba(249, 115, 22, 0.24)',
        500: 'rgba(249, 115, 22, 0.36)',
        600: 'rgba(249, 115, 22, 0.48)',
        700: 'rgba(249, 115, 22, 0.64)',
        800: 'rgba(249, 115, 22, 0.80)',
        900: 'rgba(249, 115, 22, 0.92)',
    },
    secondaryAlpha: {
        50: 'rgba(59, 130, 246, 0.04)',
        100: 'rgba(59, 130, 246, 0.06)',
        200: 'rgba(59, 130, 246, 0.08)',
        300: 'rgba(59, 130, 246, 0.16)',
        400: 'rgba(59, 130, 246, 0.24)',
        500: 'rgba(59, 130, 246, 0.36)',
        600: 'rgba(59, 130, 246, 0.48)',
        700: 'rgba(59, 130, 246, 0.64)',
        800: 'rgba(59, 130, 246, 0.80)',
        900: 'rgba(59, 130, 246, 0.92)',
    },
};

// === Tokens semânticos ===
const semanticTokens = {
    colors: {
        // superfícies e tipografia (neutros)
        bg: { default: "stone.100", _dark: "stone.950" },
        surface: { default: "white", _dark: "stone.900" },
        surfaceSubtle: { default: "stone.100", _dark: "stone.800" },
        border: { default: "stone.300", _dark: "stone.700" },
        text: { default: "stone.800", _dark: "stone.100" },
        muted: { default: "stone.600", _dark: "stone.300" },
        ring: { default: "stone.300", _dark: "stone.600" },

        // acentos
        primary: { default: "brand.600", _dark: "brand.300" },
        onPrimary: { default: "stone.50", _dark: "stone.900" },
        secondary: { default: "secondary.600", _dark: "secondary.300" },
        onSecondary: { default: "stone.50", _dark: "stone.900" },

        // botões padrão
        buttonBg: { default: "primary", _dark: "primary" },
        buttonText: { default: "onPrimary", _dark: "onPrimary" },

        black: { default: "stone.800" },
        white: { default: "stone.50" },
    },
};

const fonts = {
    heading: "'Inter', 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif",
    body: "'Inter', 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif",
    mono: "'Fira Mono', 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', monospace",
};

// Ring sutil reutilizável
const focusRing = "0 0 0 2px var(--chakra-colors-ring)";
const focusRingSubtle = "0 0 0 2px var(--chakra-colors-stone-200)";

const styles = {
    global: () => ({
        html: { backgroundColor: "bg", minHeight: "100%" },
        body: {
            backgroundColor: "bg",
            color: "text",
            fontFamily: "body",
            minHeight: "100vh",
            WebkitFontSmoothing: "antialiased",
            MozOsxFontSmoothing: "grayscale",
            transition: "background 0.2s, color 0.2s",
        },
        "*, *::before, *::after": { boxSizing: "border-box" },
        "::selection": { background: "primary", color: "onPrimary" },
        a: {
            color: "brand.600",
            _dark: { color: "brand.300" },
            textDecoration: "none",
            transition: "color 0.2s",
            _hover: { textDecoration: "underline", color: "brand.700", _dark: { color: "brand.300" } },
        },
        ":focus": { outline: "none" },
        ":focus-visible": { outline: "none", boxShadow: focusRing, borderRadius: "8px" },
        "::-webkit-scrollbar": { width: "8px", background: "stone.100" },
        "::-webkit-scrollbar-thumb": { background: "stone.300", borderRadius: "8px" },
        "::-webkit-scrollbar-thumb:hover": { background: "stone.400" },
    }),
};

const radii = { sm: "6px", md: "8px", lg: "12px", xl: "16px", "2xl": "18px", full: "9999px" };

// === Componentes ===
const components = {
    Input: {
        variants: {
            outline: {
                field: {
                    borderRadius: "md",
                    bg: "surfaceSubtle",
                    borderColor: "ring",
                    _placeholder: { color: "muted" },
                    _hover: { borderColor: "brand.300", _dark: { borderColor: "stone.400" } },
                    _focus: { boxShadow: "none" },
                    _focusVisible: { borderColor: "brand.400", boxShadow: focusRing },
                    transition: "all 0.18s cubic-bezier(.4,0,.2,1)",
                },
            },
            filled: {
                field: {
                    borderRadius: "md",
                    bg: "surfaceSubtle",
                    borderColor: "ring",
                    _focus: { boxShadow: "none" },
                    _focusVisible: { borderColor: "brand.400", boxShadow: focusRingSubtle },
                    transition: "all 0.18s cubic-bezier(.4,0,.2,1)",
                },
            },
            unstyled: {
                field: {
                    bg: "transparent",
                    border: "none",
                    borderRadius: 0,
                    p: 0,
                    m: 0,
                    boxShadow: "none",
                    _focus: { boxShadow: "none" },
                    _focusVisible: { boxShadow: "none" },
                },
            },
        },
        defaultProps: { variant: "outline", focusBorderColor: "brand.400", errorBorderColor: "danger.400" },
    },
    Textarea: {
        variants: {
            outline: {
                borderRadius: "md",
                bg: "surfaceSubtle",
                borderColor: "ring",
                _focus: { boxShadow: "none" },
                _focusVisible: { borderColor: "brand.400", boxShadow: focusRingSubtle },
                transition: "all 0.18s cubic-bezier(.4,0,.2,1)",
            },
            filled: {
                borderRadius: "md",
                bg: "surfaceSubtle",
                borderColor: "ring",
                _focus: { boxShadow: "none" },
                _focusVisible: { borderColor: "brand.400", boxShadow: focusRingSubtle },
                transition: "all 0.18s cubic-bezier(.4,0,.2,1)",
            },
            unstyled: {
                bg: "transparent",
                border: "none",
                borderRadius: 0,
                p: 0,
                m: 0,
                boxShadow: "none",
                _focus: { boxShadow: "none" },
                _focusVisible: { boxShadow: "none" },
            },
        },
        defaultProps: { variant: "outline", focusBorderColor: "brand.400", errorBorderColor: "danger.400" },
    },

    Divider: {
        baseStyle: {
            borderColor: "ring",
            my: 4,
        },
    },

    Checkbox: {
        baseStyle: {
            control: {
                borderRadius: "md",
                borderColor: "border",
                _focus: { boxShadow: "none" },
                _focusVisible: { boxShadow: focusRingSubtle },
                _checked: {
                    bg: "brand.600",
                    borderColor: "brand.600",
                    _dark: { bg: "brand.300", borderColor: "brand.300" },
                },
                transition: "all 0.18s cubic-bezier(.4,0,.2,1)",
            },
        },
        variants: {
            unstyled: {
                control: {
                    border: "none",
                    bg: "transparent",
                    p: 0,
                    m: 0,
                    boxShadow: "none",
                    _focus: { boxShadow: "none" },
                    _focusVisible: { boxShadow: "none" },
                    _checked: { boxShadow: "none" },
                },
            },
        },
    },

    Radio: {
        baseStyle: {
            control: {
                borderColor: "border",
                _focus: { boxShadow: "none" },
                _focusVisible: { boxShadow: focusRingSubtle },
                _checked: {
                    bg: "white",
                    borderColor: "brand.600",
                    _before: {
                        content: '""',
                        display: "inline-block",
                        pos: "relative",
                        w: "50%",
                        h: "50%",
                        borderRadius: "50%",
                        bg: "brand.500"
                    },
                    _dark: {
                        bg: "stone.900",
                        borderColor: "brand.400",
                        _before: { bg: "brand.400" }
                    },
                },
                transition: "all 0.18s cubic-bezier(.4,0,.2,1)",
            },
        },
        variants: {
            unstyled: {
                control: {
                    border: "none",
                    bg: "transparent",
                    p: 0,
                    m: 0,
                    boxShadow: "none",
                    _focus: { boxShadow: "none" },
                    _focusVisible: { boxShadow: "none" },
                    _checked: { boxShadow: "none" },
                },
            },
        },
    },

    Tabs: {
        variants: {
            line: {
                tab: {
                    _focus: { boxShadow: "none" },
                    _focusVisible: { boxShadow: focusRingSubtle },
                    fontWeight: 500,
                    borderRadius: "md",
                    transition: "all 0.18s cubic-bezier(.4,0,.2,1)",
                    flexShrink: 1,
                    minWidth: 0,
                },
                tablist: {
                    borderColor: "border",
                    flexWrap: "wrap",
                    gap: 1,
                },
                tabpanel: { px: 0 },
            },
            enclosed: {
                tab: {
                    borderTopRadius: "md",
                    _focus: { boxShadow: "none" },
                    _focusVisible: { boxShadow: focusRingSubtle, },
                    _selected: { background: "brandAlpha.300", borderColor: "brand.500", color: "brand.600", },
                    fontWeight: 500,
                    borderColor: "border",
                    transition: "all 0.18s cubic-bezier(.4,0,.2,1)",
                    flexShrink: 1,
                    minWidth: 0,
                },
                tablist: {
                    flexWrap: "wrap",
                    gap: 1,
                },
                tabpanel: { px: 0 },
            },
            unstyled: {
                tab: {
                    border: "none",
                    bg: "transparent",
                    p: 0,
                    m: 0,
                    boxShadow: "none",
                    _focus: { boxShadow: "none" },
                    _focusVisible: { boxShadow: "none" },
                },
                tablist: {
                    border: "none",
                    flexWrap: "wrap",
                },
                tabpanel: {
                    p: 0,
                },
            },
        },
    },

    Link: {
        baseStyle: {
            color: "brand.700",
            _dark: { color: "brand.300" },
            _hover: { textDecoration: "underline", color: "brand.800", _dark: { color: "brand.100" } },
            _focus: { boxShadow: "none" },
            _focusVisible: { boxShadow: focusRingSubtle, borderRadius: "6px" },
            fontWeight: 500,
            transition: "color 0.18s cubic-bezier(.4,0,.2,1)",
        },
        variants: {
            unstyled: {
                color: "inherit",
                fontWeight: "inherit",
                textDecoration: "none",
                p: 0,
                m: 0,
                _hover: { textDecoration: "none", color: "inherit" },
                _focus: { boxShadow: "none" },
                _focusVisible: { boxShadow: "none" },
            },
        },
    },

    Menu: {
        baseStyle: {
            list: {
                bg: "surface",
                borderColor: "border",
                borderWidth: "1px",
                borderRadius: "md",
                boxShadow: "lg",
                py: 1,
                px: 1,
            },
            item: {
                bg: "transparent",
                color: "text",
                borderRadius: "sm",
                px: 3,
                py: 2,
                borderWidth: "1px",
                borderColor: "transparent",
                fontWeight: 500,
                _hover: {
                    bg: "surfaceSubtle",
                    borderColor: "ring",

                },
                _focus: {
                    bg: "surfaceSubtle",
                    color: "text",
                    boxShadow: "none",
                },
                _focusVisible: {
                    bg: "surfaceSubtle",
                    boxShadow: focusRingSubtle,
                },
                transition: "all 0.18s cubic-bezier(.4,0,.2,1)",
            },
            button: {
                color: "text",
                _hover: {
                    bg: "surfaceSubtle",
                },
                _focus: {
                    boxShadow: "none",
                },
                _focusVisible: {
                    boxShadow: focusRingSubtle,
                },
                transition: "all 0.18s cubic-bezier(.4,0,.2,1)",
            },
            divider: {
                borderColor: "border",
                my: 1,
                mx: 1,
            },
        },
        variants: {
            unstyled: {
                list: {
                    border: "none",
                    bg: "transparent",
                    boxShadow: "none",
                    p: 0,
                },
                item: {
                    bg: "transparent",
                    color: "inherit",
                    p: 0,
                    m: 0,
                    _hover: { bg: "transparent" },
                    _focus: { boxShadow: "none", bg: "transparent" },
                    _focusVisible: { boxShadow: "none" },
                },
                button: {
                    bg: "transparent",
                    _hover: { bg: "transparent" },
                    _focus: { boxShadow: "none" },
                    _focusVisible: { boxShadow: "none" },
                },
                divider: {
                    border: "none",
                },
            },
        },
    },

    Card: {
        baseStyle: {
            container: {
                borderRadius: "lg",
                bg: "surface",
                borderWidth: "1px",
                borderColor: "border",

                transition: "all ease 0.5s",
            },
        },
        variants: {
            unstyled: {
                container: {
                    bg: "transparent",
                    border: "none",
                    borderRadius: 0,
                    boxShadow: "none",
                    p: 0,
                },
            },
            outline: {
                container: {
                    boxShadow: "none",
                    bg: "transparent",
                }
            }
        },
    },

    Table: {
        variants: {
            simple: {
                table: { borderCollapse: "separate", borderSpacing: 0, fontVariantNumeric: "tabular-nums" },
                th: {
                    padding: 4,
                    fontWeight: 600,
                    color: "white",
                    borderColor: "ring",
                    bg: "brand.500",
                    _dark: { bg: "brand.200", color: "stone.800" },
                },
                td: {
                    padding: 4,
                    borderColor: "border",
                    transition: "background 0.18s cubic-bezier(.4,0,.2,1)"
                },
                tbody: {
                    tr: {
                        _hover: {
                            bg: "surfaceSubtle",
                        }
                    }
                },
                tfoot: { th: { borderColor: "border" } },
            },
            unstyled: {
                table: {
                    border: "none",
                },
                th: {
                    border: "none",
                    bg: "transparent",
                    p: 0,
                    _hover: { bg: "transparent" },
                },
                td: {
                    border: "none",
                    p: 0,
                },
                tbody: {
                    tr: {
                        _hover: { bg: "transparent" }
                    }
                },
                tfoot: {
                    th: { border: "none" },
                },
            },
        },
    },

    Alert: {
        baseStyle: {
            container: { borderRadius: "md", boxShadow: "sm" },
            title: { fontWeight: 600 },
        },
        variants: {
            unstyled: {
                container: {
                    bg: "transparent",
                    border: "none",
                    borderRadius: 0,
                    boxShadow: "none",
                    p: 0,
                },
            },
        },
    },

    Badge: {
        baseStyle: { borderRadius: "md", fontWeight: 500, textTransform: "none" },
        variants: {
            unstyled: {
                bg: "transparent",
                color: "inherit",
                border: "none",
                borderRadius: 0,
                fontWeight: "inherit",
                p: 0,
            },
        },
    },

    Tooltip: {
        baseStyle: {
            bg: "stone.900",
            color: "stone.50",
            borderRadius: "md",
            boxShadow: "md",
            fontWeight: 500,
            fontSize: "sm",
            px: 3,
            py: 2,
            "--popper-arrow-bg": "var(--chakra-colors-stone-900)",
            _dark: {
                color: "brand.300",
                borderColor: "brand.300",
                borderWidth: "1px",
                "--popper-arrow-bg": "var(--chakra-colors-brand-300)"
            },
        },
        variants: {
            unstyled: {
                bg: "transparent",
                color: "inherit",
                border: "none",
                borderRadius: 0,
                boxShadow: "none",
                fontWeight: "inherit",
                fontSize: "inherit",
                p: 0,
                "--popper-arrow-bg": "transparent",
            },
        },
    },

    Modal: {
        baseStyle: {
            dialog: {
                bg: "surface",
                borderRadius: "lg",
                borderWidth: "1px",
                borderColor: "border",
                boxShadow: "xl",
            },
            header: {
                color: "text",
                fontWeight: 600,
            },
            body: {
                color: "text",
            },
            footer: {
                borderTopColor: "border",
            },
            closeButton: {
                color: "muted",
                _hover: { color: "text", bg: "surfaceSubtle" },
                _focus: { boxShadow: "none" },
                _focusVisible: { boxShadow: focusRingSubtle },
                borderRadius: "md",
                transition: "all 0.18s cubic-bezier(.4,0,.2,1)",
            },
        },
        variants: {
            unstyled: {
                dialog: {
                    bg: "transparent",
                    border: "none",
                    borderRadius: 0,
                    boxShadow: "none",
                },
                header: {
                    p: 0,
                },
                body: {
                    p: 0,
                },
                footer: {
                    border: "none",
                    p: 0,
                },
                closeButton: {
                    bg: "transparent",
                    _hover: { bg: "transparent" },
                    _focus: { boxShadow: "none" },
                    _focusVisible: { boxShadow: "none" },
                },
            },
        },
    },
};

export const theme = extendTheme({
    config,
    colors,
    semanticTokens,
    styles,
    fonts,
    components,
    radii,
    space: { 1.5: "0.375rem" },
});
