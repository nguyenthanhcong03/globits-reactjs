import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Field, FieldArray, Form, Formik } from "formik";
import * as Yup from "yup";
import {
  Box,
  Grid,
  IconButton,
  InputLabel,
  Paper,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TextField,
} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import Typography from "@material-ui/core/Typography";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { observer } from "mobx-react";
import { useStore } from "../../stores";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import { Table, TableRow } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";
import { Autocomplete } from "@material-ui/lab";

const useStyles = makeStyles((theme) => ({
  wrapper: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: theme.spacing(2),
    width: "100%",
    // position: "relative", // Added for absolute positioning of button
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

export default observer(function StaffForm() {
  const classes = useStyles();
  const { staffStore, departmentStore, countryStore, ethnicsStore, religionStore, familyRelationshipStore } =
    useStore();

  const { countryList } = countryStore;
  const { religionList } = religionStore;
  const { ethnicList } = ethnicsStore;

  const { isOpenForm, setIsOpenForm, selectedStaff, updateStaff, createStaff } = staffStore;

  const initialValues = {
    // id: selectedStaff?.id || "",
    firstName: selectedStaff?.firstName || "",
    lastName: selectedStaff?.lastName || "",
    displayName: "",
    gender: selectedStaff?.gender || "",
    birthDate: selectedStaff?.birthDate || "",
    birthPlace: selectedStaff?.birthPlace || "",
    permanentResidence: selectedStaff?.permanentResidence || "",
    currentResidence: selectedStaff?.currentResidence || "",
    email: selectedStaff?.email || "",
    phoneNumber: selectedStaff?.phoneNumber || "",
    idNumber: selectedStaff?.idNumber || "",
    nationality: selectedStaff?.nationality || null,
    ethnics: selectedStaff?.ethnics || null,
    religion: selectedStaff?.religion || null,
    department: selectedStaff?.department || null,
    familyRelationships: selectedStaff?.familyRelationships || [
      {
        fullName: "",
        profession: "",
        familyRelationship: null,
        address: "",
        description: "",
      },
    ],
  };
  const validationSchema = Yup.object({
    // firstName: Yup.string()
    //     .min(2, "Ít nhất 2 ký tự")
    //     .max(50, "Tối đa 50 ký tự")
    //     .required("Không được bỏ trống!"),
    // lastName: Yup.string()
    //     .min(2, "Ít nhất 2 ký tự")
    //     .max(50, "Tối đa 50 ký tự")
    //     .required("Không được bỏ trống!"),
    // displayName: Yup.string()
    //     .min(2, "Ít nhất 2 ký tự")
    //     .max(100, "Tối đa 100 ký tự")
    //     .required("Không được bỏ trống!"),
    // gender: Yup.string()
    //     .oneOf(["M", "F", "U"], "Giới tính không hợp lệ")
    //     .required("Không được bỏ trống!"),
    // birthDate: Yup.date()
    //     .required("Ngày sinh không được bỏ trống!")
    //     .max(new Date(), "Ngày sinh không thể trong tương lai"),
    // birthPlace: Yup.string()
    //     .max(100, "Tối đa 100 ký tự")
    //     .required("Nơi sinh không được bỏ trống!"),
    // permanentResidence: Yup.string()
    //     .max(100, "Tối đa 100 ký tự")
    //     .required("Nơi cư trú thường xuyên không được bỏ trống!"),
    // currentResidence: Yup.string()
    //     .max(100, "Tối đa 100 ký tự")
    //     .required("Nơi cư trú hiện tại không được bỏ trống!"),
    // email: Yup.string()
    //     .email("Địa chỉ email không hợp lệ")
    //     .required("Không được bỏ trống!"),
    // phoneNumber: Yup.string()
    //     .matches(/^[0-9]{10}$/, "Số điện thoại phải gồm 10 chữ số")
    //     .required("Không được bỏ trống!"),
    // idNumber: Yup.string()
    //     .matches(/^[0-9]{9}$/, "Số CMND phải gồm 9 chữ số")
    //     .required("Không được bỏ trống!"),
    // familyRelationships: Yup.array().of(
    //     Yup.object().shape({
    //         name: Yup.string().required("Required"),
    //         age: Yup.number().required("Required").min(1, "Invalid age"),
    //         relationship: Yup.string().required("Required")
    //     })
    // )
  });

  const onSubmit = async (values, { resetForm }) => {
    console.log(values);
    try {
      if (selectedStaff?.id) {
        updateStaff(values);
      } else {
        createStaff(values);
      }
      setIsOpenForm(false);
      resetForm();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };
  useEffect(() => {
    countryStore.setPageSize(200);
    countryStore.fetchCountries();
    departmentStore.fetchDepartments();
    familyRelationshipStore.fetchFamilyRelationships();
    staffStore.fetchStaffs();
    ethnicsStore.getAllEthnic();
    ethnicsStore.search();
    religionStore.search();
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
        {selectedStaff?.id ? "Chỉnh sửa nhân viên" : "Thêm mới nhân viên"}
      </DialogTitle>
      <DialogContent>
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
          {({ values, handleChange, handleBlur, setFieldValue, handleSubmit, touched, errors }) => (
            <Form>
              <Grid container spacing={3}>
                {/* 1. Thông tin cá nhân */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom className={classes.section}>
                    1. Thông tin cá nhân
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Tên"
                        variant="outlined"
                        name="firstName"
                        value={values.firstName}
                        // onChange={handleChange}
                        onChange={(e) => {
                          const firstName = e.target.value;
                          setFieldValue("firstName", firstName);
                          setFieldValue("displayName", `${values.lastName} ${firstName}`);
                        }}
                        onBlur={handleBlur}
                        error={touched.firstName && Boolean(errors.firstName)}
                        helperText={touched.firstName && errors.firstName}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Họ"
                        variant="outlined"
                        name="lastName"
                        value={values.lastName}
                        // onChange={handleChange}
                        onChange={(e) => {
                          const lastName = e.target.value;
                          setFieldValue("lastName", lastName);
                          setFieldValue("displayName", `${lastName} ${values.firstName}`);
                        }}
                        onBlur={handleBlur}
                        error={touched.lastName && Boolean(errors.lastName)}
                        helperText={touched.lastName && errors.lastName}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Họ và tên"
                        variant="outlined"
                        name="displayName"
                        // value={values.lastName + " " + values.firstName}
                        value={`${values.lastName} ${values.firstName}`}
                        // onChange={handleChange}
                        disabled
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <FormControl fullWidth variant="outlined">
                        <InputLabel id="gender-select-label">Giới tính</InputLabel>
                        <Select
                          labelId="gender-select-label"
                          id="gender-select"
                          name="gender"
                          value={values.gender}
                          onChange={handleChange}
                          label="Giới tính"
                          error={touched.gender && Boolean(errors.gender)}
                        >
                          <MenuItem value={"F"}>Nam</MenuItem>
                          <MenuItem value={"M"}>Nữ</MenuItem>
                          <MenuItem value={"U"}>Không rõ</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Ngày sinh"
                        variant="outlined"
                        name="birthDate"
                        type="date"
                        value={values.birthDate}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        error={touched.birthDate && Boolean(errors.birthDate)}
                        helperText={touched.birthDate && errors.birthDate}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Nơi sinh"
                        variant="outlined"
                        name="birthPlace"
                        value={values.birthPlace}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.birthPlace && Boolean(errors.birthPlace)}
                        helperText={touched.birthPlace && errors.birthPlace}
                      />
                    </Grid>
                  </Grid>
                </Grid>

                {/* 2. Thông tin liên hệ */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom className={classes.section}>
                    2. Thông tin liên hệ
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Nơi thường trú"
                        variant="outlined"
                        name="permanentResidence"
                        value={values.permanentResidence}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.permanentResidence && Boolean(errors.permanentResidence)}
                        helperText={touched.permanentResidence && errors.permanentResidence}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Nơi ở hiện tại"
                        variant="outlined"
                        name="currentResidence"
                        value={values.currentResidence}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.currentResidence && Boolean(errors.currentResidence)}
                        helperText={touched.currentResidence && errors.currentResidence}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Email"
                        variant="outlined"
                        name="email"
                        value={values.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.email && Boolean(errors.email)}
                        helperText={touched.email && errors.email}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Số điện thoại"
                        variant="outlined"
                        name="phoneNumber"
                        value={values.phoneNumber}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.phoneNumber && Boolean(errors.phoneNumber)}
                        helperText={touched.phoneNumber && errors.phoneNumber}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Số CCCD/CMND"
                        variant="outlined"
                        name="idNumber"
                        value={values.idNumber}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.idNumber && Boolean(errors.idNumber)}
                        helperText={touched.idNumber && errors.idNumber}
                      />
                    </Grid>
                  </Grid>
                </Grid>

                {/* 3. Thông tin quốc tịch, dân tộc, tôn giáo */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom className={classes.section}>
                    3. Thông tin quốc tịch, dân tộc, tôn giáo
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <FormControl fullWidth variant="outlined">
                        <InputLabel id="nationality-select-label">Quốc tịch</InputLabel>
                        <Select
                          labelId="nationality-select-label"
                          id="nationality-select"
                          name="nationality"
                          value={values.nationality?.id || ""}
                          onChange={(event) => {
                            const selectedCountry = countryList.find((country) => country.id === event.target.value);
                            handleChange({
                              target: {
                                name: "nationality",
                                value: selectedCountry,
                              },
                            });
                          }}
                          label="Quốc tịch"
                          error={touched.nationality && Boolean(errors.nationality)}
                        >
                          {countryList.map((country) => (
                            <MenuItem key={country.id} value={country?.id}>
                              {country.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                      <FormControl fullWidth variant="outlined">
                        <InputLabel id="ethnics-select-label">Dân tộc</InputLabel>
                        <Select
                          labelId="ethnics-select-label"
                          id="ethnics-select"
                          name="ethnics"
                          value={values.ethnics?.id || ""}
                          onChange={(event) => {
                            const selectedEthnic = ethnicList.find((ethnic) => ethnic.id === event.target.value);
                            handleChange({
                              target: {
                                name: "ethnics",
                                value: selectedEthnic,
                              },
                            });
                          }}
                          label="Dân tộc"
                          error={touched.ethnics && Boolean(errors.ethnics)}
                        >
                          {ethnicList.map((ethnic) => (
                            <MenuItem key={ethnic.id} value={ethnic.id}>
                              {ethnic.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                      <FormControl fullWidth variant="outlined">
                        <InputLabel id="religion-select-label">Tôn giáo</InputLabel>
                        <Select
                          labelId="religion-select-label"
                          id="religion-select"
                          name="religion"
                          value={values.religion?.id || ""}
                          onChange={(event) => {
                            const selectedReligion = religionList.find(
                              (religion) => religion.id === event.target.value
                            );
                            handleChange({
                              target: {
                                name: "religion",
                                value: selectedReligion,
                              },
                            });
                          }}
                          label="Tôn giáo"
                          error={touched.religion && Boolean(errors.religion)}
                        >
                          {religionList.map((religion) => (
                            <MenuItem key={religion.id} value={religion.id}>
                              {religion.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                </Grid>

                {/* 4. Thông tin phòng ban */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom className={classes.section}>
                    4. Thông tin phòng ban
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <FormControl fullWidth variant="outlined">
                        <InputLabel id="department-select-label">Phòng ban</InputLabel>
                        <Select
                          labelId="department-select-label"
                          id="department-select"
                          name="department"
                          value={values.department?.id || ""}
                          onChange={(event) => {
                            const selectedDepartment = departmentStore.departmentList.find(
                              (department) => department.id === event.target.value
                            );
                            handleChange({
                              target: {
                                name: "department",
                                value: selectedDepartment,
                              },
                            });
                          }}
                          label="Phòng ban"
                          error={touched.department && Boolean(errors.department)}
                        >
                          {departmentStore.departmentList.map((department) => (
                            <MenuItem key={department?.id} value={department?.id}>
                              {department?.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                </Grid>

                {/* 5. Thông tin gia đình */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom className={classes.section}>
                    5. Thông tin gia đình
                  </Typography>
                  <FieldArray name="familyRelationships">
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
                              fullName: "",
                              profession: "",
                              address: "",
                              description: "",
                            });
                          }}
                        >
                          Thêm mới thân nhân
                        </Button>
                        <TableContainer component={Paper}>
                          <Table>
                            <TableHead>
                              <TableRow>
                                <TableCell>Tên</TableCell>
                                <TableCell>Nghề nghiệp</TableCell>
                                <TableCell>Ngày sinh</TableCell>
                                <TableCell>Quan hệ</TableCell>
                                <TableCell>Địa chỉ</TableCell>
                                <TableCell>Mô tả</TableCell>
                                <TableCell>Thao tác</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {values.familyRelationships && values.familyRelationships.length > 0 ? (
                                values.familyRelationships.map((familyMember, index) => (
                                  <TableRow key={index}>
                                    <TableCell>
                                      <TextField
                                        name={`familyRelationships.${index}.fullName`}
                                        placeholder="Họ và tên"
                                        value={familyMember.fullName}
                                        onChange={handleChange}
                                      />
                                    </TableCell>
                                    <TableCell>
                                      <TextField
                                        name={`familyRelationships.${index}.profession`}
                                        placeholder="Nghề nghiệp"
                                        value={familyMember.profession}
                                        onChange={handleChange}
                                      />
                                    </TableCell>
                                    <TableCell>
                                      <TextField
                                        name={`familyRelationships[${index}].birthDate`}
                                        placeholder="Ngày sinh"
                                        type="date"
                                        // value={familyMember.birthDate}
                                        onChange={handleChange}
                                        // onBlur={handleBlur}
                                        InputLabelProps={{
                                          shrink: true,
                                        }}
                                        // error={
                                        //   touched.birthDate &&
                                        //   Boolean(errors.birthDate)
                                        // }
                                        // helperText={
                                        //   touched.birthDate &&
                                        //   errors.birthDate
                                        // }
                                      />
                                    </TableCell>
                                    <TableCell>
                                      <FormControl fullWidth>
                                        <InputLabel id={`relationship-select-label-${index}`}>Quan hệ</InputLabel>
                                        <Select
                                          labelId={`relationship-select-label-${index}`}
                                          id={`relationship-select-${index}`}
                                          name={`familyRelationships.${index}.familyRelationship`} // Tên trường để lưu giá trị chọn
                                          value={familyMember.familyRelationship?.id || ""} // Giá trị mặc định là rỗng nếu chưa chọn
                                          onChange={(event) => {
                                            const selected = familyRelationshipStore.familyList.find(
                                              (item) => item.id === event.target.value
                                            );
                                            handleChange({
                                              target: {
                                                name: `familyRelationships.${index}.familyRelationship`, // Cập nhật tên trường đúng
                                                value: selected, // Cập nhật giá trị cho mối quan hệ
                                              },
                                            });
                                          }}
                                          label="Quan hệ"
                                        >
                                          {familyRelationshipStore.familyList.map((familyMemberItem) => (
                                            <MenuItem key={familyMemberItem.id} value={familyMemberItem.id}>
                                              {familyMemberItem.name} {/* Tên của mối quan hệ */}
                                            </MenuItem>
                                          ))}
                                        </Select>
                                      </FormControl>
                                    </TableCell>

                                    <TableCell>
                                      <TextField
                                        name={`familyRelationships.${index}.address`}
                                        placeholder="Địa chỉ"
                                        value={familyMember.address}
                                        onChange={handleChange}
                                      />
                                    </TableCell>
                                    <TableCell>
                                      <TextField
                                        name={`familyRelationships.${index}.description`}
                                        placeholder="Mô tả"
                                        value={familyMember.description}
                                        onChange={handleChange}
                                      />
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
                                  <Table colSpan="5">Không có nhân thân.</Table>
                                </TableRow>
                              )}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </div>
                    )}
                  </FieldArray>
                </Grid>
              </Grid>
              <div className={classes.buttonWrapper}>
                <Button variant="contained" color="inherit" onClick={() => setIsOpenForm(false)}>
                  Hủy
                </Button>
                <Button type="submit" variant="contained" color="primary">
                  {selectedStaff?.id ? "Cập nhật" : "Lưu"}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
});
