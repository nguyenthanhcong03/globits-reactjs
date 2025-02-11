import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Checkbox from "@material-ui/core/Checkbox";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";

import { observer } from "mobx-react";
import { useStore } from "../../stores";
import { updateProject } from "./ProjectService";
import { TextareaAutosize } from "@material-ui/core";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const useStyles = makeStyles((theme) => ({
  formContainer: {
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(2),
    width: "600px",
  },

  buttonWrapper: {
    width: "100%",
    display: "flex",
    justifyContent: "end",
    gap: 10,
    marginTop: 50,
    marginBottom: 20,
  },
}));

export default observer(function ProjectForm() {
  const classes = useStyles();
  const { staffStore, projectStore } = useStore();
  const { staffList } = staffStore;
  const { isOpenForm, setIsOpenForm, selectedProject, createProject } = projectStore;

  const initialValues = {
    id: selectedProject?.id || "",
    name: selectedProject?.name || "",
    code: selectedProject?.code || "",
    description: selectedProject?.description || "",
    projectStaff: selectedProject?.projectStaff || [],
  };
  const validationSchema = Yup.object({});
  const onSubmit = async (values, { resetForm }) => {
    try {
      if (selectedProject?.id) {
        updateProject(values);
      } else {
        createProject(values);
      }
      setIsOpenForm(false);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  useEffect(() => {
    projectStore.fetchProjects();
    staffStore.fetchStaffs();
  }, []);
  return (
    <Dialog
      open={isOpenForm}
      onClose={() => setIsOpenForm(false)}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      maxWidth={"md"}
    >
      <DialogTitle id="alert-dialog-title">{selectedProject?.id ? "Chỉnh sửa dự án" : "Thêm mới dự án"}</DialogTitle>
      <DialogContent>
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
          {({ values, handleChange, handleBlur, touched, errors, setFieldValue }) => (
            <Form>
              <div className={classes.formContainer}>
                <TextField
                  label="Mã dự án"
                  variant="outlined"
                  name="code"
                  value={values.code}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.code && Boolean(errors.code)}
                  helperText={touched.code && errors.code}
                />
                <TextField
                  label="Tên dự án"
                  variant="outlined"
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.name && Boolean(errors.name)}
                  helperText={touched.name && errors.name}
                />
                <TextField
                  label="Mô tả dự án"
                  variant="outlined"
                  name="description"
                  value={values.description}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.description && Boolean(errors.description)}
                  helperText={touched.description && errors.description}
                />
                <Autocomplete
                  multiple
                  options={staffList || []}
                  disableCloseOnSelect
                  getOptionLabel={(option) => `${option?.firstName || ""} ${option?.lastName || ""}`}
                  renderOption={(option, { selected }) => (
                    <>
                      <Checkbox icon={icon} checkedIcon={checkedIcon} style={{ marginRight: 8 }} checked={selected} />
                      {`${option?.lastName || ""} ${option?.firstName || ""}`}
                    </>
                  )}
                  value={values.projectStaff}
                  onChange={(event, newValue) => {
                    setFieldValue("projectStaff", newValue);
                  }}
                  renderInput={(params) => (
                    <TextField {...params} variant="outlined" label="Chọn nhân viên vào dự án" />
                  )}
                />
              </div>
              <div className={classes.buttonWrapper}>
                <Button variant="contained" color="inherit" onClick={() => setIsOpenForm(false)}>
                  Hủy
                </Button>
                <Button type="submit" variant="contained" color="primary">
                  {selectedProject?.id ? "Cập nhật" : "Lưu"}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
});
