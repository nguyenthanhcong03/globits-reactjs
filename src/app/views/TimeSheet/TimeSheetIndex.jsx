import { Icon, TextField } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import IconButton from "@material-ui/core/IconButton";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { makeStyles } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import { differenceInMinutes } from "date-fns";
import MaterialTable from "material-table";
import { observer } from "mobx-react";
import { useEffect, useState } from "react";
import { FixedSizeList } from "react-window";
import { useStore } from "../../stores";
import TimeSheetForm from "./TimeSheetForm";
import { formatDateTime } from "utils";
import useDebounce from "app/hooks/useDebounce";
import { width } from "dom-helpers";
import TimeSheetSidebar from "./TimeSheetSidebar";
import TimeSheetTable from "./TimeSheetTable";

const useStyles = makeStyles((theme) => ({
  root: {
    // marginTop: theme.spacing(2),
    // marginLeft: theme.spacing(2),
    // marginRight: theme.spacing(2),
  },
  table: {
    minWidth: 650,
  },
  numericalOrder: {
    paddingLeft: theme.spacing(2),
  },
  pagination: {
    "& > *": {
      marginTop: theme.spacing(2),
    },
    display: "flex",
    justifyContent: "end",
  },
  delete: {
    border: "1px solid",
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
    textAlign: "center",
  },
  popper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    zIndex: 1300,
  },
  searchWrapper: {
    margin: "10px 0",
    borderRadius: theme.shape.borderRadius,
    width: "100%",
    alignItems: "center",
  },
  searchInput: {
    paddingLeft: "10px",
  },
  inputInput: {
    paddingLeft: "10px",
  },
  container: {
    display: "flex",
    minHeight: "100vh",
  },
  sidebar: {
    width: "20%",
    backgroundColor: "#f4f4f4",
    display: "flex",
    flexDirection: "column",
  },
  contentSidebar: {
    padding: "0 10px",
  },
  content: {
    width: "80%",
    padding: "20px",
    backgroundColor: "#fff",
  },
  title: {
    width: "100%",
    padding: "10px",
    textAlign: "center",
    color: "#fff",
    fontSize: "20px",
    backgroundColor: "#01C0C8",
  },

  button: {
    marginBottom: theme.spacing(2),
  },
  priority: {
    backgroundColor: "#dd5c45",
    borderRadius: theme.shape.borderRadius,
    padding: "5px 10px",
    color: "#ffffff",
  },
}));

