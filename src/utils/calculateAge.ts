/**
 * Calcula a idade atual baseada na data de nascimento
 * @param birthDate - Data de nascimento no formato ISO (YYYY-MM-DD) ou Date
 * @returns Idade em anos
 */
export const calculateAge = (birthDate: string | Date): number => {
    const birth = typeof birthDate === 'string' ? new Date(birthDate) : birthDate;
    const today = new Date();

    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    // Se ainda não fez aniversário este ano, subtrai 1
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
    }

    return age;
};

/**
 * Formata a idade como texto
 * @param birthDate - Data de nascimento no formato ISO (YYYY-MM-DD) ou Date
 * @returns String formatada "X anos"
 */
export const formatAge = (birthDate: string | Date): string => {
    const age = calculateAge(birthDate);
    return `${age} ${age === 1 ? 'ano' : 'anos'}`;
};
