import { http } from "../../../../axios/init";
import { useEffect, useState } from "react";
import { Form, Modal, Button, Spinner } from "react-bootstrap";

export default function ModalAddPresets(props) {
  const [listAssets, setListAssets] = useState([]);
  const [validated, setValidated] = useState(false);
  const [presetName, setPresetName] = useState("");
  const [checkedItems, setCheckedItems] = useState({});
  const [validateAssetList, setValidateAssetList] = useState(false);
  const [loadedAssets, setLoadedAssets] = useState(false);
  const [disabledSubmit, setDisabledSubmit] = useState(false);

  const matchResult = props.idBusiness.match(/([^&]+)&id=(\d+)/);
  const idBusiness = matchResult ? matchResult[1] : "";
  const idDefaultBusiness = matchResult ? matchResult[2] : "";
  const handleAddPreset = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    setValidated(true);

    const filteredAssets = Object.fromEntries(
      Object.entries(checkedItems).filter(([key, value]) => value)
    );

    // Kiểm tra xem object sau khi lọc có đang rỗng không
    const isEmptyAssets = Object.keys(filteredAssets).length === 0;
    const arrayOfAssets = Object.keys(filteredAssets);
    //Kiểm tra chuỗi nếu không bị rỗng
    if (!isEmptyAssets || isEmptyAssets) {
      setValidateAssetList(false);
      if (presetName) {
        setDisabledSubmit(true);
        http
          .post(
            `/presets`,
            {
              data: {
                preset: presetName,
                business: idDefaultBusiness,
                assets: arrayOfAssets.length > 0 ? arrayOfAssets : null,
              },
            },
            {
              headers: {
                Authorization: `Bearer ${props.getJWTToken}`,
              },
            }
          )
          .then((res) => {
            props.handleModalAddPresetClose();
            setPresetName("");
            setListAssets([]);
            setCheckedItems({});
            setDisabledSubmit(false);
          });
      }
    } else {
      setValidateAssetList(true);
    }
  };
  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setCheckedItems((prevCheckedItems) => ({
      ...prevCheckedItems,
      [name]: checked,
    }));
  };
  useEffect(() => {
    setListAssets([]);
    setLoadedAssets(false);
    http
      .get(`products?filters[businessId][$eq]=${props.idBusiness}&populate=*`, {
        headers: {
          Authorization: `Bearer ${props.getJWTToken}`,
        },
      })
      .then((data) => {
        const arrAssets = data.data.data.map(
          (data) => data.attributes.assets.data
        );
        setListAssets(arrAssets);
        setLoadedAssets(true);
      });
    setValidated(false);
    setValidateAssetList(false);
  }, [props.showModalAddPreset === true]);
  return (
    <Modal
      show={props.showModalAddPreset}
      onHide={props.handleModalAddPresetClose}
      aria-labelledby="contained-modal-title-vcenter"
      size="lg"
      backdrop="static"
      keyboard={false}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Add new preset</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form noValidate validated={validated}>
          <Form.Group
            controlId="validationBusinessId"
            style={{
              margin: "5px 0",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <Form.Label>Business ID</Form.Label>

            <Form.Control type="text" value={idBusiness} disabled />
          </Form.Group>

          <Form.Group
            controlId="validationPresetName"
            style={{
              margin: "5px 0",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <Form.Label>Preset name</Form.Label>

            <Form.Control
              type="text"
              value={presetName}
              onChange={(evt) => setPresetName(evt.target.value)}
              required
            />
            <Form.Control.Feedback type="invalid">
              Please enter name of preset
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group
            style={{
              margin: "5px 0",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <Form.Label>Choose assets</Form.Label>
            {validateAssetList && (
              <Form.Control.Feedback
                style={{ color: "#dc3545", display: "block" }}
              >
                Please choose assets
              </Form.Control.Feedback>
            )}
            {!loadedAssets ? (
              <div>
                <br />
                <Spinner animation="border" />
              </div>
            ) : (
              <div>
                {listAssets.map((data) =>
                  data.map((result, index) => {
                    return (
                      <div
                        style={{
                          float: "left",
                          width: "180px",
                          margin: "5px",
                          padding: "0 15px",
                          background: "#dddddd",
                          borderRadius: "10px",
                        }}
                        key={index}
                      >
                        <Form.Check key={index}>
                          <Form.Check.Input
                            type="checkbox"
                            name={result.id}
                            onChange={handleCheckboxChange}
                            disabled
                          />
                          <Form.Check.Label
                            onClick={(e) => {
                              e.preventDefault();
                            }}
                          >
                            {<img src={result.attributes.thumbnail} />}
                          </Form.Check.Label>
                        </Form.Check>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </Form.Group>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={props.handleModalAddPresetClose}>
          Close
        </Button>
        <Button
          variant="primary"
          onClick={handleAddPreset}
          disabled={disabledSubmit}
        >
          Save changes
          {disabledSubmit && (
            <Spinner
              animation="border"
              size="sm"
              style={{ verticalAlign: "middle", marginLeft: "8px" }}
            />
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
