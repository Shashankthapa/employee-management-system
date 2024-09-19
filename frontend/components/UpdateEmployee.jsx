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
    const formData = new FormData();
    formData.append("emp_username", user.emp_username);
    formData.append("email", user.email);
    formData.append("occupation", user.occupation);
    formData.append("gender", user.gender);
    formData.append("education", user.education);
    formData.append("phoneno", user.phoneno);
    formData.append("image", user.file);
    await axios
      .post(`http://localhost:3000/updateemployee/${id}`, formData)
      .then((res) => {
        console.log(res.data);
        navigate("/show-employee");
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

      <Stack
        spacing={[1, 5]}
        direction={["column", "row"]}
        onChange={(e) => setUser({ ...user, education: e.target.value })}
      >
        {/* <HStack spacing="24px"> */}
        <Checkbox value="MCA" isChecked={user.education.includes("MCA")}>
          MCA
        </Checkbox>
        <Checkbox value="BCA" isChecked={user.education.includes("BCA")}>
          BCA
        </Checkbox>
        <Checkbox value="BSC" isChecked={user.education.includes("BSC")}>
          BSC
        </Checkbox>
        <Checkbox value="BE" isChecked={user.education.includes("BE")}>
          BE
        </Checkbox>
        <Checkbox value="OTHER" isChecked={user.education.includes("OTHER")}>
          OTHER
        </Checkbox>
        {/* </HStack> */}
      </Stack>

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
