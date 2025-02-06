import React, {useEffect, useState} from "react";
import {makeStyles} from "@material-ui/core/styles";
import {Form, Formik} from "formik";
import * as Yup from "yup";
import Button from "@material-ui/core/Button";
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';

import {observer} from "mobx-react";
import {useStore} from "../../stores";
import DatePickers from "../../common/BuiHien/DatePickers";
import {InputLabel} from "@material-ui/core";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Checkbox from "@material-ui/core/Checkbox";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";

const icon = <CheckBoxOutlineBlankIcon fontSize="small"/>;
const checkedIcon = <CheckBoxIcon fontSize="small"/>;
const useStyles = makeStyles((theme) => ({
    wapper: {
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-between",
        gap: theme.spacing(2),
        width: "100%",
        position: "relative", // Added for absolute positioning of button
    }, itemInput: {
        width: "45%",
    }, wapperButton: {
        display: "flex", justifyContent: "center", gap: 10, marginTop: 10,
    }, addFamilyMemberBtn: {
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
    }, familyMembersTable: {
        width: "100%", borderCollapse: "collapse", marginTop: theme.spacing(4), // Adds space between table and the button
    }, tableHeader: {
        backgroundColor: "#f4f4f4",
    }, tableCell: {
        border: "1px solid #ddd", padding: theme.spacing(1), textAlign: "left",
    }, removeBtn: {
        backgroundColor: "red", color: "white", border: "none", padding: "5px 10px", cursor: "pointer", "&:hover": {
            backgroundColor: "darkred",
        },
    },
}));


export default observer(function TimeSheetForm() {
    const classes = useStyles();
    const {projectStore, timeSheetStore} = useStore();
    const {
        shouldOpenEditorDialog, setShouldOpenEditorDialog, selected, updateData, saveData, getById
    } = timeSheetStore;

    const initialValues = {
        id: selected?.id || null,
        project: selected?.project || projectStore.selected,
        timeSheetStaff: selected?.timeSheetStaff || [],
        workingDate: selected?.workingDate || new Date(),
        startTime: selected?.startTime || new Date(),
        endTime: selected?.endTime || new Date(),
        priority: selected?.priority || "",
        description: selected?.description || "",
        details: selected?.details || [],
    }
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
    })
    const onSubmit = async (values, {resetForm}) => {
        try {
            if (selected?.id) {
                updateData(values);
            } else {
                saveData(values);
            }
            resetForm();
            setShouldOpenEditorDialog(false)
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    };
    useEffect(() => {
        if (selected?.id) {
            getById(selected?.id)
            projectStore.getById(selected?.project?.id || projectStore.selected?.id)
        }
    }, []);


    return (<Dialog
        open={shouldOpenEditorDialog}
        onClose={() => setShouldOpenEditorDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth={"md"}
    >
        <DialogTitle id="alert-dialog-title">
            {selected?.id ? "Edit Time Sheet" : "Create Time Sheet"}
        </DialogTitle>
        <DialogContent>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={onSubmit}  // Use the onSubmit you defined
            >
                {({
                      values, handleChange, handleBlur, touched, errors, setFieldValue, // Thêm dòng này để lấy setFieldValue từ Formik

                  }) => (<Form>
                    <div className={classes.wapper}>
                        <TextField
                            className={classes.itemInput}
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
                            labelDate="Thời gian bắt đầu"
                            value={values.startTime} // Truyền giá trị từ Formik
                            onChange={(date) => {
                                setFieldValue("startTime", date); // Cập nhật giá trị vào Formik
                            }}
                            isTime={true}
                            format={"MM/dd/yyyy hh:mm"} // Định dạng ngày và giờ
                            className={classes.itemInput}
                        />
                        <DatePickers
                            labelDate="Thời gian kết thúc"
                            value={values.endTime}
                            onChange={(date) => {
                                setFieldValue('endTime', date);
                            }}
                            isTime={true}
                            format={"MM/dd/yyyy hh:mm"}
                            className={classes.itemInput}
                        />
                        <DatePickers
                            labelDate="Ngày làm việc"
                            value={values.workingDate}
                            onChange={(date) => {
                                setFieldValue('workingDate', date);
                            }}
                            isTime={false}
                            className={classes.itemInput}
                        />
                        <Autocomplete
                            multiple
                            options={Array.isArray(projectStore?.selected?.projectStaff) ? projectStore?.selected?.projectStaff : []}
                            disableCloseOnSelect
                            getOptionLabel={(option) =>
                                option ? `${option.firstName || ''} ${option.lastName || ''}` : ''
                            }
                            renderOption={(option, {selected}) => (
                                <React.Fragment>
                                    <Checkbox
                                        icon={icon}
                                        checkedIcon={checkedIcon}
                                        style={{marginRight: 8}}
                                        checked={selected}
                                    />
                                    {`${option?.firstName || ''} ${option?.lastName || ''}`}
                                </React.Fragment>
                            )}
                            className={classes.itemInput}
                            value={values.timeSheetStaff || []}
                            onChange={(event, newValue) => {
                                const staff = newValue.map((staff) => (
                                    {
                                        id: staff.id,
                                        firstName: staff.firstName,
                                        lastName: staff.lastName,
                                    }
                                ));
                                setFieldValue('timeSheetStaff', staff);
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    variant="outlined"
                                    label="Chọn nhân viên"
                                    placeholder="Nhân viên"
                                />
                            )}
                        />

                        <FormControl className={classes.itemInput} variant="outlined">
                            <InputLabel id="priority-select-label">Priority</InputLabel>
                            <Select
                                labelId="priority-select-label"
                                id="priority-select"
                                name="priority"
                                value={values.priority}
                                onChange={handleChange}
                                label="Priority"
                                error={touched.priority && Boolean(errors.priority)}
                            >
                                <MenuItem value={"1"}>Thấp</MenuItem>
                                <MenuItem value={"2"}>Trung bình</MenuItem>
                                <MenuItem value={"3"}>Cao</MenuItem>
                                <MenuItem value={"4"}>Cấp bách</MenuItem>
                            </Select>
                        </FormControl>
                    < /div>
                    <div className={classes.wapperButton}>
                        <Button variant="contained" color="inherit"
                                onClick={() => {
                                    setShouldOpenEditorDialog(false)
                                }}>
                            Hủy
                        </Button>
                        <Button type="submit" variant="contained" color="inherit">
                            {selected?.id ? "Update" : "Save"}
                        </Button>
                    </div>
                </Form>)}
            </Formik>
        </DialogContent>
    </Dialog>);
});