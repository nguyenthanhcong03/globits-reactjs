import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Modal,
  Radio,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import React, { useEffect, useState } from "react";
import { createDepartment, editDepartment } from "./DepartmentService";
import { useFormik } from "formik";
import * as Yup from "yup";

function DepartmentForm({
  isOpenForm,
  onClose,
  selectedDepartment,
  departments,
  loadDepartments,
}) {
  const [isShow, setIsShow] = useState(false);
  const [expanded, setExpanded] = useState({});
  const [selectedId, setSelectedId] = useState(null);

  const handleShow = () => {
    setIsShow(true);
  };

  const handleClose = () => {
    setIsShow(false);
  };

  const handleSelectRow = () => {
    if (selectedId) {
      const selectedRow = departments.find((d) => d.id === selectedId);
      formik.setFieldValue("parent", {
        id: selectedRow.id,
        name: selectedRow.name,
      });
      handleClose();
    }
  };

  const handleToggle = (id) => {
    setExpanded((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleRadioChange = (id) => {
    setSelectedId(id);
  };

  const formik = useFormik({
    initialValues: {
      parent: null,
      name: "",
      code: "",
      description: "",
      industryBlock: "",
      foundedNumber: "",
      foundedDate: new Date(),
      displayOrder: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      code: Yup.string().required("Code is required"),
      description: Yup.string().required("Description is required"),
    }),

    onSubmit: (values) => {
      console.log(values);
      if (selectedDepartment) {
        handleEditDepartment(values);
      } else {
        handleAddDepartment(values);
      }
    },
  });

  const handleAddDepartment = async (values) => {
    try {
      await createDepartment(values);
      onClose();
      loadDepartments();
    } catch (error) {
      console.error("Error creating deparment:", error);
    }
  };

  const handleEditDepartment = async (values) => {
    try {
      await editDepartment(values);
      onClose();
      loadDepartments();
    } catch (error) {
      console.error("Error editing deparment:", error);
    }
  };

  useEffect(() => {
    if (selectedDepartment) {
      formik.setValues(selectedDepartment);
      // formik.setValues({
      //   ...selectedDepartment,
      //   parent: selectedDepartment.parent || null, // Gán giá trị cha nếu có
      // });
      if (selectedDepartment?.parentId) {
        setSelectedId(selectedDepartment.parentId); // Đặt hàng cha được chọn
      }
    }
  }, [selectedDepartment]);

  const renderRows = (departments, level = 0) => {
    return departments.map((department) => (
      <React.Fragment key={department.id}>
        <TableRow>
          <TableCell style={{ paddingLeft: level * 10 }}>
            {department.children && department.children.length > 0 && (
              <IconButton onClick={() => handleToggle(department.id)}>
                {expanded[department.id] ? (
                  <ExpandMoreIcon />
                ) : (
                  <ChevronRightIcon />
                )}
              </IconButton>
            )}
          </TableCell>
          <TableCell style={{ paddingLeft: level * 10 }}>
            <Radio
              checked={selectedId === department.id}
              onChange={() => handleRadioChange(department.id)}
            />
          </TableCell>
          <TableCell>{department.name}</TableCell>
          <TableCell>{department.code}</TableCell>
          <TableCell>{department.description}</TableCell>
        </TableRow>
        {expanded[department.id] &&
          department.children &&
          renderRows(department.children, level + 1)}
      </React.Fragment>
    ));
  };

  return (
    <div>
      <Modal open={isOpenForm} onClose={onClose} style={{ cursor: "pointer" }}>
        <form
          onSubmit={formik.handleSubmit}
          style={{
            width: "1000px",
            zIndex: "1000",
            backgroundColor: "white",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            borderRadius: "5px",
          }}
        >
          <DialogTitle>
            {selectedDepartment ? "Chỉnh sửa phòng ban" : "Thêm mới phòng ban"}
          </DialogTitle>
          <DialogContent
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            <TextField
              placeholder="Đơn vị trực thuộc"
              margin="normal"
              // label="Đơn vị trực thuộc"
              variant="outlined"
              fullWidth
              name="parent"
              value={formik.values.parent?.name}
              // onChange={formik.handleChange}
              InputProps={{
                shrink: true,
                readOnly: true,
                endAdornment: (
                  <Button
                    variant="contained"
                    color="action"
                    onClick={handleShow}
                    style={{ width: "100px" }}
                  >
                    Chọn
                  </Button>
                ),
              }}
            />

            <TextField
              label="Tên phòng ban"
              fullWidth
              variant="outlined"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
            />
            <TextField
              label="Mã phòng ban"
              variant="outlined"
              fullWidth
              name="code"
              value={formik.values.code}
              onChange={formik.handleChange}
            />
            <TextField
              label="Mô tả"
              variant="outlined"
              fullWidth
              name="description"
              value={formik.values.description}
              onChange={formik.handleChange}
            />
            <TextField
              label="Khối ngành"
              variant="outlined"
              fullWidth
              name="industryBlock"
              value={formik.values.industryBlock}
              onChange={formik.handleChange}
            />
            <TextField
              label="Số thành lập"
              variant="outlined"
              fullWidth
              name="foundedNumber"
              value={formik.values.foundedNumber}
              onChange={formik.handleChange}
            />
            <TextField
              id="date"
              label="Ngày thành lập"
              type="date"
              fullWidth
              variant="outlined"
              name="foundedDate"
              // defaultValue="2017-05-24"
              value={formik.values.foundedDate}
              onChange={formik.handleChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              label="Thứ tự hiển thị"
              variant="outlined"
              fullWidth
              name="displayOrder"
              value={formik.values.displayOrder}
              onChange={formik.handleChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose} color="primary">
              Hủy
            </Button>
            <Button color="primary" type="submit">
              {selectedDepartment ? "Lưu" : "Thêm"}
            </Button>
          </DialogActions>
        </form>
      </Modal>
      {isShow && (
        <Dialog open={isShow} onClose={handleClose}>
          <DialogTitle>Chọn phòng ban trực thuộc</DialogTitle>
          <DialogContent>
            <Table
              style={{
                width: "100%",
                backgroundColor: "white",
                margin: "auto",
                border: "1px solid #e1e1e1",
              }}
            >
              <TableHead>
                <TableRow>
                  <TableCell style={{ width: "40px" }}></TableCell>
                  <TableCell style={{ width: "70px" }}></TableCell>
                  <TableCell>Tên phòng ban</TableCell>
                  <TableCell>Mã phòng ban</TableCell>
                  <TableCell>Mô tả</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>{renderRows(departments)}</TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[10, 25, 100]}
              component="div"
              // count={rows.length}
              // rowsPerPage={rowsPerPage}
              // page={currentPage}
              // onPageChange={handleChangePage}
              // onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsShow(false)} color="primary">
              Hủy
            </Button>
            <Button color="primary" type="submit" onClick={handleSelectRow}>
              Lựa chọn
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
}

export default DepartmentForm;
