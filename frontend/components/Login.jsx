import { Button, Center, Heading, Input, Stack } from "@chakra-ui/react";
import { useState } from "react";
import axios from "axios";

const Login = ({ setDisplayName, navigate }) => {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");

  const loginPass = async () => {
    try {
      const login_data = await axios.post(
        "http://localhost:3000/login",
        {
          username: username,
          password: password,
        },
        { withCredentials: true }
      );
      if (login_data.data.name) {
        setDisplayName(login_data.data.name);
      }
      navigate("/dashboard");
    } catch (err) {
      console.log("Error : " + JSON.stringify(err.response.data));
    }
  };

  return (
    <Center>
      <Stack
        p={8}
        borderWidth="thin"
        spacing={8}
        w="25%"
        direction="column"
        align="center"
      >
        <Heading color="black">Login Page</Heading>
        <Input
          onChange={(e) => setUserName(e.target.value)}
          placeholder="Enter your username"
        />
        <Input
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
        />
        <Button onClick={loginPass} size="lg">
          Submit
        </Button>
      </Stack>
    </Center>
  );
};

export default Login;
