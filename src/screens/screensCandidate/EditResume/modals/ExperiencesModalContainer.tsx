import {
  Box,
  Button,
  Checkbox,
  Grid,
  GridItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useToast,
  type ButtonProps,
} from "@chakra-ui/react";
import { useEffect, useState, type KeyboardEvent } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import ExperienceCandidateService from "../../../../services/Candidate/ExperienceCandidateService";
import { toastTemplate } from "../../../../templates/toast";
import { defaultOptionSelect } from "../../../../constants/global.constants";
import { validationNewExperienceFormationForm } from "../../../../validations/experienceFormation.validation";

import type { SelectOption } from "@/types/main.types";
import InputForm from "@/components/UI/InputForm";
import { SelectForm } from "@/components/UI/SelectForm";
import { ufs } from "@/constants/states";
import TextareaForm from "@/components/UI/TexareaForm";

interface ExperienceForm {
  title: string;
  companyName: string;
  typeContract?: SelectOption | null; // (mantido se quiser usar depois)
  uf: SelectOption | null;
  city: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

const ModalForm: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  currentExperienceId: number | null;
  refresh: () => void;
}> = ({ isOpen, onClose, refresh, currentExperienceId }) => {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    setValue,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ExperienceForm>({
    defaultValues: {
      title: "",
      companyName: "",
      uf: defaultOptionSelect,
      city: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
    },
    resolver: yupResolver(validationNewExperienceFormationForm),
  });

  const formValues = watch();

  // Ctrl/Cmd + Enter envia
  const onKeyDown = (
    e: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      void handleSubmit(onSubmit)();
    }
  };

  // quando marcar "current", limpar data final e desabilitar input
  useEffect(() => {
    if (formValues.current && formValues.endDate) {
      setValue("endDate", "", { shouldDirty: true });
    }
  }, [formValues.current, formValues.endDate, setValue]);

  // Select (UF) integrado ao RHF via setValue
  const handleChangeSelect = (name: keyof ExperienceForm, value: SelectOption) =>
    setValue(name, value, { shouldDirty: true });

  const onSubmit: SubmitHandler<ExperienceForm> = async (data) => {
    try {
      setIsLoading(true);

      const body = {
        description: data.description,
        position: data.title,
        company_name: data.companyName,
        state: data.uf?.value,
        city: data.city,
        start: data.startDate,
        end: data.current ? null : data.endDate || null,
        current: data.current,
      };

      if (currentExperienceId) {
        await ExperienceCandidateService.update(body, currentExperienceId);
      } else {
        await ExperienceCandidateService.create(body);
      }

      toast(
        toastTemplate({
          status: "success",
          description: "Experiência salva com sucesso!",
        })
      );
      refresh();
      onClose();
    } catch {
      toast(
        toastTemplate({
          status: "error",
          description: "Erro ao salvar experiência",
        })
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Carregar dados para edição / reset para novo
  useEffect(() => {
    if (currentExperienceId) {
      (async () => {
        try {
          const response = await ExperienceCandidateService.findOne(currentExperienceId);
          setValue("title", response.position);
          setValue("companyName", response.company_name);
          setValue("uf", { label: response.state, value: response.state });
          setValue("city", response.city || "");
          setValue("startDate", response.start || "");
          setValue("endDate", response.end || "");
          setValue("current", !!response.current);
          setValue("description", response.description || "");
        } catch {
          // silencioso
        }
      })();
    } else {
      reset();
    }
  }, [currentExperienceId, reset, setValue]);

  const title = currentExperienceId
    ? "Editar experiência profissional"
    : "Nova experiência profissional";

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl">
      <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(6px)" />
      <ModalContent bg="surface" overflow="hidden">
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader bgGradient="linear(to-r, brand.600, brand.400)" color="white" py={3}>
            {title}
          </ModalHeader>
          <ModalCloseButton color="white" _hover={{ opacity: 0.9 }} />

          <ModalBody bg="surface" py={5}>
            <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={4}>
              <GridItem colSpan={{ base: 1, md: 2 }}>
                <InputForm
                  {...register("title")}
                  label="Cargo"
                  placeholder="Ex.: Desenvolvedor Front-end"
                  maxLength={60}
                  onKeyDown={onKeyDown}
                  errorMessage={errors.title?.message}
                />
              </GridItem>

              <GridItem colSpan={{ base: 1, md: 2 }}>
                <InputForm
                  {...register("companyName")}
                  label="Empresa"
                  placeholder="Ex.: Great Talents"
                  maxLength={60}
                  onKeyDown={onKeyDown}
                  errorMessage={errors.companyName?.message}
                />
              </GridItem>

              <GridItem>
                <SelectForm
                  name="uf"
                  label="Estado (UF)"
                  options={ufs}
                  value={formValues.uf}
                  onChangeSelect={handleChangeSelect}
                  errorMessage={errors.uf?.message as string}
                />
              </GridItem>

              <GridItem>
                <InputForm
                  {...register("city")}
                  label="Cidade"
                  placeholder="Ex.: São Paulo"
                  maxLength={60}
                  onKeyDown={onKeyDown}
                  errorMessage={errors.city?.message}
                />
              </GridItem>

              <GridItem>
                <InputForm
                  {...register("startDate")}
                  label="Data de início"
                  type="date"
                  onKeyDown={onKeyDown}
                  errorMessage={errors.startDate?.message}
                />
              </GridItem>

              <GridItem>
                <InputForm
                  {...register("endDate")}
                  label="Data de conclusão"
                  type="date"
                  isDisabled={formValues.current}
                  onKeyDown={onKeyDown}
                  errorMessage={errors.endDate?.message}
                />
              </GridItem>

              <GridItem colSpan={{ base: 1, md: 2 }}>
                <Checkbox {...register("current")}>Trabalho atualmente neste cargo</Checkbox>
              </GridItem>

              <GridItem colSpan={{ base: 1, md: 2 }}>
                <TextareaForm
                  {...register("description")}
                  label="Descrição (máx. 2500 caracteres)"
                  placeholder="Principais responsabilidades, resultados, tecnologias…"
                  onKeyDown={onKeyDown}
                  errorMessage={errors.description?.message}
                />
              </GridItem>
            </Grid>
          </ModalBody>

          <ModalFooter bg="surfaceSubtle" display="flex" gap={3} justifyContent="flex-start">
            <Button colorScheme="brand" type="submit" isLoading={isLoading || isSubmitting}>
              Confirmar
            </Button>
            <Button onClick={onClose} variant="outline">
              Cancelar
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

const ExperienceButton: React.FC<ButtonProps> = ({ onClick, ...rest }) => {
  return (
    <Button w="140px" colorScheme="brand" onClick={onClick} {...rest}>
      Adicionar
    </Button>
  );
};

interface ExperiencesContentProps {
  refresh: () => void;
  currentExperienceId: number | null;
  onOpen: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export const ExperiencesModalContainer: React.FC<ExperiencesContentProps> = ({
  refresh,
  currentExperienceId,
  onOpen,
  isOpen,
  onClose,
}) => {
  return (
    <Box>
      <ExperienceButton onClick={onOpen} />
      {isOpen && (
        <ModalForm
          isOpen={isOpen}
          onClose={onClose}
          refresh={refresh}
          currentExperienceId={currentExperienceId}
        />
      )}
    </Box>
  );
};
