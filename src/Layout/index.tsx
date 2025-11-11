import { Box, Container, Flex, Stack, VStack } from "@chakra-ui/react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Flex w="full" flexDir="column" position="relative">

      <Container maxW={{ base: "none", sm: "none", md: "8xl" }} px={{ base: "0", md: "6" }} position="relative" zIndex={1}>
        <Stack py={{ base: 20, sm: 20, md: 6 }} px={4} bg="bg" minH="100vh">
          {children}
        </Stack>
      </Container>
    </Flex>
  );
}
