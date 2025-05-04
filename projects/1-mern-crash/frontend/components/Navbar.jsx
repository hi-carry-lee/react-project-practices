import {
  Button,
  Container,
  Flex,
  HStack,
  Text,
  useColorMode,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";

import { PlusSquareIcon, SunIcon, MoonIcon } from "@chakra-ui/icons";

const Navbar = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    // ps is padding start
    <Container maxW={"1140px"} ps={4}>
      <Flex
        h={16}
        alignItems={"center"}
        justifyContent={"space-between"}
        flexDir={{
          base: "column",
          sm: "row",
        }}
      >
        <Text
          fontSize={{ base: "22", sm: "28" }}
          fontWeight="bold"
          textTransform="uppercase"
          textAlign="center"
          bgGradient="linear(to-r, cyan.400, blue.500)"
          // 使背景色/渐变色只填充文字内容区域而不是整个文本框
          bgClip="text"
        >
          <Link to={"/"}>Product Store 🛒</Link>
        </Text>

        <HStack>
          <Link to={"/create"}>
            <Button>
              <PlusSquareIcon fontSize={"20px"} />
            </Button>
          </Link>
          <Button onClick={toggleColorMode}>
            {colorMode === "dark" ? <SunIcon /> : <MoonIcon />}
          </Button>
        </HStack>
      </Flex>
    </Container>
  );
};

export default Navbar;
