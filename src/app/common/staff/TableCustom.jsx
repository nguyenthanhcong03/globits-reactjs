import React, { memo } from "react";
import MaterialTable from "material-table";
import PaginationCustom from "./PaginationCustom";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  pagination: {
    "& > *": {
      marginTop: theme.spacing(2),
    },
    display: "flex",
    justifyContent: "end",
  },
}));
function TableCustom({
  headerStyle,
  rowsPerPage,
  setRowsPerPage,
  totalPages,
  page,
  handleChangePage,
  datas,
  columns,
  title,
  checkbox = false,
  setSelectedList,
}) {
  const classes = useStyles();
  return (
    <>
      <MaterialTable
        columns={columns}
        data={datas}
        title={title}
        options={{
          selection: checkbox,
          actionsColumnIndex: -1,
          paging: false,
          search: false,
          toolbar: false,
          draggable: false,
          headerStyle: {
            ...headerStyle,
            paddingLeft: "15px",
            paddingRight: "15px",
            position: "sticky",
            fontWeight: "700",
            fontSize: "14px",
            lineHeight: "24px",
            color: "rgba(0, 0, 0, 0.87)",
          },
          // maxBodyHeight: maxBodyHeight,  // Set max height to make body scrollable
        }}
        onSelectionChange={
          checkbox ? (rows) => setSelectedList(rows) : undefined
        } // Conditionally set onSelectionChange
        parentChildData={(row, rows) =>
          rows.find((a) => a.id === row?.parentId)
        }
      />
      <div className={classes.pagination}>
        <PaginationCustom
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
          totalPages={totalPages}
          page={page}
          handleChangePage={handleChangePage}
        />
      </div>
    </>
  );
}

export default TableCustom;
