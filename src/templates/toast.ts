import type { UseToastOptions } from "@chakra-ui/react";


export const toastTemplate = (params: UseToastOptions): UseToastOptions => {
    return {
        title: "Aviso",
        duration: 9000,
        isClosable: true,
        ...params,
    };
};
