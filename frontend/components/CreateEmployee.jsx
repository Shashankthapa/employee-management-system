import {
  // Button,
  // Center,
  Checkbox,
  // FormControl,
  FormLabel,
  HStack,
  Input,
  Radio,
  RadioGroup,
  Select,
  Stack,
  // VStack,
} from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";

const CreateEmployee = () => {
  const [phNo, setPhNo] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [occupation, setOccupation] = useState("HR");
  const [gender, setGender] = useState("");
  const [education, setEducation] = useState("");
  const [file, setFile] = useState("");

  // const setImage = async (e) => {
  //   await
  // };

  const handleSubmit = async (e) => {
    console.log("clicked");
    e.preventDefault();
    //for multipart
    const formData = new FormData();
    formData.append("emp_username", name);
    formData.append("email", email);
    formData.append("occupation", occupation);
    formData.append("gender", gender);
    formData.append("education", education);
    formData.append("phoneno", phNo);
    // key and value should not have the same name or else it will throw error.
    formData.append("image", file);
    try {
      const formPost = await axios.post(
        "http://localhost:3000/create-emp",
        formData,
        {
          withCredentials: true,
        }
      );
      console.log(formPost.response);
    } catch (err) {
      console.log(err.response);
    }
  };

  return (
    <form>
      <FormLabel fontSize="2xl" as="legend">
        Create Employee
      </FormLabel>

      <Input
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter your name"
      />
      <Input
        placeholder="Enter your email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        onChange={(e) => setPhNo(e.target.value)}
        placeholder="Enter your mobile no"
      />

      <Select defaultValue="HR" onChange={(e) => setOccupation(e.target.value)}>
        <option value="HR">HR</option>
        <option value="Manager">Manager</option>
        <option value="Sales">Sales</option>
      </Select>

      <RadioGroup>
        <HStack spacing="24px">
          <Radio value="male" onChange={(e) => setGender(e.target.value)}>
            Male
          </Radio>
          <Radio value="female" onChange={(e) => setGender(e.target.value)}>
            Female
          </Radio>
        </HStack>
      </RadioGroup>

      <Stack
        spacing={5}
        direction="row"
        onChange={(e) => setEducation(e.target.value)}
      >
        <Checkbox value="MCA">MCA</Checkbox>
        <Checkbox value="BCA">BCA</Checkbox>
        <Checkbox value="BSC">BSC</Checkbox>
        <Checkbox value="BE">BE</Checkbox>
        <Checkbox value="OTHER">OTHER</Checkbox>
      </Stack>

      <Input
        type="file"
        name="image"
        accept=".jpg,.png"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <Input
        type="submit"
        onClick={(e) => handleSubmit(e)}
        value="Submit"
        background="teal"
      />
    </form>
  );
};

export default CreateEmployee;
