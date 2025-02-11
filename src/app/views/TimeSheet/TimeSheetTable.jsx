import { Button, makeStyles, TextField } from "@material-ui/core";
import MaterialTable from "material-table";
import React, { useEffect } from "react";
import AddIcon from "@material-ui/icons/Add";
import { differenceInMinutes } from "date-fns";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import { useStore } from "../../stores";
import { formatDateTime } from "utils";
import useDebounce from "app/hooks/useDebounce";
import SearchIcon from "@material-ui/icons/Search";
import { de } from "date-fns/locale";

const useStyles = makeStyles((theme) => ({
  content: {
    width: "80%",
    padding: "20px",
    backgroundColor: "#fff",
  },
  title: {
    fontWeight: "bold",
    width: "100%",
    padding: "10px",
    textAlign: "center",
    color: "#fff",
    fontSize: "20px",
    backgroundColor: "#01C0C8",
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
}));
function TimeSheetTable() {
  const classes = useStyles();
  const { projectStore, timeSheetStore } = useStore();
  const { search, setIsOpenForm, setSelectedTimeSheet, timeSheetList, setIsOpenPopup, pageSize, keyword, setKeyword } =
    timeSheetStore;

  useEffect(() => {
    search();
  }, []);

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
    <div className={classes.content}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Button
          variant="contained"
          color="primary"
          disableElevation
          className={classes.button}
          onClick={() => {
            setIsOpenForm(true);
            setSelectedTimeSheet(null);
          }}
        >
          Thêm mới <AddIcon />
        </Button>
      </div>
      <MaterialTable
        title={"Bảng thời gian"}
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
  );
}

export default TimeSheetTable;
