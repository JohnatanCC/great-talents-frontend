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
  const bg = useColorModeValue("gray.50", "whiteAlpha.100");
  const border = useColorModeValue("gray.200", "whiteAlpha.300");

  return (
    <Box w="full">
      <InputGroup size="md">
        <Input
          {...rest}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          borderWidth={1}
          borderColor={border}
          borderRadius="full"
          bg={bg}
          pr={10}
        />
        <InputRightElement>
          <IconButton
            aria-label="Buscar"
            icon={<LucideSearch />}
            marginRight={4}
            variant="ghost"
            color="fg.subtle"
            pointerEvents="none"
          />
        </InputRightElement>
      </InputGroup>
    </Box>
  );
};

export default SearchBar;
