import { FormControlLabel, Radio, TextField } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { makeStyles } from "@material-ui/core/styles";
import { useFormik } from "formik";
import { observer } from "mobx-react";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import DatePickers from "../../common/staff/DatePickers";
import TableCustom from "../../common/staff/TableCustom";
import { useStore } from "../../stores";

const useStyles = makeStyles((theme) => ({
  wapper: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: theme.spacing(2),
  },
  itemInput: {
    width: "45%",
  },
  buttonWrapper: {
    width: "100%",
    display: "flex",
    justifyContent: "end",
    gap: 10,
    marginTop: 50,
    marginBottom: 20,
  },
  dialogTitleText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: "18px",
  },
  parent: {
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(2),
    width: "100%",
    display: "flex",
    position: "relative",
  },
  parentTextField: {
    marginBottom: theme.spacing(2),
    width: "100%",
  },
  parentButton: {
    // position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "#7467EF",
  },
}));

function DepartmentForm() {
  const [openDialog, setOpenDialog] = useState(false);
  const classes = useStyles();
  const { departmentStore } = useStore();
  const {
    departmentList,
    pageSize,
    setPageSize,
    totalPages,
    pageIndex,
    handleChangePage,
    selectedDepartment,
    shouldOpenEditorDialog,
    updateDepartment,
    createDepartment,
    parent,
    setParent,
    setShouldOpenEditorDialog,
  } = departmentStore;
  const formik = useFormik({
    initialValues: {
      id: selectedDepartment?.id || "",
      name: selectedDepartment?.name || "",
      code: selectedDepartment?.code || "",
      description: selectedDepartment?.description || "",
      func: selectedDepartment?.func || "",
      industryBlock: selectedDepartment?.industryBlock || "",
      foundedNumber: selectedDepartment?.foundedNumber || "",
      foundedDate: selectedDepartment?.foundedDate
        ? new Date(selectedDepartment.foundedDate).toISOString().split("T")[0]
        : "",
      displayOrder: selectedDepartment?.displayOrder || "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      name: Yup.string().min(2, "Ít nhất 2 ký tự").max(15, "Nhiều nhất 15 ký tự").required("Không được bỏ trống!"),
      code: Yup.string().min(2, "Ít nhất 2 ký tự").max(15, "Nhiều nhất 15 ký tự").required("Không được bỏ trống!"),
      description: Yup.string()
        .min(5, "Ít nhất 5 ký tự")
        .max(500, "Nhiều nhất 500 ký tự")
        .required("Không được bỏ trống!"),
      func: Yup.string().min(2, "Ít nhất 2 ký tự").max(50, "Nhiều nhất 50 ký tự").required("Không được bỏ trống!"),
      industryBlock: Yup.string()
        .min(2, "Ít nhất 2 ký tự")
        .max(100, "Nhiều nhất 100 ký tự")
        .required("Không được bỏ trống!"),
      foundedNumber: Yup.number()
        .positive("Số thành lập phải là số dương")
        .integer("Số thành lập phải là số nguyên")
        .required("Không được bỏ trống!"),
      displayOrder: Yup.number()
        .integer("Hiển thị thứ tự phải là số nguyên")
        .min(1, "Thứ tự hiển thị phải lớn hơn hoặc bằng 1")
        .required("Không được bỏ trống!"),
    }),
    onSubmit: async (values, { resetForm }) => {
      const valuesUpdate = {
        ...values,
        parent,
      };
      try {
        if (selectedDepartment?.id) {
          updateDepartment(valuesUpdate);
        } else {
          createDepartment(valuesUpdate);
        }
        resetForm();
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    },
  });
  const columns = [
    {
      title: "Chọn",
      render: (rowData) => (
        <FormControlLabel
          onClick={() => {
            setParent(rowData);
          }}
          control={<Radio checked={parent?.id === rowData?.id || selectedDepartment?.parent?.id === rowData?.id} />}
        />
      ),
      sorting: false,
      filtering: false,
    },
    {
      title: "Phòng ban trực thuộc",
      render: (rowData) => (rowData?.parent?.name ? rowData?.parent?.name : "Không có"),
    },
    { title: "Tên phòng ban", field: "name" },
    { title: "Mã phòng ban", field: "code" },
    { title: "Mô tả", field: "description" },
    { title: "Chức năng", field: "func" },
    { title: "Khối ngành", field: "industryBlock" },
    { title: "Số thành lập", field: "foundedNumber" },
    { title: "Ngày thành lập", field: "foundedDate" },
    { title: "Thứ tự hiển thị", field: "displayOrder" },
  ];
  useEffect(() => {
    formik.resetForm();
  }, [openDialog]);
  return (
    <>
      <Dialog
        open={shouldOpenEditorDialog}
        onClose={() => setShouldOpenEditorDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {selectedDepartment?.id ? "Chỉnh sửa phòng ban" : "Thêm mới phòng ban"}
        </DialogTitle>
        <DialogContent>
          <div className={classes.parent}>
            <TextField
              className={classes.parentTextField}
              label="Đơn vị trực thuộc"
              variant="outlined"
              color="secondary"
              disabled
              value={selectedDepartment?.parent?.name ? selectedDepartment.name : parent?.name || ""}
              InputProps={{
                shrink: true,
                readOnly: true,
                endAdornment: (
                  <Button
                    variant="contained"
                    color="action"
                    onClick={() => setOpenDialog(true)}
                    style={{ width: "100px" }}
                  >
                    Chọn
                  </Button>
                ),
              }}
            />
          </div>
          <form onSubmit={formik.handleSubmit}>
            <div className={classes.wapper}>
              <TextField
                className={classes.itemInput}
                label="Tên phòng ban"
                variant="outlined"
                color="secondary"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
              />
              <TextField
                className={classes.itemInput}
                label="Mã phòng ban"
                variant="outlined"
                color="secondary"
                name="code"
                value={formik.values.code}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.code && Boolean(formik.errors.code)}
                helperText={formik.touched.code && formik.errors.code}
              />
              <TextField
                className={classes.itemInput}
                label="Mô tả"
                variant="outlined"
                color="secondary"
                name="description"
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.description && Boolean(formik.errors.description)}
                helperText={formik.touched.description && formik.errors.description}
              />

              <TextField
                className={classes.itemInput}
                label="Chức năng"
                variant="outlined"
                color="secondary"
                name="func"
                value={formik.values.func}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.func && Boolean(formik.errors.func)}
                helperText={formik.touched.func && formik.errors.func}
              />

              <TextField
                className={classes.itemInput}
                label="Khối ngành"
                variant="outlined"
                color="secondary"
                name="industryBlock"
                value={formik.values.industryBlock}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.industryBlock && Boolean(formik.errors.industryBlock)}
                helperText={formik.touched.industryBlock && formik.errors.industryBlock}
              />
              <TextField
                className={classes.itemInput}
                label="Số thành lập"
                variant="outlined"
                color="secondary"
                name="foundedNumber"
                type="number"
                value={formik.values.foundedNumber}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.foundedNumber && Boolean(formik.errors.foundedNumber)}
                helperText={formik.touched.foundedNumber && formik.errors.foundedNumber}
              />
              <DatePickers
                labelDate="Ngày thành lập"
                value={formik.values.foundedDate ? formik.values.foundedDate : new Date()}
                onChange={(date) => formik.setFieldValue("foundedDate", date)}
                isTime={false}
                className={classes.itemInput}
              />
              <TextField
                className={classes.itemInput}
                label="Thứ tự hiển thị"
                variant="outlined"
                color="secondary"
                name="displayOrder"
                type="number"
                value={formik.values.displayOrder}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.displayOrder && Boolean(formik.errors.displayOrder)}
                helperText={formik.touched.displayOrder && formik.errors.displayOrder}
              />
            </div>
            <div className={classes.buttonWrapper}>
              <Button variant="contained" color="inherit" onClick={() => setShouldOpenEditorDialog(false)}>
                Hủy
              </Button>
              <Button type="submit" variant="contained" color="primary">
                {selectedDepartment?.id ? "Lưu" : "Lưu"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      {openDialog && (
        <Dialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent>
            <TableCustom
              rowsPerPage={pageSize}
              setRowsPerPage={setPageSize}
              totalPages={totalPages}
              page={pageIndex}
              handleChangePage={handleChangePage}
              title={"Lựa chọn phòng ban"}
              datas={departmentList}
              columns={columns}
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setOpenDialog(false);
                setParent(null);
              }}
              color="primary"
            >
              Đóng
            </Button>
            <Button onClick={() => setOpenDialog(false)} color="primary">
              Lưu
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
}

export default observer(DepartmentForm);
