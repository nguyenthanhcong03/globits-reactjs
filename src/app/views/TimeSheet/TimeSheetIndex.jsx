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

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(2),
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
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
    position: "relative",
    display: "flex",
    borderRadius: theme.shape.borderRadius,
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
  },
  searchInput: {
    paddingLeft: "10px",
  },
  inputInput: {
    paddingLeft: "10px",
  },
  nav: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: theme.spacing(2),
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
  },
}));

const MaterialButton = ({ item, setSelected, onEdit, onDelete }) => (
  <>
    <IconButton
      onClick={() => {
        onEdit(true);
        setSelected(item);
      }}
      aria-label="edit"
    >
      <Icon color="primary">edit</Icon>
    </IconButton>
    <IconButton
      onClick={() => {
        onDelete(true);
        setSelected(item);
      }}
      aria-label="delete"
    >
      <Icon color="error">delete</Icon>
    </IconButton>
  </>
);
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
    keyword,
    setKeyword,
    pageIndex,
    handleChangePage,
    isOpenPopup,
    handleConfirmDelete,
    isOpenForm,
    setProjectId,
  } = timeSheetStore;

  useEffect(() => {
    search();
    projectStore.fetchProjects();
    calculateTotalHours();
  }, []);

  const columns = [
    {
      title: "Hành động",
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
      render: (rowData) => {
        return (
          <div>
            <p>
              <strong>Thời gian bắt đầu: </strong>
              {formatDateTime(rowData?.startTime, false)}
            </p>
            <p>
              <strong>Thời gian kết thúc: </strong>
              {formatDateTime(rowData?.endTime, false)}
            </p>
            <p>
              <strong>Tổng thời gian: </strong>
              {calculateTotalHours(rowData?.startTime, rowData?.endTime)}
            </p>
          </div>
        );
      },
    },
    {
      title: "Mức độ ưu tiên",
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
        return <div className={priority === 4 ? classes.priority : ""}>{priorityLabel}</div>;
      },
    },
    {
      title: "Người thực hiện",
      render: (rowData) => {
        return (
          <div>
            {rowData?.timeSheetStaff?.map((staff, index) => (
              <div key={index}>{`${staff?.lastName || ""} ${staff?.firstName || ""}`}</div>
            ))}
          </div>
        );
      },
    },
  ];
  const [selectedProject, setSelectProject] = useState(null);
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
      <div className={classes.tableContainer}>
        <div className={classes.sidebar}>
          <div className="">
            <div className={classes.title}>
              <h3>Danh sách dự án</h3>
            </div>
            <div className={classes.subtitle}>
              <Button
                fullWidth
                color="secondary"
                onClick={() => {
                  setProjectId("");
                }}
              >
                Tất cả
              </Button>
            </div>
            <div className={classes.searchWrapper}>
              <TextField
                variant="outlined"
                fullWidth
                size="small"
                placeholder="Tìm kiếm"
                classes={{
                  root: classes.inputRoot,
                  input: classes.searchInput,
                }}
                onChange={(e) => setKeyword(e.target.value)}
                value={keyword}
                inputProps={{ "aria-label": "search" }}
              />
            </div>
          </div>
          <div className="">
            {projectStore.projectList?.length > 0 ? (
              <FixedSizeList height={300} width="100%" itemSize={40} itemCount={projectStore.projectList.length}>
                {({ index, style }) => {
                  const project = projectStore.projectList[index];
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
                        setSelectProject(project);
                        setProjectId(project?.id);
                        projectStore.setSelectedProject(project);
                      }}
                    >
                      <ListItemText primary={project.name} />
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
              setIsOpenForm(true);
              setSelectedTimeSheet(null);
            }}
            // disabled={projectStore.selectedProject === null}
          >
            Thêm mới <AddIcon />
          </Button>
          <MaterialTable
            title={"Danh sách time sheet"}
            data={timeSheetList}
            columns={columns}
            parentChildData={(row, rows) => {
              var list = rows.find((a) => a.id === row.parentId);
              return list;
            }}
            options={{
              // selection: selection ? true : false,
              actionsColumnIndex: -1,
              draggable: false,
              paging: true,
              pageSize: pageSize,
              search: false,
              toolbar: true,
              maxBodyHeight: "300px",
              headerStyle: {
                paddingLeft: "5px",
                backgroundColor: "#01C0C8",
                color: "#fff",
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
        </div>
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
