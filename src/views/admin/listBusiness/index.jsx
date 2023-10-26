import { Table, Modal, Button, FormControl, Alert } from "react-bootstrap";
import jwt_decode from "jwt-decode";
import { Box } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { http, urlStrapi } from "../../../axios/init";
import "./styles.css";
import { CgAddR, CgCodeSlash } from "react-icons/cg";
import { Form } from "react-bootstrap";
import { FaRegCopy } from "react-icons/fa";
import { BsSearch, BsFillCheckCircleFill } from "react-icons/bs";
import { TiDeleteOutline } from "react-icons/ti";
import ModalAddNewPartner from "./component/modalAddNewPartner";
import ModalAddPeople from "./component/modalAddPeople";
import {
  roleManagerAll,
  roleManagerBusiness,
  roleUser,
} from "../../../const/roles";

const ListBusiness = () => {
  const getJWTToken = localStorage.getItem("dtvt");
  var decoded = jwt_decode(getJWTToken);
  const idUser = decoded.id;
  const [data, setData] = useState([]);
  const [showModalSnippet, setShowModalSnippet] = useState(false);
  const [showModalAddPeople, setShowModalAddPeople] = useState(false);
  const [codeIntegrationHead, setCodeIntegrationHead] = useState("");
  const [codeIntegrationBody, setCodeIntegrationBody] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [successMessageAddPartner, setSuccessMessageAddPartner] = useState("");
  const [successMessageAddPeople, setSuccessMessageAddPeople] = useState("");
  const [showModalAddPartner, setShowModalAddPartner] = useState(false);
  const [isButtonAddDisabled, setIsButtonAddDisabled] = useState(false);
  const [isButtonAddPeopleDisabled, setIsButtonAddPeopleDisabled] =
    useState(false);
  const [_roleManagerAll, setRoleManagerAll] = useState(false);
  const [_roleManagerBusiness, setRoleManagerBusiness] = useState(false);
  const [_roleUser, setRoleUser] = useState(false);
  const [idBusiness, setIdBusiness] = useState("");
  const [roleName, setRoleName] = useState("");

  const handleModalAddPartnerClose = () => setShowModalAddPartner(false);
  const handleModalAddPartnerShow = () => setShowModalAddPartner(true);
  const handleModalSnippetClose = () => {
    setCodeIntegrationHead("");
    setCodeIntegrationBody("");
    setShowModalSnippet(false);
  };
  const handleModalSnippetShow = (item) => {
    setCodeIntegrationHead(item?.attributes?.codeIntegrationHead);
    setCodeIntegrationBody(item?.attributes?.codeIntegrationBody);
    setShowModalSnippet(true);
  };

  const handleModaAddPeopleShow = () => {
    setShowModalAddPeople(true);
  };
  const handleModalAddPeopleClose = () => {
    setShowModalAddPeople(false);
  };
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
    window.scrollTo(0, 0);
    http
      .get(`users?populate=*&filters[id][$eq]=${idUser}`, {
        headers: {
          Authorization: `Bearer ${getJWTToken}`,
        },
      })
      .then((result) => {
        const role = result.data[0].role.name;
        const businessID = result.data[0].businessId;
        const checkRoleManagerAll = roleManagerAll.find(
          (item) => item.role === role
        );
        const checkRoleManagerBusiness = roleManagerBusiness.find(
          (item) => item.role === role
        );

        const checkRoleUser = roleUser.find((item) => item.role === role);

        switch (role) {
          case checkRoleManagerAll?.role:
            setRoleManagerAll(true);
            setRoleName("roleManagerAll");
            break;
          case checkRoleManagerBusiness?.role:
            setRoleManagerBusiness(true);
            setRoleName("roleManagerBusiness");
            break;
          case checkRoleUser?.role:
            setRoleUser(true);
            setRoleName("checkRoleUser");
            break;
          default:
            break;
        }

        http
          .get(
            _roleManagerAll === true
              ? "businesses?populate=*"
              : `businesses?populate=*&filters[businessId][$eq]=${businessID}`,
            {
              headers: {
                Authorization: `Bearer ${getJWTToken}`,
              },
            }
          )
          .then((response) => {
            const objectData = response.data.data;
            const objectsData = [...objectData];
            setData(objectsData);
          })
          .catch((err) => err);
      });
  }, [
    successMessageAddPartner,
    _roleManagerAll,
    _roleManagerBusiness,
    _roleUser,
  ]);

  const copyToClipboard = (value) => {
    // Sử dụng API Clipboard để sao chép văn bản vào clipboard
    navigator.clipboard
      .writeText(value)
      .then(() => {
        setSuccessMessage("Copy Success");
        // Thao tác sao chép thành công
        console.log("Sao chép thành công: " + value);
      })
      .catch((err) => {
        // Xử lý lỗi khi sao chép không thành công
        console.error("Lỗi khi sao chép: " + err);
      });
  };

  const handleModalSubmitSuccess = (message) => {
    setSuccessMessageAddPartner(message);
  };
  const handleModalAddPeopleSubmitSuccess = (message) => {
    setSuccessMessageAddPeople(message);
  };
  if (successMessage) {
    setTimeout(() => {
      setSuccessMessage(null);
    }, 2000);
  }
  if (successMessageAddPartner) {
    setTimeout(() => {
      setIsButtonAddDisabled(false);
      setSuccessMessageAddPartner(null);
    }, 3000);
  }
  if (successMessageAddPeople) {
    setTimeout(() => {
      setIsButtonAddPeopleDisabled(false);
      setSuccessMessageAddPeople(null);
    }, 3000);
  }
  return (
    <>
      {successMessage && (
        <Alert
          variant="success"
          style={{
            zIndex: "9000",
            position: "fixed",
            left: "50%",
            transform: "translate(-50%,-50%)",
          }}
        >
          <BsFillCheckCircleFill
            style={{ display: "inline", margin: "0 5px" }}
          />{" "}
          {successMessage}
        </Alert>
      )}
      {successMessageAddPartner && (
        <Alert
          variant="success"
          style={{
            zIndex: "9000",
            position: "fixed",
            left: "50%",
            transform: "translate(-50%,-50%)",
          }}
        >
          <BsFillCheckCircleFill
            style={{ display: "inline", margin: "0 5px" }}
          />{" "}
          {successMessageAddPartner}
        </Alert>
      )}
      {successMessageAddPartner === "Fail" && (
        <Alert
          variant="danger"
          style={{
            zIndex: "9000",
            position: "fixed",
            left: "50%",
            transform: "translate(-50%,-50%)",
          }}
        >
          <TiDeleteOutline style={{ display: "inline", margin: "0 5px" }} /> Add
          new partnet Failed.
        </Alert>
      )}

      {successMessageAddPeople && (
        <Alert
          variant="success"
          style={{
            zIndex: "9000",
            position: "fixed",
            left: "50%",
            transform: "translate(-50%,-50%)",
          }}
        >
          <BsFillCheckCircleFill
            style={{ display: "inline", margin: "0 5px" }}
          />{" "}
          <b>Success : </b>{successMessageAddPeople}
        </Alert>
      )}
      {successMessageAddPeople === "Fail" && (
        <Alert
          variant="danger"
          style={{
            zIndex: "9000",
            position: "fixed",
            left: "50%",
            transform: "translate(-50%,-50%)",
          }}
        >
          <TiDeleteOutline style={{ display: "inline", margin: "0 5px" }} /> <b>Fail : </b>Username or email is duplicate. Add new peole failed!
        </Alert>
      )}
      <Box pt={{ base: "180px", md: "80px", xl: "80px" }} w="100%">
        <Form className="custom-search-bar">
          <FormControl
            type="text"
            placeholder="Search"
            className="mr-sm-2 custom-input search"
            id="myInput"
            onKeyUp={fillter}
          />
          {/* <BsSearch className="btnSearch" /> */}
          {_roleManagerAll === true || _roleManagerBusiness === true ? (
            <Button
              variant="primary"
              style={{ margin: "15px 10px 15px 60px" }}
              onClick={handleModalAddPartnerShow}
              disabled={isButtonAddDisabled}
            >
              <CgAddR style={{ display: "inline-block" }} /> Add new partner{" "}
            </Button>
          ) : (
            ""
          )}
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
                      <img
                        style={{
                          borderRadius: "50%",
                          width: "40px",
                          height: "40px",
                          objectFit: "cover",
                        }}
                        src={`${urlStrapi}/${item?.attributes?.avatar?.data?.attributes?.url}`}
                        alt="null"
                      />
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
                      <img
                        style={{
                          borderRadius: "50%",
                          width: "40px",
                          height: "40px",
                          objectFit: "cover",
                        }}
                        src={`${urlStrapi}/${item?.attributes?.avatar?.data?.attributes?.url}`}
                        alt="null"
                      />
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
                  {_roleManagerAll === true || _roleManagerBusiness === true ? (
                    <p
                      className="linkShow"
                      onClick={() => {
                        handleModaAddPeopleShow();
                        setIdBusiness(item?.attributes?.businessId);
                      }}
                      disabled={isButtonAddPeopleDisabled}
                    >
                      {" "}
                      <CgAddR style={{ display: "inline-block" }} /> add people{" "}
                    </p>
                  ) : (
                    ""
                  )}

                  <p
                    className="linkShow"
                    onClick={() => {
                      handleModalSnippetShow(item);
                    }}
                  >
                    {" "}
                    <CgCodeSlash style={{ display: "inline-block" }} /> generate
                    code snippet{" "}
                  </p>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Modal
          show={showModalSnippet}
          onHide={handleModalSnippetClose}
          size="lg"
        >
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
            <div
              style={{
                background: "#e9ecef",
                border: "1px solid #ced4da",
                padding: "18px",
                borderRadius: "2px",
                position: "relative",
              }}
            >
              <span>{codeIntegrationHead}</span>

              <FaRegCopy
                style={{
                  position: "absolute",
                  top: "16px",
                  right: "24px",
                  cursor: "pointer",
                  fontSize: "24px",
                }}
                variant="outline-secondary"
                id="copy-button"
                onClick={() => {
                  copyToClipboard(codeIntegrationHead);
                }}
              />
            </div>
            <br />
            <p>
              Additionally, paste this code immediately after the opening{" "}
              <b>&lt;body&gt;</b> tag:{" "}
            </p>
            <br />
            <div
              style={{
                background: "#e9ecef",
                border: "1px solid #ced4da",
                padding: "18px",
                borderRadius: "2px",
                position: "relative",
              }}
            >
              <span>{codeIntegrationBody}</span>

              <FaRegCopy
                style={{
                  position: "absolute",
                  top: "16px",
                  right: "24px",
                  cursor: "pointer",
                  fontSize: "24px",
                }}
                variant="outline-secondary"
                id="copy-button"
                onClick={() => {
                  copyToClipboard(codeIntegrationBody);
                }}
              />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleModalSnippetClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </Box>
      <ModalAddNewPartner
        showModalAddPartner={showModalAddPartner}
        handleModalAddPartnerClose={handleModalAddPartnerClose}
        getJWTToken={getJWTToken}
        setIsButtonAddDisabled={setIsButtonAddDisabled}
        onSubmitSuccess={handleModalSubmitSuccess}
      />
      <ModalAddPeople
        showModalAddPeople={showModalAddPeople}
        handleModalAddPeopleClose={handleModalAddPeopleClose}
        getJWTToken={getJWTToken}
        setIsButtonAddPeopleDisabled={setIsButtonAddPeopleDisabled}
        onSubmitSuccess={handleModalAddPeopleSubmitSuccess}
        idBusiness={idBusiness}
        roleName={roleName}
      />
    </>
  );
};
export default ListBusiness;
