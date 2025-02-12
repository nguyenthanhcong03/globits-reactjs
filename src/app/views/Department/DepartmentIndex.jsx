import { TextField } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import { makeStyles } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import SearchIcon from "@material-ui/icons/Search";
import useDebounce from "app/hooks/useDebounce";
import MaterialTable from "material-table";
import { observer } from "mobx-react";
import { useEffect } from "react";
import { formatDateTime } from "utils";
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

export default observer(function DepartmentIndex() {
  const classes = useStyles();

  const { departmentStore } = useStore();
  const {
    fetchDepartments,
    keyword,
    setKeyword,
    pageIndex,
    selectedDepartment,
    isOpenForm,
    setIsOpenForm,
    setSelectedDepartment,
    departmentList,
    setIsOpenPopup,
    pageSize,
    setPageSize,
    totalPages,
    handleChangePage,
    isOpenPopup,
    deleteDepartment,
    setSelectedList,
  } = departmentStore;

  const debounce = useDebounce(keyword, 300);

  useEffect(() => {
    fetchDepartments();
  }, [debounce]);

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
        <div>
          <div>
            <EditIcon
              color="primary"
              onClick={() => {
                setIsOpenForm(true);
                setSelectedDepartment(rowData);
              }}
              cursor="pointer"
            />
            <DeleteIcon
              color="error"
              cursor="pointer"
              onClick={() => {
                setIsOpenPopup(true);
                setSelectedDepartment(rowData);
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
          startIcon={<AddIcon />}
          onClick={() => {
            setIsOpenForm(true);
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
            onChange={(e) => {
              setKeyword(e.target.value);
            }}
            value={keyword}
            inputProps={{ "aria-label": "search" }}
          />
          <div className={classes.searchIcon}>
            <SearchIcon />
          </div>
        </div>
      </div>
      <MaterialTable
        title={"Danh sách phòng ban"}
        data={departmentList}
        columns={columns}
        parentChildData={(row, rows) => {
          var list = rows.find((a) => a.id === row.parentId);
          return list;
        }}
        options={{
          selection: true,
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
      {isOpenForm && <DepartmentForm />}
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
            <Button onClick={() => deleteDepartment(selectedDepartment.id)} color="primary" autoFocus>
              Có
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
});
