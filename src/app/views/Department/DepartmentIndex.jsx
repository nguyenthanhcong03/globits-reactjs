import React, { Fragment, useEffect, useState } from "react";
import MaterialTable from "material-table";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import {
  Box,
  Button,
  Checkbox,
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@material-ui/core";
import {
  deleteDepartment,
  editDepartment,
  getDepartment,
  getTreeView,
  pagingDepartments,
} from "./DepartmentService";
import DepartmentForm from "./DepartmentForm";
import DeletePopup from "./DeletePopup";
import { set } from "lodash";
import { TreeItem, TreeView } from "@material-ui/lab";
import { CheckBox } from "@material-ui/icons";
import useDebounce from "app/hooks/useDebounce";

<MaterialTable
  // other props
  parentChildData={(row, rows) => rows.find((a) => a.id === row.parentId)}
/>;
function DepartmentIndex() {
  const [departments, setDepartments] = useState([]);
  const [isOpenForm, setIsOpenForm] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [isOpenDeletePopup, setIsOpenDeletePopup] = useState(false);
  const [expanded, setExpanded] = useState({});
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const debounce = useDebounce(searchValue, 500);

  const handleToggle = (id) => {
    setExpanded((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleOpenForm = (type, id) => {
    if (type === "edit") {
      handleGetDepartment(id);
    } else if (type === "add") {
      setSelectedDepartment(null);
    }
    setTimeout(() => {
      setIsOpenForm(true);
    }, 200);
  };
  const handleCloseForm = () => {
    setSelectedDepartment(null);
    setIsOpenForm(false);
  };

  const handleGetDepartment = async (id) => {
    let data = await getDepartment(id);
    setSelectedDepartment(data.data);
  };

  const handleOpenDeletePopup = (id) => {
    handleGetDepartment(id);
    setIsOpenDeletePopup(true);
  };

  const handleCloseDeletePopup = () => {
    setSelectedDepartment(null);
    setIsOpenDeletePopup(false);
  };

  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPageSize(parseInt(event.target.value, 10));
    setCurrentPage(0);
  };

  const loadDepartments = async () => {
    let searchObject = {
      pageIndex: currentPage + 1,
      pageSize: pageSize,
      keyword: searchValue,
    };
    let data = await pagingDepartments(searchObject);
    console.log("loadDepartments ~ data:", data.data.content);

    setDepartments(data.data.content);
    setTotalElements(data.data.totalElements);
  };

  useEffect(() => {
    loadDepartments();
  }, [currentPage, pageSize, debounce]);

  const renderRows = (departments, level = 0) => {
    return departments.map((department) => (
      <Fragment key={department.id}>
        <TableRow>
          <TableCell style={{ paddingLeft: level * 10 }}>
            {department.children && department.children.length > 0 && (
              <IconButton onClick={() => handleToggle(department.id)}>
                {expanded[department.id] ? (
                  <ExpandMoreIcon />
                ) : (
                  <ChevronRightIcon />
                )}
              </IconButton>
            )}
          </TableCell>
          <TableCell style={{ paddingLeft: level * 10 }}>
            <Checkbox
              color="primary"
              inputProps={{ "aria-label": "secondary checkbox" }}
            />
          </TableCell>
          <TableCell>
            <EditIcon
              color="primary"
              cursor="pointer"
              onClick={() => handleOpenForm("edit", department.id)}
            />
            <DeleteIcon
              color="error"
              cursor="pointer"
              onClick={() => handleOpenDeletePopup(department.id)}
            />
          </TableCell>
          <TableCell>{department.name}</TableCell>
          <TableCell>{department.code}</TableCell>
          <TableCell>{department.description}</TableCell>
        </TableRow>
        {expanded[department.id] &&
          department.children &&
          renderRows(department.children, level + 1)}
      </Fragment>
    ));
  };

  return (
    <div style={{ backgroundColor: "white", padding: "20px" }}>
      <Button
        startIcon={<AddIcon />}
        variant="contained"
        color="primary"
        onClick={() => handleOpenForm("add")}
      >
        Thêm mới
      </Button>
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        margin={"10px 0px"}
      >
        <Typography variant="h6">Danh sách phòng ban</Typography>
        <TextField
          label="Tìm kiếm"
          variant="outlined"
          size="small"
          style={{ width: "30%" }}
          onChange={(e) => setSearchValue(e.target.value)}
        />
      </Box>
      <Table
        style={{
          width: "100%",
          backgroundColor: "white",
          margin: "auto",
          border: "1px solid #e1e1e1",
        }}
      >
        <TableHead>
          <TableRow>
            <TableCell style={{ width: "40px" }}></TableCell>
            <TableCell style={{ width: "70px" }}>
              <Checkbox
                color="primary"
                inputProps={{ "aria-label": "secondary checkbox" }}
              />
            </TableCell>
            <TableCell style={{ width: "80px" }}>Thao tác</TableCell>
            <TableCell>Tên phòng ban</TableCell>
            <TableCell>Mã phòng ban</TableCell>
            <TableCell>Mô tả</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>{renderRows(departments)}</TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        labelRowsPerPage="Số hàng mỗi trang:"
        component="div"
        count={totalElements}
        rowsPerPage={pageSize}
        page={currentPage}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      {isOpenForm && (
        <DepartmentForm
          isOpenForm={isOpenForm}
          onClose={handleCloseForm}
          selectedDepartment={selectedDepartment}
          departments={departments}
          loadDepartments={loadDepartments}
        />
      )}
      {isOpenDeletePopup && (
        <DeletePopup
          isOpenDeletePopup={isOpenDeletePopup}
          onClose={handleCloseDeletePopup}
          loadDepartments={loadDepartments}
          selectedDepartment={selectedDepartment}
        />
      )}
    </div>
  );
}

export default DepartmentIndex;
