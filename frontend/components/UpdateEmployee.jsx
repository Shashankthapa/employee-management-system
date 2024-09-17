import {
  Checkbox,
  CheckboxGroup,
  FormLabel,
  HStack,
  Input,
  Radio,
  RadioGroup,
  Select,
  Stack,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const UpdateEmployee = () => {
    const navigate = useNavigate();
  const [user, setUser] = useState({
    emp_username: "",
    email: "",
    phoneno: "",
    occupation: "",
    gender: "",
    education: "",
    file: "",
  });

  const { id } = useParams();
  //   console.log("ID: " + JSON.stringify(id))
  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios
      .post(`http://localhost:3000/updateemployee/${id}`, user)
      .then((res) => {console.log(res.data)
        navigate("/show-employee")
      })
      .catch((rej) => console.log(rej));
  };

  useEffect(() => {
    axios
      .get(`http://localhost:3000/getemployee/${id}`)
      .then((res) => {
        const {
          emp_username,
          email,
          phoneno,
          occupation,
          gender,
          education,
          file,
        } = res.data.emp[0];
        setUser({
          ...user,
          emp_username: emp_username,
          email: email,
          phoneno: phoneno,
          occupation: occupation,
          gender: gender,
          education: education,
          file: file,
        });
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <form>
      <FormLabel fontSize="2xl" as="legend">
        Create Employee
      </FormLabel>

      <Input
        value={user.emp_username}
        onChange={(e) => setUser({ ...user, emp_username: e.target.value })}
        placeholder="Enter your name"
      />
      <Input
        value={user.email}
        placeholder="Enter your email"
        onChange={(e) => setUser({ ...user, email: e.target.value })}
      />
      <Input
        value={user.phoneno}
        onChange={(e) => setUser({ ...user, phoneno: e.target.value })}
        placeholder="Enter your mobile no"
      />

      <Select
        value={user.occupation}
        onChange={(e) => setUser({ ...user, occupation: e.target.value })}
      >
        <option value="HR">HR</option>
        <option value="Manager">Manager</option>
        <option value="Sales">Sales</option>
      </Select>

      <RadioGroup value={`${user.gender}`}>
        <HStack spacing="24px">
          <Radio
            value="male"
            onChange={(e) => setUser({ ...user, gender: e.target.value })}
          >
            Male
          </Radio>
          <Radio
            value="female"
            onChange={(e) => setUser({ ...user, gender: e.target.value })}
          >
            Female
          </Radio>
        </HStack>
      </RadioGroup>

      <CheckboxGroup
        value={[`${user.education}`]}
        onChange={(e) => setUser({ ...user, education: e.target.value })}
      >
        <Stack spacing={[1, 5]} direction={["column", "row"]}>
          <Checkbox value="MCA">MCA</Checkbox>
          <Checkbox value="BCA">BCA</Checkbox>
          <Checkbox value="BSC">BSC</Checkbox>
          <Checkbox value="BE">BE</Checkbox>
          <Checkbox value="OTHER">OTHER</Checkbox>
        </Stack>
      </CheckboxGroup>

      <Input
        type="file"
        name="image"
        accept=".jpg,.png"
        onChange={(e) => setUser({ ...user, file: e.target.files[0] })}
      />
      <Input
        type="submit"
        onClick={handleSubmit}
        value="Submit"
        background="teal"
      />
    </form>
  );
};

export default UpdateEmployee;
