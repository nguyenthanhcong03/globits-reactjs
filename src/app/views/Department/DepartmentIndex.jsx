import { Icon, TextField } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import SearchIcon from "@material-ui/icons/Search";
import { observer } from "mobx-react";
import { useEffect } from "react";
import TableCustom from "../../common/staff/TableCustom";
import { useStore } from "../../stores";
import DepartmentForm from "./DepartmentForm";

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

export default observer(function DepartmentIndex() {
  const { departmentStore } = useStore();
  const {
    fetchDepartments,
    updatePageData,
    keyword,
    setKeyword,
    pageIndex,
    setShouldOpenEditorDialog,
    setSelectedDepartment,
    departmentList,
    setShouldOpenConfirmationDialog,
    pageSize,
    setPageSize,
    totalPages,
    handleChangePage,
    shouldOpenConfirmationDialog,
    handleConfirmDelete,
    setSelectedList,
  } = departmentStore;

  useEffect(() => {
    fetchDepartments();
  }, [pageIndex, pageSize]);

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

  const formatDateTime = (timestamp, includeTime = true) => {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");

    if (includeTime) {
      const hours = date.getHours().toString().padStart(2, "0");
      const minutes = date.getMinutes().toString().padStart(2, "0");
      const seconds = date.getSeconds().toString().padStart(2, "0");

      return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
    }
    return `${day}/${month}/${year}`;
  };

  const columns = [
    { title: "Tên Phòng ban", field: "name" },
    { title: "Mã phòng ban", field: "code" },
    { title: "Mô tả", field: "description" },
    { title: "Khối ngành", field: "industryBlock" },
    { title: "Số thành lập", field: "foundedNumber" },
    {
      title: "Ngày thành lập",
      field: "foundedDate",
      render: (rowData) => formatDateTime(rowData.foundedDate, false),
    },
    {
      title: "Hành động",
      render: (rowData) => (
        <MaterialButton
          item={rowData}
          onEdit={setShouldOpenEditorDialog}
          onDelete={setShouldOpenConfirmationDialog}
          setSelected={setSelectedDepartment}
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
          startIcon={<AddIcon />}
          onClick={() => {
            setShouldOpenEditorDialog(true);
            setSelectedDepartment(null);
          }}
        >
          Thêm mới
        </Button>
        <div className={classes.searchWrapper}>
          <TextField
            variant="outlined"
            fullWidth
            size="small"
            placeholder="Tìm kiếm phòng ban"
            classes={{
              root: classes.inputRoot,
              input: classes.searchInput,
            }}
            onChange={handleKeyDown}
            onKeyPress={handleKeyDown}
            inputProps={{ "aria-label": "search" }}
          />
          <div className={classes.searchIcon} onClick={handleIconClick}>
            <SearchIcon />
          </div>
        </div>
      </div>
      <TableCustom
        rowsPerPage={pageSize}
        setRowsPerPage={setPageSize}
        totalPages={totalPages}
        page={pageIndex}
        handleChangePage={handleChangePage}
        title={"Danh sách phòng ban"}
        datas={departmentList}
        columns={columns}
        checkbox={true}
        setSelectedList={setSelectedList}
      />
      <DepartmentForm />
      {shouldOpenConfirmationDialog && (
        <Dialog
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
            <Button onClick={handleConfirmDelete} color="primary" autoFocus>
              Xác nhận
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
});
