import { Container, VStack, Text, SimpleGrid } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useProductStore } from "../store/product";
import { useEffect, useCallback } from "react";
import ProductCard from "../components/ProductCard";

const HomePage = () => {
  // 基本获取store中的方法
  const getProductsFromStore = useProductStore((state) => state.getProducts);
  const products = useProductStore((state) => state.products);

  // 使用useCallback包装函数，保持引用稳定
  const getProducts = useCallback(() => {
    getProductsFromStore();
  }, [getProductsFromStore]);

  useEffect(() => {
    getProducts();
  }, [getProducts]); // getProducts引用稳定，不会触发不必要调用

  // log products
  console.log("Home Page products: ", products);
  return (
    <Container maxW="container.xl" py={12}>
      <VStack spacing={8}>
        <Text
          fontSize="30"
          fontWeight="bold"
          bgGradient="linear(to-r, cyan.400, blue.500)"
          bgClip="text"
          textAlign="center"
        >
          Current Products 🚀
        </Text>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={10} w="full">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </SimpleGrid>

        {products.length === 0 && (
          <Text
            textAlign="center"
            fontSize="xl"
            fontWeight="bold"
            color="gray.500"
          >
            No products found.{" "}
            <Link to="/create">
              <Text
                as="span"
                color="blue.500"
                _hover={{ textDecoration: "underline" }}
              >
                Create a product
              </Text>
            </Link>
          </Text>
        )}
      </VStack>
    </Container>
  );
};

export default HomePage;
