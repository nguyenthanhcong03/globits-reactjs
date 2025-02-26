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
import { useEffect, useRef } from "react";
import { formatDateTime } from "utils";
import { useStore } from "../../stores";
import StaffForm from "./StaffForm";

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

export default observer(function StaffIndex() {
  const classes = useStyles();
  const { staffStore } = useStore();
  const {
    fetchStaffs,
    searchStaffByPage,
    keyword,
    setKeyword,
    selectedStaff,
    setSelectedStaff,
    staffList,
    deleteStaff,
    pageSize,
    setIsOpenForm,
    isOpenForm,
    isOpenPopup,
    setIsOpenPopup,
  } = staffStore;

  const debounce = useDebounce(keyword, 300);
  const prevDebounceRef = useRef(null);

  useEffect(() => {
    if (prevDebounceRef.current !== debounce) {
      searchStaffByPage();
    } else {
      fetchStaffs();
    }
    // Cập nhật giá trị debounce trước đó
    prevDebounceRef.current = debounce;
  }, [debounce]);

  const columns = [
    {
      title: "STT",
      cellStyle: { width: "6%" },
      render: (rowData) => rowData.tableData.id + 1,
    },
    {
      title: "Họ và Tên",
      field: "displayName",
      render: (rowData) => rowData?.lastName + " " + rowData?.firstName,
    },
    {
      title: "Giới tính",
      field: "gender",
      render: (rowData) => {
        let genderText;
        switch (rowData?.gender) {
          case "M":
            genderText = "Nam";
            break;
          case "F":
            genderText = "Nữ";
            break;
          case "U":
            genderText = "Không rõ";
            break;
          default:
            genderText = "";
        }
        return genderText;
      },
    },
    {
      title: "Ngày sinh",
      field: "birthDate",
      render: (rowData) => formatDateTime(rowData?.birthDate, false),
    },
    {
      title: "Địa chỉ",
      field: "currentResidence",
    },
    { title: "Email", field: "email" },
    { title: "Số điện thoại", field: "phoneNumber" },
    {
      title: "Quốc tịch",
      field: "nationality",
      render: (rowData) => rowData?.nationality?.name,
    },
    {
      title: "Phòng ban",
      field: "department",
      render: (rowData) => rowData?.department?.name,
    },
    {
      title: "Thao tác",
      render: (rowData) => (
        <div>
          <div>
            <EditIcon
              color="primary"
              onClick={() => {
                setIsOpenForm(true);
                setSelectedStaff(rowData);
              }}
              cursor="pointer"
            />
            <DeleteIcon
              color="error"
              cursor="pointer"
              onClick={() => {
                setIsOpenPopup(true);
                setSelectedStaff(rowData);
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
            setSelectedStaff(null);
          }}
        >
          Thêm mới <AddIcon />
        </Button>
        <div className={classes.searchWrapper}>
          <TextField
            variant="outlined"
            fullWidth
            size="small"
            placeholder="Tìm kiếm nhân viên"
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
          title={"Danh sách nhân viên"}
          data={staffList}
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
              paddingLeft: "5px",
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
      {isOpenForm && <StaffForm />}

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
            <Button onClick={() => deleteStaff(selectedStaff.id)} color="primary" autoFocus>
              Có
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
});
