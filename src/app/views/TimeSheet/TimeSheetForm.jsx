import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import { FieldArray, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";

import {
  IconButton,
  InputLabel,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import Checkbox from "@material-ui/core/Checkbox";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import AddIcon from "@material-ui/icons/Add";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import DeleteIcon from "@material-ui/icons/Delete";
import { Autocomplete } from "@material-ui/lab";
import { observer } from "mobx-react";
import DatePickers from "../../common/staff/DatePickers";
import { useStore } from "../../stores";

const useStyles = makeStyles((theme) => ({
  wrapper: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: theme.spacing(2),
    width: "100%",
    position: "relative",
  },
  buttonWrapper: {
    width: "100%",
    display: "flex",
    justifyContent: "end",
    gap: 10,
    marginTop: 50,
    marginBottom: 20,
  },
  addFamilyMemberBtn: {
    position: "absolute",
    top: 0,
    right: 0,
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "#0056b3",
    },
  },
  familyMembersTable: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: theme.spacing(4), // Adds space between table and the button
  },
  tableHeader: {
    backgroundColor: "#f4f4f4",
  },
  tableCell: {
    border: "1px solid #ddd",
    padding: theme.spacing(1),
    textAlign: "left",
  },
  removeBtn: {
    backgroundColor: "red",
    color: "white",
    border: "none",
    padding: "5px 10px",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "darkred",
    },
  },
}));

