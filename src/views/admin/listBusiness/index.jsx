import {
  Table,
  Row,
  Col,
  Modal,
  Button,
  InputGroup,
  FormControl,
} from "react-bootstrap";
import { Box } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { http } from "../../../axios/init";
import "./styles.css";
import { CgAddR, CgCodeSlash } from "react-icons/cg";
import { BsSearch } from "react-icons/bs";
import { Form } from "react-bootstrap";

const ListBusiness = () => {
  const getJWTToken = localStorage.getItem("dtvt");
  const [data, setData] = useState([]);
  const [showModalSnippet, setShowModalSnippet] = useState(false);
  const [codeIntegrationHead, setCodeIntegrationHead] = useState("");
  const [codeIntegrationBody, setCodeIntegrationBody] = useState("");
  const handleModalSnippetClose = () => {
    setCodeIntegrationHead("");
    setCodeIntegrationBody("");
    setShowModalSnippet(false);
  }
  const handleModalSnippetShow = (item) => {
    debugger
    setCodeIntegrationHead(item?.attributes?.codeIntegrationHead);
    setCodeIntegrationBody(item?.attributes?.codeIntegrationBody);
    setShowModalSnippet(true);
  }

  const fillter = () => {
    // Declare variables

    var input, filter, table, tr, td, i, txtValue;

    input = document.getElementById("myInput");

    filter = input.value.toUpperCase();

    table = document.getElementById("myTable");

    tr = table.getElementsByTagName("tr");

    // Loop through all table rows, and hide those who don't match the search query

    for (i = 0; i < tr.length; i++) {
      td = tr[i].getElementsByTagName("td")[0];

      if (td) {
        txtValue = td.textContent || td.innerText;

        if (txtValue.toUpperCase().indexOf(filter) > -1) {
          tr[i].style.display = "";
        } else {
          tr[i].style.display = "none";
        }
      }
    }
  };

  useEffect(() => {
    http
      .get("businesses", {
        headers: {
          Authorization: `Bearer ${getJWTToken}`,
        },
      })
      .then((response) => {
        const objectData = response.data.data;
        const objectsData = [...objectData];
        setData(objectsData);
      })
      .catch((err) => err);
  }, []);

  const copyToClipboard = (value) => {
    // Sử dụng API Clipboard để sao chép văn bản vào clipboard
    navigator.clipboard.writeText(value)
      .then(() => {
        // Thao tác sao chép thành công
        console.log("Sao chép thành công: " + value);
      })
      .catch((err) => {
        // Xử lý lỗi khi sao chép không thành công
        console.error("Lỗi khi sao chép: " + err);
      });
  };

  return (
    <Box pt={{ base: "180px", md: "80px", xl: "80px" }} w="100%">
      <Form className="custom-search-bar">
        <FormControl
          type="text"
          placeholder="Search"
          className="mr-sm-2 custom-input"
          id="myInput"
          onKeyUp={fillter}
        />
        <BsSearch className="btnSearch" />
        <Button variant="primary" style={{ margin: "15px 10px 15px 60px" }}>
          <Link to="#" className="btnView">
            <CgAddR style={{ display: "inline-block" }} /> Add new partner{" "}
          </Link>
        </Button>
      </Form>

      <Table
        id="myTable"
        bordered
        hover
        className="text-center"
        style={{ borderRadius: "15px", overflow: "hidden" }}
      >
        <thead>
          <tr>
            <th className="headerCell">Name of business</th>
            <th className="headerCell">Client ID number</th>
            <th className="headerCell">Person in charge</th>
            <th className="headerCell">Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td style={{ verticalAlign: "middle" }}>
                <div
                  style={{
                    alignItems: "center",
                    display: "flex",
                    flexDirection: "row",
                    paddingLeft: "35%",
                  }}
                >
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      objectFit: "cover",
                      position: "relative",
                    }}
                  >
                    <img style={{ borderRadius: "50%", width: "40px", height: "40px", objectFit: "cover" }} src={item?.attributes?.ManagerImage} alt="null" />
                  </div>
                  <div
                    style={{
                      alignItems: "center",
                      display: "inline-flex",
                      flex: "0 0 auto",
                      gap: "10px",
                      justifyContent: "center",
                      padding: "10px 10px 10px 16px",
                      position: "relative",
                    }}
                  >
                    <Link
                      to={`list-product?id=${item?.attributes?.businessId}`}
                    >
                      {item?.attributes?.Name}
                    </Link>
                  </div>
                </div>
              </td>
              <td style={{ verticalAlign: "middle" }}>
                {item?.attributes?.businessId}
              </td>
              <td style={{ verticalAlign: "middle" }}>
                <div
                  style={{
                    alignItems: "center",
                    display: "flex",
                    flexDirection: "row",
                    paddingLeft: "35%",
                  }}
                >
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      objectFit: "cover",
                      position: "relative",
                    }}
                  >
                    <img style={{ borderRadius: "50%", width: "40px", height: "40px", objectFit: "cover" }} src={item?.attributes?.ManagerImage} alt="null" />
                  </div>
                  <div
                    style={{
                      alignItems: "center",
                      display: "inline-flex",
                      flex: "0 0 auto",
                      gap: "10px",
                      justifyContent: "center",
                      padding: "10px 10px 10px 16px",
                      position: "relative",
                    }}
                  >
                    {item?.attributes?.Manager}
                  </div>
                </div>
              </td>
              <td
                style={{
                  verticalAlign: "middle",
                  textAlign: "left",
                  width: "20%",
                }}
              >
                <Link to="#">
                  {" "}
                  <CgAddR style={{ display: "inline-block" }} /> add people{" "}
                </Link>
                <br />
                <p className="linkShow" onClick={()=>{handleModalSnippetShow(item)}}>
                  {" "}
                  <CgCodeSlash style={{ display: "inline-block" }} /> generate
                  code snippet{" "}
                </p>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Modal show={showModalSnippet} onHide={handleModalSnippetClose}>
        <Modal.Header closeButton>
          <Modal.Title>Install Google Tag Manager</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Copy the code below and paste it onto every page of your website{" "}
          </p>
          <p>
            Paste this code as high in the <b>&lt;head&gt;</b> of the page as
            possible:{" "}
          </p>
          <br />
          <InputGroup className="mb-3">
            <FormControl
              id="copyableInput"
              placeholder="Copy me!"
              aria-label="Copy me!"
              aria-describedby="copy-button"
              disabled="true"
              value={codeIntegrationHead}
            />
            <Button
              variant="outline-secondary"
              id="copy-button"
              onClick={()=>{copyToClipboard(codeIntegrationHead)}}
            >
              Copy
            </Button>
          </InputGroup>

          <p>
            Additionally, paste this code immediately after the opening{" "}
            <b>&lt;body&gt;</b> tag:{" "}
          </p>
          <br />
          <InputGroup className="mb-3">
            <FormControl
              id="copyableInput"
              placeholder="Copy me!"
              aria-label="Copy me!"
              aria-describedby="copy-button"
              disabled="true"
              value={codeIntegrationBody}
            />
            <Button
              variant="outline-secondary"
              id="copy-button"
              onClick={()=>{copyToClipboard(codeIntegrationBody)}}
            >
              Copy
            </Button>
          </InputGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalSnippetClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleModalSnippetClose}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </Box>
  );
};
export default ListBusiness;
