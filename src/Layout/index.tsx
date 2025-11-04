import { Box, Container, Flex } from "@chakra-ui/react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Flex w="full" flexDir="column" position="relative">

      <Container maxW='8xl' my={{ base: 20, sm: 20, md: 6 }} position="relative" zIndex={1}>
        {children}
      </Container>
    </Flex>
  );
}
