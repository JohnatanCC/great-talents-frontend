import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  IconButton,
  Stack,
  Switch,
} from "@chakra-ui/react";
import React from "react";
import { Scard } from "../../../components/Scard";
import CustomIcon from "../../../components/CustomIcon";
import InputForm from "../../../components/Input";
import { UseFormRegister } from "react-hook-form";

type Requirement = {
  id: string;
  name: string;
  required: boolean;
};

type RequirementsSectionProps = {
  requirements: Requirement[];
  add: (item: Omit<Requirement, "id">) => void;
  remove: (index: number) => void;
  register: UseFormRegister<any>;
  update: (index: number, value: Requirement) => void;
};

export const RequirementsSection: React.FC<RequirementsSectionProps> = ({
  requirements,
  add,
  remove,
  register,
  update,
}) => {
  return (
    <Scard
      title="Requisitos da vaga"
      bodyContent={
        <Stack>
          <Alert bg="var(--blue-muted)" variant="left-accent" status="info">
            <Stack>
              <AlertTitle>Observação</AlertTitle>
              <AlertDescription>
                Selecione os requisitos da vaga logo abaixo, você pode definir
                os pesos de acordo com a importância de cada um, para filtrar
                melhor os candidatos no processo seletivo.
              </AlertDescription>
            </Stack>
          </Alert>

          <Button
            colorScheme="green"
            variant="solid"
            type="button"
            width="fit-content"
            my={4}
            onClick={() => add({ name: "", required: false })}
          >
            <CustomIcon name="add" color="white" mr={2} />
            Adicionar Requisito
          </Button>

          {requirements.map((field, index) => (
            <React.Fragment key={field.id}>
              <Flex align="center" gap={2} >
                <IconButton
                  aria-label="delete-requirement"
                  colorScheme="red"
                  mb={4}
                  onClick={() => remove(index)}
                  icon={<CustomIcon name="delete" />}
                />

                <InputForm
                  placeholder="Enunciado"
                  defaultValue={field.name}
                  {...register(`requirements.${index}.name`)}
                />
              </Flex>

              <FormControl display="flex" alignItems="center" mb={4}>
                <FormLabel htmlFor={`requirements.${index}.required`} mb="0">
                  Definir como obrigatório?
                </FormLabel>
                <Switch
                  id={`requirements.${index}.required`}
                  isChecked={field.required}
                  onChange={(e) =>
                    update(index, {
                      ...field,
                      required: e.target.checked,
                    })
                  }
                  colorScheme="orange"
                />
              </FormControl>

              <Divider borderColor="var(--border-emphasized)" mb={4} />
            </React.Fragment>
          ))}
        </Stack>
      }
    />
  );
};