export default observer(function TimeSheetIndex() {
  const classes = useStyles();
  const { projectStore, timeSheetStore } = useStore();
  const {
    search,
    setIsOpenForm,
    setSelectedTimeSheet,
    timeSheetList,
    setIsOpenPopup,
    pageSize,
    setPageSize,
    totalPages,
    pageIndex,
    handleChangePage,
    isOpenPopup,
    handleConfirmDelete,
    isOpenForm,
    setProjectId,
  } = timeSheetStore;

  const { fetchProjects, projectList, selectedProject, setSelectedProject, keyword, setKeyword } = projectStore;

  const debounce = useDebounce(keyword, 300);

  useEffect(() => {
    fetchProjects();
  }, [debounce]);

  const columns = [
    {
      title: "Thao tác",
      // cellStyle: { textAlign: "center" },
      sorting: false,
      render: (rowData) => (
        <div>
          <div>
            <EditIcon
              color="primary"
              onClick={() => {
                setIsOpenForm(true);
                setSelectedTimeSheet(rowData);
              }}
              cursor="pointer"
            />
            <DeleteIcon
              color="error"
              cursor="pointer"
              onClick={() => {
                setIsOpenPopup(true);
                setSelectedTimeSheet(rowData);
              }}
            />
          </div>
        </div>
      ),
    },
    { title: "Công việc", field: "description" },
    {
      title: "Thời gian",
      cellStyle: {
        width: "30%",
      },
      render: (rowData) => {
        return (
          <div>
            <p>
              Thời gian bắt đầu:
              <span
                style={{
                  color: "#01C0C8",
                }}
              >
                {formatDateTime(rowData?.startTime)}
              </span>
            </p>
            <p>
              Thời gian kết thúc:
              <span
                style={{
                  color: "#01C0C8",
                }}
              >
                {formatDateTime(rowData?.endTime)}
              </span>
            </p>
            <p>
              Tổng thời gian:
              <span
                style={{
                  color: "#01C0C8",
                }}
              >
                {calculateTotalHours(rowData?.startTime, rowData?.endTime)}
              </span>
            </p>
          </div>
        );
      },
    },
    {
      title: "Độ ưu tiên",
      render: (rowData) => {
        const priority = rowData?.priority;
        let priorityLabel = "";
        switch (priority) {
          case 1:
            priorityLabel = "Thấp";
            break;
          case 2:
            priorityLabel = "Trung bình";
            break;
          case 3:
            priorityLabel = "Cao";
            break;
          case 4:
            priorityLabel = "Cấp bách";
            break;
          default:
            priorityLabel = "Không xác định";
        }
        return <span className={priority === 4 ? classes.priority : ""}>{priorityLabel}</span>;
      },
    },
    {
      title: "Người thực hiện",
      render: (rowData) => {
        return (
          <div>
            {rowData?.timeSheetStaff?.map((staff, index) => (
              <li key={index}>{`${staff?.lastName || ""} ${staff?.firstName || ""}`}</li>
            ))}
          </div>
        );
      },
    },
  ];
  const calculateTotalHours = (startTime, endTime) => {
    if (startTime && endTime) {
      const totalMinutes = differenceInMinutes(new Date(endTime), new Date(startTime));
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      return `${hours} giờ ${minutes} phút`;
    } else {
      return "0 giờ 0 phút";
    }
  };

  return (
    <div className={classes.root}>
      <div className={classes.container}>
        <div className={classes.sidebar}>
          <p className={classes.title}>Danh sách dự án:</p>
          <div className={classes.contentSidebar}>
            <Button
              style={{
                backgroundColor: selectedProject === null ? "#FB9678" : "transparent",
                color: selectedProject === null ? "#fff" : "#FB9678",
                borderRadius: "5px",
                transition: "background-color 0.3s",
              }}
              fullWidth
              color="secondary"
              onClick={() => {
                setProjectId("");
                setSelectedProject(null);
              }}
            >
              Tất cả
            </Button>
            <div className={classes.searchWrapper}>
              <TextField
                variant="outlined"
                fullWidth
                size="small"
                placeholder="Tìm kiếm dự án"
                value={keyword}
                onChange={(e) => {
                  setKeyword(e.target.value);
                }}
              />
            </div>
            <div>
              {projectList?.length > 0 ? (
                <FixedSizeList height={300} width="100%" itemSize={40} itemCount={projectList.length}>
                  {({ index, style }) => {
                    const project = projectList[index];

                    return (
                      <ListItem
                        button
                        key={project.id}
                        style={{
                          ...style,
                          backgroundColor: selectedProject?.id === project.id ? "#FB9678" : "transparent",
                          color: selectedProject?.id === project.id ? "#fff" : "#FB9678",
                          borderRadius: "5px",
                          transition: "background-color 0.3s",
                        }}
                        onClick={() => {
                          setSelectedProject(project);
                          setProjectId(project?.id);
                        }}
                      >
                        <ListItemText style={{ textAlign: "center" }} primary={project.name} />
                      </ListItem>
                    );
                  }}
                </FixedSizeList>
              ) : (
                "Không có dự án nào"
              )}
            </div>
          </div>
        </div>
        <TimeSheetTable />
      </div>
      {isOpenForm && <TimeSheetForm />}
      {isOpenPopup && (
        <Dialog
          open={isOpenPopup}
          onClose={() => setIsOpenPopup(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Bạn có muốn xóa không?"}</DialogTitle>
          <DialogActions>
            <Button onClick={() => setIsOpenPopup(false)} color="primary">
              Hủy
            </Button>
            <Button onClick={() => handleConfirmDelete()} color="primary" autoFocus>
              Xác nhận
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
});
