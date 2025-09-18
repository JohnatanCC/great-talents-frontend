import Sidebar from "@/components/UI/Sidebar";
import { Box, Container, Flex } from "@chakra-ui/react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Flex flexDir="row">
      <Sidebar />
      <Flex w="full" flexDir="column">
        <Container maxW='fluid' my={{ base: 20, sm: 20, md: 6 }}>
          {children}
        </Container>
      </Flex>
    </Flex>
  );
}
