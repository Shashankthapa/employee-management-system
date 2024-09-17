import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  Heading,
  Spacer,
} from "@chakra-ui/react";
import { Link } from "@chakra-ui/react";
import { useLocation } from "react-router-dom";

const Header = ({ displayName, navigate }) => {
  const location = useLocation();
  if (
    location.pathname == "/login" ||
    location.pathname == "/register" ||
    location.pathname == "/logout"
  ) {
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem("username");
    navigate("/logout");
  };

  return (
    <Flex p={2} minWidth="max-content" alignItems="center" gap="2">
      <Box p="2">
        <Heading size="md">Employee Management</Heading>
      </Box>
      <Spacer />

      <Box>{displayName}</Box>
      {displayName ? (
        <ButtonGroup>
          <Button colorScheme="teal">
            <Link onClick={handleLogout}>Logout</Link>
          </Button>
        </ButtonGroup>
      ) : (
        <ButtonGroup gap="2">
          <Button colorScheme="teal">
            <Link href="/register">Sign Up</Link>
          </Button>
          <Button colorScheme="teal">
            <Link href="/login">Log In</Link>
          </Button>
        </ButtonGroup>
      )}
    </Flex>
  );
};

export default Header;
