import {
  Box,
  Image,
  Heading,
  Text,
  Button,
  HStack,
  VStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useColorModeValue,
  useDisclosure,
  IconButton,
  Input,
} from "@chakra-ui/react";
import { useProductStore } from "../store/product";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { useState } from "react";
import { useCustomToast } from "../utils/toast";

const ProductCard = ({ product }) => {
  const bg = useColorModeValue("gray.50", "gray.800");
  const textColor = useColorModeValue("gray.700", "gray.200");
  const deleteProduct = useProductStore((state) => state.deleteProduct);
  const { showSuccessToast, showErrorToast } = useCustomToast();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { updateProduct } = useProductStore();
  const [updatedProduct, setUpdatedProduct] = useState(product);

  const handleDelete = async (id) => {
    const { success, message } = await deleteProduct(id);

    if (success) {
      showSuccessToast("Product deleted successfully", message);
    }
  };

  const handleUpdate = async (id) => {
    const { success, message } = await updateProduct(id, updatedProduct);

    if (success) {
      showSuccessToast("Success", "Product updated successfully");
      onClose();
    } else {
      showErrorToast("Product update failed", message);
    }
  };
  return (
    <>
      <Box
        shadow="lg"
        rounded="lg"
        overflow="hidden"
        transition="all 0.3s"
        bg={bg}
        _hover={{ transform: "translateY(-5px)", shadow: "xl" }}
      >
        <Image
          src={product.image}
          alt={product.name}
          h={48}
          w="full"
          objectFit="cover"
        />
        <Box p={4}>
          <Heading as="h3" fontSize="md" mb={2}>
            {product.name}
          </Heading>
          <Text fontSize="xl" color={textColor} fontWeight="bold" mb={4}>
            {product.price}
          </Text>
          <HStack>
            <IconButton
              icon={<EditIcon />}
              onClick={onOpen}
              colorScheme="blue"
            />
            <IconButton
              icon={<DeleteIcon />}
              onClick={() => handleDelete(product._id)}
              colorScheme="red"
            />
          </HStack>
        </Box>
      </Box>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Update Product</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <Input
                name="name"
                placeholder="Product Name"
                value={updatedProduct.name}
                onChange={(e) =>
                  setUpdatedProduct({
                    ...updatedProduct,
                    name: e.target.value,
                  })
                }
              />

              <Input
                name="price"
                placeholder="Product Price"
                type="number"
                value={updatedProduct.price}
                onChange={(e) =>
                  setUpdatedProduct({
                    ...updatedProduct,
                    price: e.target.value,
                  })
                }
              />
              <Input
                name="image"
                placeholder="Product Image"
                value={updatedProduct.image}
                onChange={(e) =>
                  setUpdatedProduct({
                    ...updatedProduct,
                    image: e.target.value,
                  })
                }
              />
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={() => handleUpdate(product._id)}
            >
              Update
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProductCard;
