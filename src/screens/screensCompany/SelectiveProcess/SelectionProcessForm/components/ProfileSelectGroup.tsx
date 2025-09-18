
import { ProfileEnum } from "@/types/selectionProcess.types";
import { SimpleGrid } from "@chakra-ui/react";
import { ProfileSelect } from "./ProfileSelect";


type ProfileSelectProps = {
    currentValue: ProfileEnum;
    handleSelectItem(value: ProfileEnum): void;
};

export const ProfileSelectGroup: React.FC<ProfileSelectProps> = ({
    currentValue,
    handleSelectItem,
}) => {
    const handleSelect = (value: ProfileEnum) => handleSelectItem(value);
    return (
        <SimpleGrid gap={8} columns={{ base: 1, sm: 1, md: 2 }}>
            <ProfileSelect
                title="Aprendiz"
                text="Vaga para profissionais que realizem atividades em vagas que exijam maior capacidade de análise, maior relacionamento e uma maior entrega."
                value={ProfileEnum.APPRENTICE}
                onSelect={handleSelect}
                isActive={currentValue === ProfileEnum.APPRENTICE}
            />

            <ProfileSelect
                title="Estagiário"
                text="Vaga para estudante de ensino médio, técnico ou superior. Contrato de estágio."
                value={ProfileEnum.TRAINEE}
                onSelect={handleSelect}
                isActive={currentValue === ProfileEnum.TRAINEE}
            />

            <ProfileSelect
                title="Gerencial"
                text="Vagas para gestores (Supervisor, coordenador, gerente), profissionais com formação superior completa e carreira em cargos de liderança."
                value={ProfileEnum.MANAGERIAL}
                onSelect={handleSelect}
                isActive={currentValue === ProfileEnum.MANAGERIAL}
            />

            <ProfileSelect
                title="Operacional"
                text="Para profissionais com cargos de menor complexidade que atuam com produtos e serviços mais simples em venda, muitas vezes com 'script' previamente definido."
                value={ProfileEnum.OPERATIONAL}
                onSelect={handleSelect}
                isActive={currentValue === ProfileEnum.OPERATIONAL}
            />
        </SimpleGrid>
    );
};
