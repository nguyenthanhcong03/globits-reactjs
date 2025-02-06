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
import { Icon } from "@material-ui/core";
import ProjectForm from "./ProjectForm";

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
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    border: "1px solid gray",
    width: "200px",
    display: "flex",
    alignItems: "center",
    justifyContent: "between",
  },
  searchIcon: {
    display: "flex",
    alignItems: "center",
    height: "100%",
    padding: theme.spacing(0, 1),
    backgroundColor: "#01c0c8",
    borderTopRightRadius: theme.shape.borderRadius,
    borderBottomRightRadius: theme.shape.borderRadius,
  },
  inputInput: {
    paddingLeft: "10px",
  },
  nav: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: theme.spacing(2),
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
export default observer(function StaffIndex() {
  const { projectStore } = useStore();
  const {
    search,
    updatePageData,
    setKeyword,
    keyword,
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
  } = projectStore;

  useEffect(() => {
    search();
  }, [search]);

  const classes = useStyles();

  const handleIconClick = () => {
    updatePageData(keyword);
  };

  const handleKeyDown = (e) => {
    setKeyword(e.target.value);
    if (e.key === "Enter") {
      updatePageData(keyword);
    }
  };

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
      title: "Hành động",
      render: (rowData) => (
        <MaterialButton
          item={rowData}
          onEdit={setShouldOpenEditorDialog}
          onDelete={setShouldOpenConfirmationDialog}
          setSelected={setSelected}
        />
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
            setShouldOpenEditorDialog(true);
            setSelected(null);
          }}
        >
          Thêm mới <AddCircleOutlineOutlinedIcon />
        </Button>
        <div className={classes.search}>
          <InputBase
            placeholder="search…"
            classes={{
              root: classes.inputRoot,
              input: classes.inputInput,
            }}
            onChange={(e) => handleKeyDown(e)}
            onKeyPress={handleKeyDown}
            inputProps={{ "aria-label": "search" }}
          />
          <div className={classes.searchIcon} onClick={handleIconClick}>
            <SearchIcon />
          </div>
        </div>
      </div>
      <div className={classes.tableContainer}>
        <TableCustom
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
          totalPages={totalPages}
          page={page}
          handleChangePage={handleChangePage}
          title={"Danh sách dự án"}
          datas={listData}
          columns={columns}
        />
      </div>
      {shouldOpenEditorDialog && <ProjectForm />}
      {shouldOpenConfirmationDialog && (
        <Dialog
          open={shouldOpenConfirmationDialog}
          onClose={() => setShouldOpenConfirmationDialog(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Bạn có muốn xóa không?"}
          </DialogTitle>
          <DialogActions>
            <Button
              onClick={() => setShouldOpenConfirmationDialog(false)}
              color="primary"
            >
              Hủy
            </Button>
            <Button
              onClick={() => handleConfirmDelete()}
              color="primary"
              autoFocus
            >
              Xác nhận
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
});
