import {
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
  Box,
  useColorModeValue,
  type InputProps,
} from "@chakra-ui/react";
import { LucideSearch } from "lucide-react";
import React from "react";


interface SearchBarProps extends InputProps {
  placeholder?: string;
  value: string;
  type?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "Procurar",
  value,
  type = "text",
  onChange,
  ...rest
}) => {

  return (
    <Box w="full">
      <InputGroup size="md">
        <Input
          {...rest}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          borderRadius="full"
          pr={10}
        />
        <InputRightElement>
          <IconButton
            aria-label="Buscar"
            icon={<LucideSearch />}
            marginRight={4}
            variant="ghost"
            color="muted"
            pointerEvents="none"
          />
        </InputRightElement>
      </InputGroup>
    </Box>
  );
};

export default SearchBar;
