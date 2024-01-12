import { http } from "../../../../axios/init";
import { useEffect, useState } from "react";
import {
  Button,
  Spinner,
  Modal,
  Table,
  Card,
  CardGroup,
  Row,
  Col,
  Form,
  FormControl,
  Badge,
} from "react-bootstrap";
import { CiEdit } from "react-icons/ci";
import { MdDeleteForever } from "react-icons/md";
import "../styles.css";
import { CgAddR } from "react-icons/cg";
import ModalAddPresets from "./modalAddPresets";
import { ModalDeletePreset } from "./modalDeletePreset";
import { ModalEditPreset } from "./modalEditPresset";

const ModalPresets = ({
  showModalPresets,
  setShowModalPresets,
  handleModalPresetsClose,
  getJWTToken,
  idBusiness,
}) => {
  const [showModalAssetsList, setShowModalAssetsList] = useState(false);
  const [presets, setPresets] = useState([]);
  const [listPresets, setListPresets] = useState([]);
  const [loadedAssets, setLoadedAssets] = useState(false);
  const [showModalAddPreset, setShowModalAddPreset] = useState(false);
  const [showModalDeletePreset, setShowModalDeletePreset] = useState(false);
  const [showModalEditPreset, setShowModalEditPreset] = useState(false);
  const [loadedPresets, setLoadedPresets] = useState(false);
  const [aPresets, setAPresets] = useState("");

  const handleModalAssetsListClose = () => {
    setShowModalAssetsList(false);
    setShowModalPresets(true);
    setPresets([]);
    setLoadedAssets(false);
  };
  const handleModalAddPresetClose = () => {
    setShowModalAddPreset(false);
    setShowModalPresets(true);
  };
  const handleModalDeletePresetClose = () => {
    setShowModalDeletePreset(false);
    setShowModalPresets(true);
  };
  const handleModalEditPresetClose = () => {
    setShowModalEditPreset(false);
    setShowModalPresets(true);
  };
  const getAPreset = (id) => {
    http
      .get(`presets/${id}?populate=*`, {
        headers: {
          Authorization: `Bearer ${getJWTToken}`,
        },
      })
      .then((res) => {
        setLoadedAssets(true);
        setPresets(res.data.data.attributes.assets.data);
      });
  };
  useEffect(() => {
    setLoadedPresets(false);
    if (idBusiness && showModalPresets)
      http
        .get(
          `businesses?populate[presets][populate]=*&populate[avatar][populate]=*&filters[businessId][$eq]=${idBusiness}`,
          {
            headers: {
              Authorization: `Bearer ${getJWTToken}`,
            },
          }
        )
        .then((res) => {
          setListPresets(res.data.data[0].attributes.presets.data);
          setLoadedPresets(true);
        });
  }, [showModalAddPreset === false, showModalPresets]);

  return (
    <>
      <Modal show={showModalPresets} onHide={handleModalPresetsClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Preset</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form className="custom-search-bar">
            <FormControl
              id="myInput"
              type="text"
              placeholder="Search"
              className="mr-sm-2 custom-input"
              style={{ width: "30% !important" }}
            />
            <Button
              variant="primary"
              style={{ margin: "15px 10px 15px 60px" }}
              onClick={() => {
                setShowModalAddPreset(true);
                setShowModalPresets(false);
              }}
            >
              <CgAddR style={{ display: "inline-block" }} /> Add New Preset
            </Button>
          </Form>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Presets name</th>
                <th>Assets</th>
                <th>Action</th>
              </tr>
            </thead>
            {loadedPresets ? (
              <tbody>
                {listPresets.map((data, index) => {
                  return (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{data?.attributes?.preset}</td>
                      <td>
                        <p
                          className="linkShow"
                          onClick={() => {
                            setShowModalAssetsList(true);
                            setShowModalPresets(false);
                            getAPreset(data?.id);
                          }}
                        >
                          <Badge bg="secondary" style={{ padding: "5px 8px" }}>
                            {data?.attributes?.assets?.data?.length}
                          </Badge>
                        </p>
                      </td>
                      <td>
                        <Button
                          variant="success"
                          style={{ margin: "5px" }}
                          onClick={() => {
                            setShowModalEditPreset(true);
                            setShowModalPresets(false);
                            setAPresets(
                              data?.id + "&" + data?.attributes?.preset
                            );
                          }}
                        >
                          <CiEdit style={{ display: "inline-block" }} />
                        </Button>
                        <Button
                          variant="danger"
                          onClick={() => {
                            setShowModalDeletePreset(true);
                            setShowModalPresets(false);
                            setAPresets(
                              data?.id + "&" + data?.attributes?.preset
                            );
                          }}
                        >
                          <MdDeleteForever
                            style={{ display: "inline-block" }}
                          />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            ) : (
              <div style={{ margin: "10px 30px" }}>
                <br />
                <Spinner animation="border" />
              </div>
            )}
          </Table>
        </Modal.Body>
      </Modal>

      <Modal
        show={showModalAssetsList}
        onHide={handleModalAssetsListClose}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Assets List</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <CardGroup>
            {!loadedAssets ? (
              <div>
                <br />
                <Spinner animation="border" />
              </div>
            ) : (
              <Row>
                {presets.map((data, index) => {
                  return (
                    <Col sm={4}>
                      <Card key={index}>
                        <Card.Img
                          variant="top"
                          src={data.attributes.thumbnail}
                        />
                        <Card.Body>
                          <Card.Title>{data.attributes.name}</Card.Title>
                          <Card.Text>{data.attributes.description}</Card.Text>
                        </Card.Body>
                      </Card>
                    </Col>
                  );
                })}
              </Row>
            )}
          </CardGroup>
        </Modal.Body>
      </Modal>

      <ModalAddPresets
        showModalAddPreset={showModalAddPreset}
        handleModalAddPresetClose={handleModalAddPresetClose}
        idBusiness={idBusiness}
        getJWTToken={getJWTToken}
      />

      <ModalDeletePreset
        showModalDeletePreset={showModalDeletePreset}
        handleModalDeletePresetClose={handleModalDeletePresetClose}
        idBusiness={idBusiness}
        getJWTToken={getJWTToken}
        aPresets={aPresets}
      />

      <ModalEditPreset
        showModalEditPreset={showModalEditPreset}
        handleModalEditPresetClose={handleModalEditPresetClose}
        idBusiness={idBusiness}
        getJWTToken={getJWTToken}
        aPresets={aPresets}
      />
    </>
  );
};

export default ModalPresets;
