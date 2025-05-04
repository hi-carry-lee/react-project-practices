import {
  Box,
  Container,
  Heading,
  useColorModeValue,
  VStack,
  Button,
  Input,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useProductStore } from "../store/product";
import { useLocation, useNavigate } from "react-router-dom";
import { useCustomToast } from "../utils/toast";

const CreatePage = () => {
  const { createProduct, updateProduct } = useProductStore();
  const [product, setProduct] = useState({
    name: "",
    price: "",
    image: "",
  });

  const { showSuccessToast, showErrorToast } = useCustomToast();
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const editId = searchParams.get("id");

  useEffect(() => {
    if (editId) {
      const productToEdit = useProductStore
        .getState()
        .products.find((p) => p._id === editId);
      if (productToEdit) {
        setProduct(productToEdit);
      }
    }
  }, [editId]);

  const handleSubmit = async () => {
    let result;
    if (editId) {
      result = await updateProduct(editId, product);
    } else {
      result = await createProduct(product);
    }

    if (result.success) {
      showSuccessToast(
        editId
          ? "Product updated successfully"
          : "Product created successfully",
        result.message
      );
      navigate("/");
    } else {
      showErrorToast("Error", result.message);
    }
  };

  return (
    <Container maxW="container.sm">
      <VStack spacing={8}>
        <Heading as="h1" size="2xl" textAlign="center" mb="8">
          {editId ? "Edit Product" : "Create New Product"}
        </Heading>
        <Box
          w="full"
          bg={useColorModeValue("white", "gray.800")}
          p={6}
          rounded="lg"
          shadow="md"
        >
          <VStack spacing={4}>
            <Input
              name="name"
              placeholder="Product Name"
              value={product.name}
              onChange={(e) => setProduct({ ...product, name: e.target.value })}
            />

            <Input
              name="price"
              placeholder="Product Price"
              type="number"
              value={product.price}
              onChange={(e) =>
                setProduct({ ...product, price: e.target.value })
              }
            />
            <Input
              name="image"
              placeholder="Product Image"
              value={product.image}
              onChange={(e) =>
                setProduct({ ...product, image: e.target.value })
              }
            />
            <Button
              type="submit"
              colorScheme="blue"
              w="full"
              onClick={handleSubmit}
            >
              {editId ? "Update Product" : "Create Product"}
            </Button>
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
};

export default CreatePage;