export default observer(function TimeSheetForm() {
  const classes = useStyles();
  const { projectStore, staffStore, timeSheetStore } = useStore();
  const { isOpenForm, setIsOpenForm, selectedTimeSheet, search, updateData, saveData, getById } = timeSheetStore;

  const initialValues = {
    id: selectedTimeSheet?.id || null,
    project: selectedTimeSheet?.project || null,
    timeSheetStaff: selectedTimeSheet?.timeSheetStaff || [],
    workingDate: selectedTimeSheet?.workingDate || new Date(),
    startTime: selectedTimeSheet?.startTime || new Date(),
    endTime: selectedTimeSheet?.endTime || new Date(),
    priority: selectedTimeSheet?.priority || "",
    description: selectedTimeSheet?.description || "",
    details: selectedTimeSheet?.details || [
      {
        workingItemTitle: selectedTimeSheet?.details?.workingItemTitle || "",
        emoloyee: selectedTimeSheet?.details?.emoloyee || null,
      },
    ],
  };
  const validationSchema = Yup.object({
    // description: Yup.string()
    //     .required("Mô tả không được để trống")
    //     .max(255, "Mô tả không được vượt quá 255 ký tự"),
    // startTime: Yup.date()
    //     .required("Thời gian bắt đầu không được để trống"),
    // endTime: Yup.date()
    //     .required("Thời gian kết thúc không được để trống"),
    // workingDate: Yup.date()
    //     .required("Ngày làm việc không được để trống"),
    // priority: Yup.string()
    //     .required("Bạn cần chọn mức độ ưu tiên"),
  });
  const onSubmit = async (values, { resetForm }) => {
    console.log(values);

    try {
      if (selectedTimeSheet?.id) {
        // updateData(values);
      } else {
        saveData(values);
      }
      resetForm();
      setIsOpenForm(false);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const selectedProject = projectStore.projectList.find((project) => project.id === selectedTimeSheet?.project?.id);
  console.log(selectedProject);

  // const [staffProject, setStaffProject] = useState(selectedTimeSheet?.timeSheetStaff || []);
  const [staffProject, setStaffProject] = useState(selectedProject?.projectStaff || []);
  const [staffSelecteds, setStaffSelecteds] = useState(selectedTimeSheet?.timeSheetStaff || []);

  useEffect(() => {
    console.log(selectedTimeSheet);
  }, []);

  return (
    <Dialog
      open={isOpenForm}
      onClose={() => setIsOpenForm(false)}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      maxWidth={"md"}
    >
      <DialogTitle id="alert-dialog-title">
        {selectedTimeSheet?.id ? "Chỉnh sửa Time Sheet" : "Thêm mới Time Sheet"}
      </DialogTitle>
      <DialogContent>
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
          {({ values, handleChange, handleBlur, touched, errors, setFieldValue }) => (
            <Form>
              <div className={classes.wrapper}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="nationality-select-label">Dự án</InputLabel>
                  <Select
                    labelId="nationality-select-label"
                    id="nationality-select"
                    name="project"
                    value={values.project?.id || ""}
                    onChange={(event) => {
                      const selectedProjectInput = projectStore.projectList.find(
                        (project) => project.id === event.target.value
                      );
                      setStaffProject(selectedProjectInput ? selectedProjectInput?.projectStaff : []);
                      handleChange({
                        target: {
                          name: "project",
                          value: selectedProjectInput,
                        },
                      });
                      setFieldValue("timeSheetStaff", "");
                    }}
                    label="Dự án"
                    error={touched.project && Boolean(errors.project)}
                  >
                    {projectStore.projectList.map((project) => (
                      <MenuItem key={project.id} value={project?.id}>
                        {project.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  fullWidth
                  label="Mô tả"
                  variant="outlined"
                  name="description"
                  value={values.description}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.description && Boolean(errors.description)}
                  helperText={touched.description && errors.description}
                />
                <DatePickers
                  label="Ngày làm việc"
                  value={values.workingDate}
                  onChange={(date) => {
                    setFieldValue("workingDate", date);
                  }}
                  isTime={false}
                />
                <DatePickers
                  label="Thời gian bắt đầu"
                  value={values.startTime}
                  onChange={(date) => {
                    setFieldValue("startTime", date);
                  }}
                  // isTime={false}
                  ampm={true}
                  isTime={true}
                  // format={"MM/dd/yyyy hh:mm"}
                />
                <DatePickers
                  label="Thời gian kết thúc"
                  value={values.endTime}
                  onChange={(date) => {
                    setFieldValue("endTime", date);
                  }}
                  ampm={true}
                  isTime={true}
                  format={"MM/dd/yyyy hh:mm"}
                />

                <Autocomplete
                  fullWidth
                  multiple
                  options={staffProject}
                  disableCloseOnSelect
                  getOptionLabel={(option) => (option ? `${option.lastName || ""} ${option.firstName || ""}` : "")}
                  renderOption={(option, { selected }) => (
                    <React.Fragment>
                      <Checkbox
                        icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                        checkedIcon={<CheckBoxIcon fontSize="small" />}
                        style={{ marginRight: 8 }}
                        checked={staffSelecteds.some((staff) => staff.id === option?.id)}
                        // checked={selected}
                      />
                      {`${option?.lastName || ""} ${option?.firstName || ""}`}
                    </React.Fragment>
                  )}
                  value={values.timeSheetStaff || []}
                  onChange={(event, newValue) => {
                    console.log(staffSelecteds.find((staff) => staff?.id === newValue[1]?.id));
                    console.log(
                      "ahahhahah",
                      values.timeSheetStaff.filter((staff) => staff?.id !== newValue[1]?.id)
                    );
                    if (!values.timeSheetStaff.find((staff) => staff?.id === newValue[1]?.id)) {
                      setStaffSelecteds(newValue);
                      setFieldValue("timeSheetStaff", newValue);
                    } else {
                      setFieldValue(
                        "timeSheetStaff",
                        values.timeSheetStaff.filter((staff) => staff?.id !== newValue[1]?.id)
                      );
                    }
                  }}
                  renderInput={(params) => (
                    <TextField {...params} variant="outlined" label="Chọn nhân viên" placeholder="Nhân viên" />
                  )}
                />

                <FormControl fullWidth variant="outlined">
                  <InputLabel id="priority-select-label">Độ ưu tiên</InputLabel>
                  <Select
                    labelId="priority-select-label"
                    id="priority-select"
                    name="priority"
                    value={values.priority}
                    onChange={handleChange}
                    label="Độ ưu tiên"
                    error={touched.priority && Boolean(errors.priority)}
                  >
                    <MenuItem value={"1"}>Thấp</MenuItem>
                    <MenuItem value={"2"}>Trung bình</MenuItem>
                    <MenuItem value={"3"}>Cao</MenuItem>
                    <MenuItem value={"4"}>Cấp bách</MenuItem>
                  </Select>
                </FormControl>

                <FieldArray name="details">
                  {({ push, remove }) => (
                    <div className="family-members-container">
                      <Button
                        type="button"
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        className="add-family-member-btn"
                        onClick={() => {
                          push({
                            workingItemTitle: "",
                            employee: null,
                          });
                        }}
                      >
                        Thêm mới
                      </Button>
                      <TableContainer component={Paper}>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell>Tiêu đề</TableCell>
                              <TableCell>Nhân viên</TableCell>
                              <TableCell>Thao tác</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {values.details && values.details.length > 0 ? (
                              values.details.map((item, index) => (
                                <TableRow key={index}>
                                  <TableCell>
                                    <TextField
                                      name={`details[${index}].workingItemTitle`}
                                      placeholder="Tiêu đề"
                                      value={item.workingItemTitle}
                                      onChange={handleChange}
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <FormControl fullWidth>
                                      <InputLabel id={`relationship-select-label-${index}`}>Nhân viên</InputLabel>
                                      <Select
                                        labelId={`relationship-select-label-${index}`}
                                        id={`relationship-select-${index}`}
                                        name={`details[${index}].employee`}
                                        value={item.employee?.id || ""}
                                        onChange={(event) => {
                                          const selected = staffProject.find((item) => item.id === event.target.value);
                                          handleChange({
                                            target: {
                                              name: `details[${index}].employee`,
                                              value: selected,
                                            },
                                          });
                                        }}
                                        label="Nhân viên"
                                      >
                                        {/* {staffSelecteds.map((staffItem) => ( */}
                                        {staffSelecteds.map((staffItem) => (
                                          <MenuItem key={staffItem.id} value={staffItem.id}>
                                            {staffItem.firstName}
                                          </MenuItem>
                                        ))}
                                      </Select>
                                    </FormControl>
                                  </TableCell>
                                  <TableCell>
                                    <IconButton onClick={() => remove(index)}>
                                      <DeleteIcon color="error" />
                                    </IconButton>
                                  </TableCell>
                                </TableRow>
                              ))
                            ) : (
                              <TableRow>
                                <Table colSpan="5">Không có công việc</Table>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </div>
                  )}
                </FieldArray>
              </div>
              <div className={classes.buttonWrapper}>
                <Button variant="contained" color="inherit" onClick={() => setIsOpenForm(false)}>
                  Hủy
                </Button>
                <Button type="submit" variant="contained" color="primary">
                  {selectedTimeSheet?.id ? "Cập nhật" : "Lưu"}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
});
