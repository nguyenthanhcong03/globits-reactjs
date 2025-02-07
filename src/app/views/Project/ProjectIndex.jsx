import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import AddCircleOutlineOutlinedIcon from "@material-ui/icons/AddCircleOutlineOutlined";
import SearchIcon from "@material-ui/icons/Search";
import InputBase from "@material-ui/core/InputBase";
import { observer } from "mobx-react";
import { useStore } from "../../stores";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import TableCustom from "../../common/staff/TableCustom";
import IconButton from "@material-ui/core/IconButton";
import { Icon, TextField } from "@material-ui/core";
import ProjectForm from "./ProjectForm";
import useDebounce from "app/hooks/useDebounce";
import AddIcon from "@material-ui/icons/Add";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import MaterialTable from "material-table";

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
    width: "500px",
    alignItems: "center",
    justifyContent: "space-between",
  },
  searchIcon: {
    display: "flex",
    alignItems: "center",
    height: "100%",
    padding: theme.spacing(0, 1),
    backgroundColor: "#7467EF",
    borderTopRightRadius: theme.shape.borderRadius,
    borderBottomRightRadius: theme.shape.borderRadius,
  },
  searchInput: {
    paddingLeft: "10px",
  },
  nav: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: theme.spacing(2),
  },
  tableContainer: {
    overflowY: "auto", // Enables vertical scrolling
  },
}));

export default observer(function ProjectIndex() {
  const classes = useStyles();
  const { projectStore } = useStore();
  const {
    fetchProjects,
    searchProjectsByPage,
    keyword,
    setKeyword,
    selectedProject,
    setSelectedProject,
    projectList,
    deleteProject,
    pageSize,
    setIsOpenForm,
    isOpenForm,
    isOpenPopup,
    setIsOpenPopup,
    setPageSize,
    totalPages,
    pageIndex,
    handleChangePage,
    handleChangeRowsPerPage,
  } = projectStore;

  const debounce = useDebounce(keyword, 300);

  useEffect(() => {
    fetchProjects();
  }, [debounce]);

  const columns = [
    {
      title: "STT",
      render: (rowData) => rowData.tableData.id + 1,
      cellStyle: {
        paddingLeft: "10px",
      },
      headerStyle: {
        paddingLeft: "10px",
      },
    },
    { title: "Mã dự án", field: "code" },
    { title: "Tên dự án", field: "name" },
    { title: "Mô tả dự án", field: "description" },
    {
      title: "Thao tác",
      render: (rowData) => (
        <div>
          <div>
            <EditIcon
              color="primary"
              onClick={() => {
                setIsOpenForm(true);
                setSelectedProject(rowData);
              }}
              cursor="pointer"
            />
            <DeleteIcon
              color="error"
              cursor="pointer"
              onClick={() => {
                setIsOpenPopup(true);
                setSelectedProject(rowData);
              }}
            />
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className={classes.root}>
      <div className={classes.nav}>
        <Button
          variant="contained"
          color="primary"
          disableElevation
          className={classes.button}
          onClick={() => {
            setIsOpenForm(true);
            setSelectedProject(null);
          }}
        >
          Thêm mới <AddIcon />
        </Button>
        <div className={classes.searchWrapper}>
          <TextField
            variant="outlined"
            fullWidth
            size="small"
            placeholder="Tìm kiếm dự án"
            classes={{
              root: classes.inputRoot,
              input: classes.searchInput,
            }}
            onChange={(e) => setKeyword(e.target.value)}
            value={keyword}
            inputProps={{ "aria-label": "search" }}
          />
          <div className={classes.searchIcon}>
            <SearchIcon />
          </div>
        </div>
      </div>
      <div className={classes.tableContainer}>
        <MaterialTable
          title={"Danh sách dự án"}
          data={projectList}
          columns={columns}
          parentChildData={(row, rows) => {
            var list = rows.find((a) => a.id === row.parentId);
            return list;
          }}
          options={{
            // selection: selection ? true : false,
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
      </div>

      {isOpenForm && <ProjectForm />}

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
            <Button onClick={() => deleteProject(selectedProject.id)} color="primary" autoFocus>
              Có
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
});
