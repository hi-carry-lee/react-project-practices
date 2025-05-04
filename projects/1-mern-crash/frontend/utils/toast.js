import { useToast } from "@chakra-ui/react";

export const useCustomToast = () => {
  const toast = useToast();

  const showToast = (title, description, status = "success") => {
    toast({
      title,
      description,
      status,
      duration: 3000,
      isClosable: true,
      position: "bottom-right",
    });
  };

  const showSuccessToast = (title, description) => {
    showToast(title, description, "success");
  };

  const showErrorToast = (title, description) => {
    showToast(title, description, "error");
  };

  return {
    showToast,
    showSuccessToast,
    showErrorToast,
  };
};
