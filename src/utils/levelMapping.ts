/**
 * Utilitários para mapeamento de níveis de proficiência
 * Usado para habilidades e idiomas
 */

/**
 * Converte string de nível em número de mini barras (1-4)
 */
export const levelToMiniBarCount = (level?: string): number => {
    const normalized = (level || "").toLowerCase();

    if (/^basi|^inic/.test(normalized)) return 1; // Básico/Iniciante
    if (/^inter/.test(normalized)) return 2;      // Intermediário  
    if (/^avan|^upper/.test(normalized)) return 3; // Avançado
    if (/^expe|^nati|^nativo|^flu/.test(normalized)) return 4; // Experiente/Nativo/Fluente

    return 2; // Padrão para intermediário
};

/**
 * Converte string de nível em porcentagem (para barras de progresso)
 * @deprecated Use levelToMiniBarCount para nova implementação com mini barras
 */
export const levelToPercentage = (level?: string): number => {
    const normalized = (level || "").toLowerCase();

    if (/^basi|^inic/.test(normalized)) return 30;
    if (/^inter/.test(normalized)) return 60;
    if (/^avan|^upper/.test(normalized)) return 85;
    if (/^expe|^nati|^nativo|^flu/.test(normalized)) return 100;

    return 50; // Padrão
};

/**
 * Lista de opções de nível para formulários
 */
export const LEVEL_OPTIONS = [
    { value: "beginner", label: "Iniciante" },
    { value: "intermediate", label: "Intermediário" },
    { value: "advanced", label: "Avançado" },
    { value: "fluent", label: "Fluente" },
];

/**
 * Lista de opções de nível para habilidades (software)
 */
export const SOFTWARE_LEVEL_OPTIONS = [
    { value: "Iniciante", label: "Iniciante" },
    { value: "Intermediário", label: "Intermediário" },
    { value: "Avançado", label: "Avançado" },
    { value: "Experiente", label: "Experiente" }, // Mais apropriado que "Fluente" para software
];