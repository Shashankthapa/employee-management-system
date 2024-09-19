import { Button, Center, Heading, Input, Stack } from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  const register = async (e) => {
    e.preventDefault();
    try {
      const createUser = await axios.post("http://localhost:3000/api/user/create", {
        username: name,
        email: email,
        password: pass,
      });
      // if axios post has some error than display msg.
      console.log(createUser.data);
    } catch (err) {
      console.log(err.response.data.message);
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
        <form onSubmit={register}>
          <Heading color="black">Register Page</Heading>
          <Input
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your username"
          />
          <Input
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
          <Input
            onChange={(e) => setPass(e.target.value)}
            placeholder="Enter your password"
          />
          {/* <Input placeholder="Renter your password" /> */}
          <Button size="lg" type="submit">
            Submit
          </Button>
          {/* <Input size="lg" type="submit" value="Submit" onClick={register} /> */}
        </form>
      </Stack>
    </Center>
  );
};

export default Register;
