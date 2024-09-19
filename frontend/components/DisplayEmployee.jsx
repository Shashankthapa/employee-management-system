import {
  Button,
  HStack,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Image,
  Input,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import ReactPaginate from "react-paginate";
import { IconContext } from "react-icons";
import { AiFillLeftCircle, AiFillRightCircle } from "react-icons/ai";

const DisplayEmployee = ({ itemsPerPage }) => {
  const [allEmpData, setAllEmpData] = useState([]);
  const [searchData, setSearchData] = useState("");
  //show data from empData.
  const [empData, setEmpData] = useState([]);

  const [itemOffset, setItemOffset] = useState(0);

  const endOffset = itemOffset + itemsPerPage;
  console.log(`Loading items from ${itemOffset} to ${endOffset}`);
  const currentItems = empData.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(empData.length / itemsPerPage);
  // Invoke when user click to request another page.
  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % empData.length;
    console.log(
      `User requested page number ${event.selected}, which is offset ${newOffset}`
    );
    setItemOffset(newOffset);
  };

  const handleDelete = async (id) => {
    await axios
      .get(`http://localhost:3000/delete/${id}`)
      .then((res) => {
        if (!res.ok) {
          console.log(res.data);
          window.location.reload();
        }
      })
      .catch((rej) => console.log(rej));
  };

  const handleSearch = (value) => {
    const data = allEmpData.filter((user, index) => {
      return (
        user.emp_username == value ||
        index == value ||
        user.email == value ||
        user.date == value
      );
    });
    console.log(data);
    setEmpData(data);
    // console.log(value);
  };

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/employee/display", { withCredentials: true })
      .then(async (res) => {
        const data = res.data.emp;
        setEmpData(data);
        setAllEmpData(data);
        console.log(data);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <>
      <HStack flexDirection="row-reverse">
        <Input
          width="25%"
          placeholder="Search"
          onChange={(e) => setSearchData(e.target.value)}
        />
        <Button
          colorScheme="teal"
          size="md"
          onClick={() => handleSearch(searchData)}
        >
          <FaSearch />
        </Button>
      </HStack>

      <TableContainer>
        <Table variant="simple">
          <TableCaption>List all Employees.</TableCaption>
          <Thead>
            <Tr>
              <Th>ID</Th>
              <Th>Image</Th>
              <Th>Name</Th>
              <Th>Email</Th>
              <Th>MobileNo</Th>
              <Th>Designation</Th>
              <Th>Gender</Th>
              <Th>COurse</Th>
              <Th>CreateDate</Th>
              <Th>Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {currentItems &&
              currentItems.map((curr_val, index) => (
                <Tr key={index}>
                  <Td>{itemOffset >= 4 ? itemOffset + 1 + index : index + 1}</Td>
                  <Td>
                    <Image
                      boxSize="50px"
                      src={`http://localhost:3000/images/${curr_val.file}`}
                      alt="emp_image"
                    />
                  </Td>
                  <Td>{curr_val.emp_username}</Td>
                  <Td>{curr_val.email}</Td>
                  <Td>{curr_val.phoneno}</Td>
                  <Td>{curr_val.occupation}</Td>
                  <Td>{curr_val.gender}</Td>
                  <Td>{curr_val.education}</Td>
                  <Td>{curr_val.create_date}</Td>
                  <Td>
                    <HStack>
                      <Button>
                        <Link to={`/update/${curr_val._id}`}>Update</Link>
                      </Button>
                      <Button onClick={() => handleDelete(curr_val._id)}>
                        Delete
                      </Button>
                    </HStack>
                  </Td>
                </Tr>
              ))}
          </Tbody>
        </Table>
      </TableContainer>
      <ReactPaginate
        containerClassName={"pagination"}
        pageClassName={"page-item"}
        activeClassName={"active"}
        breakLabel="..."
        nextLabel={
          <IconContext.Provider value={{ color: "#B8C1CC", size: "36px" }}>
            <AiFillRightCircle />
          </IconContext.Provider>
        }
        onPageChange={handlePageClick}
        pageRangeDisplayed={5}
        pageCount={pageCount}
        previousLabel={
          <IconContext.Provider value={{ color: "#B8C1CC", size: "36px" }}>
            <AiFillLeftCircle />
          </IconContext.Provider>
        }
        renderOnZeroPageCount={null}
      />
    </>
  );
};

export default DisplayEmployee;
