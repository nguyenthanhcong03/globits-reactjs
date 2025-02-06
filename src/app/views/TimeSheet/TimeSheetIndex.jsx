import React, {useEffect, useState} from "react";
import {makeStyles} from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import AddCircleOutlineOutlinedIcon from "@material-ui/icons/AddCircleOutlineOutlined";
import SearchIcon from "@material-ui/icons/Search";
import InputBase from "@material-ui/core/InputBase";
import {observer} from "mobx-react";
import {useStore} from "../../stores";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import TableCustom from "../../common/BuiHien/TableCustom";
import IconButton from "@material-ui/core/IconButton";
import {Icon} from "@material-ui/core";
import TimeSheetForm from "./TimeSheetForm";
import {FixedSizeList} from "react-window";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import {differenceInMinutes} from "date-fns";
import MenuItem from "@material-ui/core/MenuItem";

const useStyles = makeStyles((theme) => ({
    root: {
        marginTop: theme.spacing(2), marginLeft: theme.spacing(2), marginRight: theme.spacing(2),
    }, table: {
        minWidth: 650,
    }, numericalOrder: {
        paddingLeft: theme.spacing(2),
    }, pagination: {
        "& > *": {
            marginTop: theme.spacing(2),
        }, display: "flex", justifyContent: "end",
    }, delete: {
        border: "1px solid",
        padding: theme.spacing(2),
        backgroundColor: theme.palette.background.paper,
        textAlign: "center",
    }, popper: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 1300,
    }, search: {
        position: "relative",
        borderRadius: theme.shape.borderRadius,
        border: "1px solid gray",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "between",
    }, searchIcon: {
        display: "flex",
        alignItems: "center",
        height: "100%",
        padding: theme.spacing(0, 1),
        backgroundColor: "#01c0c8",
        borderTopRightRadius: theme.shape.borderRadius,
        borderBottomRightRadius: theme.shape.borderRadius,
    }, inputInput: {
        paddingLeft: "10px",
    }, nav: {
        display: "flex", justifyContent: "space-between", marginBottom: theme.spacing(2),
    },
    tableContainer: {
        display: "flex",
        minHeight: "100vh", // Occupy full height

    },
    sidebar: {
        width: "20%", // Sidebar takes 30% of the width
        padding: theme.spacing(2),
        backgroundColor: "#f4f4f4", // Optional background color
        display: "flex",
        flexDirection: "column",
        gap: theme.spacing(2),
    },
    content: {
        width: "80%", // Content area takes 70% of the width
        padding: theme.spacing(2),
        backgroundColor: "#fff", // Optional background color
    },
    title: {
        marginBottom: theme.spacing(2),
    },
    subtitle: {
        marginBottom: theme.spacing(2),
    },
    button: {
        marginBottom: theme.spacing(2),
    },
    priority: {
        backgroundColor: "#dd5c45",
        borderRadius: theme.shape.borderRadius,
        color: "#ffffff",
    }
}));

