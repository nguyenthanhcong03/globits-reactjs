import { FormControlLabel, Radio, TextField } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { makeStyles } from "@material-ui/core/styles";
import { useFormik } from "formik";
import MaterialTable from "material-table";
import { observer } from "mobx-react";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import DatePickers from "../../common/staff/DatePickers";
import { useStore } from "../../stores";
import { set } from "lodash";

const useStyles = makeStyles((theme) => ({
  wrapper: {
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
    fetchDepartments,
    pageSize,
    setPageSize,
    totalPages,
    pageIndex,
    handleChangePage,
    selectedDepartment,
    setSelectedDepartment,
    isOpenForm,
    updateDepartment,
    createDepartment,
    parent,
    setParent,
    setIsOpenForm,
  } = departmentStore;
  let departmentParentList = selectedDepartment
    ? departmentList.filter((department) => department?.id !== selectedDepartment?.id)
    : departmentList;
  console.log("departmentParentList", departmentParentList);

  const [selectedRow, setSelectedRow] = useState(null);

  const formik = useFormik({
    initialValues: {
      parent: selectedDepartment?.parent || null,
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
    onSubmit: (values) => {
      // const newValue = { ...values, parent };
      console.log(values);

      try {
        if (selectedDepartment?.id) {
          // updateDepartment(newValue);
        } else {
          // console.log(values);
          createDepartment(values);
        }
        setSelectedRow(null);
        setIsOpenForm(false);
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
          // onClick={() => {
          //   // setParent(rowData);
          //   console.log("hâh");

          //   setSelectedDepartment(rowData);
          // }}
          // control={<Radio checked={parent?.id === rowData?.id || selectedDepartment?.parent?.id === rowData?.id} />}
          control={
            <Radio
              onChange={() => setSelectedRow(rowData)}
              // checked={selectedDepartment?.parent?.id === rowData?.id || selectedRow?.id === rowData?.id}
              checked={
                selectedRow?.id === rowData?.id ||
                (selectedRow === null && selectedDepartment?.parent?.id === rowData?.id)
              }
            />
          }
        />
      ),
      sorting: false,
      filtering: false,
    },

    { title: "Tên phòng ban", field: "name" },
    { title: "Mã phòng ban", field: "code" },
    { title: "Mô tả", field: "description" },
    { title: "Chức năng", field: "func" },
    { title: "Khối ngành", field: "industryBlock" },
  ];
  useEffect(() => {
    fetchDepartments();
  }, []);
  return (
    <>
      <Dialog
        open={isOpenForm}
        onClose={() => setIsOpenForm(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {selectedDepartment?.id ? "Chỉnh sửa phòng ban" : "Thêm mới phòng ban"}
        </DialogTitle>
        <DialogContent>
          <form onSubmit={formik.handleSubmit}>
            <TextField
              className={classes.parentTextField}
              label="Đơn vị trực thuộc"
              variant="outlined"
              color="secondary"
              disabled
              name="parent"
              value={formik.values.parent?.name || selectedRow?.name || ""}
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
            <div className={classes.wrapper}>
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
                label="Ngày thành lập"
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
              <Button variant="contained" color="inherit" onClick={() => setIsOpenForm(false)}>
                Hủy
              </Button>
              <Button type="submit" variant="contained" color="primary">
                Lưu
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
            <MaterialTable
              title={"Danh sách phòng ban"}
              data={departmentParentList}
              columns={columns}
              // parentChildData={(row, rows) => {
              //   var list = rows.find((a) => a.id === row.parentId);
              //   return list;
              //   // rows.find((a) => a.id === row.parentId);
              // }}
              parentChildData={(row, rows) => rows.find((a) => a.id === row.parentId)}
              options={{
                // selection: true,
                actionsColumnIndex: -1,
                paging: true,
                pageSize: pageSize,
                search: false,
                toolbar: true,
                maxBodyHeight: "300px",
                headerStyle: {
                  backgroundColor: "#e3f2fd",
                  // color: "#fff",
                  position: "sticky",
                },
                // rowStyle: (rowData, index) => ({
                //   backgroundColor: index % 2 === 1 ? "rgb(237, 245, 251)" : "#FFF",
                // }),
              }}
              // onSelectionChange={(rows) => {
              //   handleSelectList(rows);
              // }}
              // localization={{
              //   body: {
              //     emptyDataSourceMessage: `${t("general.emptyDataMessageTable")}`,
              //   },
              // }}
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
            <Button
              onClick={() => {
                setOpenDialog(false);
                formik.setFieldValue("parent", selectedRow);
              }}
              color="primary"
            >
              Lưu
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
}

export default observer(DepartmentForm);
