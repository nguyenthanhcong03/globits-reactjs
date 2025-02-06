import React, {useEffect} from "react";
import {makeStyles} from "@material-ui/core/styles";
import {Form, Formik} from "formik";
import * as Yup from "yup";
import Button from "@material-ui/core/Button";
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';

import {observer} from "mobx-react";
import {useStore} from "../../stores";

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
    },
    itemInput: {
        width: "45%",
    },
    wapperButton: {
        display: "flex",
        justifyContent: "center",
        gap: 10,
        marginTop: 10,
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


export default observer(function ProjectForm() {
    const classes = useStyles();
    const {staffStore, projectStore} = useStore();
    const {
        shouldOpenEditorDialog,
        setShouldOpenEditorDialog,
        selected,
        updateData,
        saveData,
        setSelected
    } = projectStore;

    const initialValues = {
        id: selected?.id || "",
        name: selected?.name || "",
        code: selected?.code || "",
        description: selected?.description || "",
        projectStaff: selected?.projectStaff || [],
    }
    const validationSchema = Yup.object
    ({})
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
        staffStore.search();
        if (selected?.id) {
            setSelected(selected)
        }
    }, []);
    const listStaff = staffStore.listData
    return (
        <Dialog
            open={shouldOpenEditorDialog}
            onClose={() => setShouldOpenEditorDialog(false)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            maxWidth={"md"}
        >
            <DialogTitle id="alert-dialog-title">
                {selected?.id ? "Edit Project" : "Create Project"}
            </DialogTitle>
            <DialogContent>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={onSubmit}  // Use the onSubmit you defined
                >
                    {({
                          values,
                          handleChange,
                          handleBlur,
                          touched,
                          errors,
                          setFieldValue, // Thêm dòng này để lấy setFieldValue từ Formik

                      }) => (
                        <Form>
                            <div className={classes.wapper}>
                                <TextField
                                    className={classes.itemInput}
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
                                    className={classes.itemInput}
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
                                    className={classes.itemInput}
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
                                    options={listStaff || []}
                                    disableCloseOnSelect
                                    getOptionLabel={(option) => `${option?.firstName || ''} ${option?.lastName || ''}`}
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
                                    value={values.projectStaff}
                                    onChange={(event, newValue) => {
                                        setFieldValue('projectStaff', newValue);
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            variant="outlined"
                                            label="Chọn nhân viên vào dự án"
                                            placeholder="Nhân viên"
                                        />
                                    )}
                                />
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
                        </Form>
                    )}
                </Formik>
            </DialogContent>
        </Dialog>
    );
})
;