const MaterialButton = ({item, setSelected, onEdit, onDelete}) => (<>
    <IconButton onClick={() => {
        onEdit(true);
        setSelected(item)
    }}
                aria-label="edit">
        <Icon color="primary">edit</Icon>
    </IconButton>
    <IconButton onClick={() => {
        onDelete(true);
        setSelected(item)
    }} aria-label="delete">
        <Icon color="error">delete</Icon>
    </IconButton>
</>);
export default observer(function TimeSheetIndex() {
    const {projectStore, timeSheetStore} = useStore();
    const {
        search,
        setShouldOpenEditorDialog,
        setSelected,
        listData,
        setShouldOpenConfirmationDialog,
        rowsPerPage,
        setRowsPerPage,
        totalPages,
        page,
        handleChangePage,
        shouldOpenConfirmationDialog,
        handleConfirmDelete,
        shouldOpenEditorDialog,
        setProjectId
    } = timeSheetStore;

    useEffect(() => {
        search();
        projectStore.search();
        calculateTotalHours()
    }, [projectStore.selected]);

    const classes = useStyles();

    const handleIconClick = () => {
        projectStore.updatePageData(projectStore.keyword);
    };

    const handleKeyDown = (e) => {
        projectStore.setKeyword(e.target.value);
        if (e.key === "Enter") {
            projectStore.updatePageData(projectStore.keyword);
        }
    };

    const columns = [
        {
            title: "Hành động", render: (rowData) => (<MaterialButton
                item={rowData}
                onEdit={setShouldOpenEditorDialog}
                onDelete={setShouldOpenConfirmationDialog}
                setSelected={setSelected}
            />),
        },
        {title: 'Công việc', field: 'description'},
        {
            title: 'Thời gian', render: (rowData) => {
                return (
                    <div>
                        <p>Thời gian bắt đầu: {formatDateTime(rowData?.startTime, false)}</p>
                        <p>Thời gian kết thúc: {formatDateTime(rowData?.endTime, false)}</p>
                        <p>Tổng thời gian: {calculateTotalHours(rowData?.startTime, rowData?.endTime)}</p>
                    </div>
                );
            }
        },
        {
            title: 'Mức độ ưu tiên',
            render: (rowData) => {
                const priority = rowData?.priority;
                let priorityLabel = "";
                if (priority === 1) {
                    priorityLabel = "Thấp"
                } else if (priority === 2) {
                    priorityLabel = "Trung bình"
                } else if (priority === 3) {
                    priorityLabel = "Cao"
                } else if (priority === 4) {
                    priorityLabel = "Cấp bách"
                }
                return (
                    <div className={priority === 4 && classes.priority}>{priorityLabel}</div> // Hiển thị tên ưu tiên
                );
            }
        },
        {
            title: 'Người thực hiện', render: (rowData) => {
                return (
                    <div>
                        {rowData?.timeSheetStaff?.map((staff, index) => (
                            <div key={index}>
                                {`${staff?.firstName || ''} ${staff?.lastName || ''}`}
                            </div>
                        ))}
                    </div>
                );
            }
        },
    ]
    const [selectedProject, setSelectProject] = useState(null);
    const calculateTotalHours = (startTime, endTime) => {
        if (startTime && endTime) {
            const totalMinutes = differenceInMinutes(new Date(endTime), new Date(startTime));
            const hours = Math.floor(totalMinutes / 60);
            const minutes = totalMinutes % 60;
            return (`${hours} giờ ${minutes} phút`);
        } else {
            return ("0 giờ 0 phút");
        }
    };
    const formatDateTime = (timestamp, includeTime = true) => {
        const date = new Date(timestamp);

        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');

        if (includeTime) {
            const hours = date.getHours().toString().padStart(2, '0');
            const minutes = date.getMinutes().toString().padStart(2, '0');
            const seconds = date.getSeconds().toString().padStart(2, '0');

            return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
        }

        return `${day}/${month}/${year}`;
    };
    return (
        <div className={classes.root}>
            <div className={classes.tableContainer}>
                <div className={classes.sidebar}>
                    <div className="">
                        <div className={classes.title}>
                            <h3>Danh sách dự án</h3>
                        </div>
                        <div className={classes.subtitle}>
                            <p>Tất cả</p>
                        </div>
                        <div className={classes.search}>
                            <InputBase
                                placeholder="Search…"
                                classes={{
                                    root: classes.inputRoot,
                                    input: classes.inputInput,
                                }}
                                onChange={(e) => handleKeyDown(e)}
                                onKeyPress={handleKeyDown}
                                inputProps={{"aria-label": "search"}}
                            />
                            <div className={classes.searchIcon} onClick={handleIconClick}>
                                <SearchIcon/>
                            </div>
                        </div>
                    </div>
                    <div className="">
                        {projectStore.listData.length > 0 ? (
                            <FixedSizeList
                                height={300}
                                width="100%"
                                itemSize={40}
                                itemCount={projectStore.listData.length}
                            >
                                {({index, style}) => {
                                    const project = projectStore.listData[index];
                                    return (
                                        <ListItem
                                            button
                                            key={project.id}
                                            style={{
                                                ...style,
                                                backgroundColor:
                                                    selectedProject?.id === project.id
                                                        ? 'orange'
                                                        : 'transparent',
                                                border:
                                                    selectedProject?.id === project.id
                                                        ? '2px solid orange'
                                                        : '2px solid transparent',
                                                borderRadius: '5px',
                                                transition: 'background-color 0.3s',
                                            }}
                                            onClick={() => {
                                                setSelectProject(project);
                                                setProjectId(project?.id)
                                                projectStore.setSelected(project)
                                            }}
                                        >
                                            <ListItemText primary={project.name}/>
                                        </ListItem>
                                    );
                                }}
                            </FixedSizeList>
                        ) : (
                            "Không có dự án nào"
                        )}

                    </div>
                </div>
                <div className={classes.content}>
                    <Button
                        variant="contained"
                        color="primary"
                        disableElevation
                        className={classes.button}
                        onClick={() => {
                            setShouldOpenEditorDialog(true)
                            setSelected(null)
                        }}
                        disabled={projectStore.selected === null}
                    >
                        Thêm mới <AddCircleOutlineOutlinedIcon/>
                    </Button>
                    <TableCustom
                        rowsPerPage={rowsPerPage}
                        setRowsPerPage={setRowsPerPage}
                        totalPages={totalPages}
                        page={page}
                        handleChangePage={handleChangePage}
                        title={"Danh sách time sheet"}
                        datas={listData}
                        columns={columns}/>
                </div>
            </div>
            {shouldOpenEditorDialog && <TimeSheetForm/>}
            {shouldOpenConfirmationDialog && (<Dialog
                open={shouldOpenConfirmationDialog}
                onClose={() => setShouldOpenConfirmationDialog(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Bạn có muốn xóa không?"}</DialogTitle>
                <DialogActions>
                    <Button onClick={() => setShouldOpenConfirmationDialog(false)} color="primary">
                        Hủy
                    </Button>
                    <Button onClick={() => handleConfirmDelete()} color="primary" autoFocus>
                        Xác nhận
                    </Button>
                </DialogActions>
            </Dialog>)}
        </div>

    );
})
;