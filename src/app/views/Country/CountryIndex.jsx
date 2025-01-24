import React, { useEffect, useState } from "react";
import AddIcon from "@material-ui/icons/Add";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  makeStyles,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  TablePagination,
  Icon,
} from "@material-ui/core";
import { useFormik } from "formik";
import * as Yup from "yup";
import { v4 as uuidv4 } from "uuid";
import { set } from "lodash";
import useDebounce from "app/hooks/useDebounce";
import { observer } from "mobx-react";
import { useStore } from "app/stores";

const useStyles = makeStyles({
  container: {
    marginTop: "20px",
    padding: "20px",
  },
  table: {
    minWidth: 650,
  },
  button: {
    marginRight: "10px",
  },
});

export default observer(function CountryIndex() {
  const classes = useStyles();
  const { countryStore } = useStore(); // Đổi từ campaignStore sang agentStore
  const {
    countryList,
    fetchCountries,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    selectedCountry,
    setSelectedCountry,
    searchValue,
    setSearchValue,
    totalElements,
    addCountry,
    updateCountry,
    removeCountry,
  } = countryStore;

  const [openDialog, setOpenDialog] = useState(false);
  const debounce = useDebounce(searchValue, 500);

  useEffect(() => {
    fetchCountries();
  }, [currentPage, pageSize, debounce]);

  const formik = useFormik({
    initialValues: {
      name: selectedCountry?.name || "",
      code: selectedCountry?.code || "",
      description: selectedCountry?.description || "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      code: Yup.string().required("Code is required"),
      description: Yup.string().required("Description is required"),
    }),
    onSubmit: (values) => {
      console.log(values);
      if (selectedCountry) {
        updateCountry(values);
        handleCloseDialog();
      } else {
        addCountry(values);
        handleCloseDialog();
      }
    },
  });

  // Hàm set lại currentPage
  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPageSize(parseInt(event.target.value, 10));
    setCurrentPage(0);
  };

  const handleOpenDialog = () => {
    // selectedCountry(null);
    formik.resetForm();
    setOpenDialog(true);
  };

  // Đóng form
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <div className={classes.container}>
      <Button
        variant="contained"
        color="primary"
        style={{ marginBottom: "20px" }}
        onClick={() => {
          handleOpenDialog();
          setSelectedCountry(null);
        }}
        startIcon={<AddIcon />}
      >
        Thêm mới
      </Button>
      <TextField
        label="Tìm kiếm"
        variant="outlined"
        fullWidth
        margin="normal"
        onChange={(e) => setSearchValue(e.target.value)}
        value={searchValue}
      />
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="country table">
          <TableHead>
            <TableRow>
              <TableCell>Tên</TableCell>
              <TableCell>Mã</TableCell>
              <TableCell>Mô tả</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {countryList.length > 0 &&
              countryList.map((country) => (
                <TableRow key={country.id}>
                  <TableCell>{country.name}</TableCell>
                  <TableCell>{country.code}</TableCell>
                  <TableCell>{country.description}</TableCell>
                  <TableCell>
                    <Icon>
                      <EditIcon
                        color="primary"
                        onClick={() => {
                          handleOpenDialog();
                          setSelectedCountry(country);
                        }}
                      />
                    </Icon>
                    <Icon>
                      <DeleteIcon
                        color="error"
                        onClick={() => removeCountry(country.id)}
                      />
                    </Icon>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
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

      {/* Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <form onSubmit={formik.handleSubmit}>
          <DialogTitle>
            {selectedCountry ? "Chỉnh sửa quốc gia" : "Thêm mới quốc gia"}
          </DialogTitle>
          <DialogContent>
            <TextField
              label="Tên quốc gia"
              fullWidth
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
            />
            <TextField
              label="Mã quốc gia"
              fullWidth
              name="code"
              value={formik.values.code}
              onChange={formik.handleChange}
            />
            <TextField
              label="Mô tả"
              fullWidth
              name="description"
              value={formik.values.description}
              onChange={formik.handleChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="primary">
              Hủy
            </Button>
            <Button color="primary" type="submit">
              {selectedCountry ? "Lưu" : "Thêm"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
});
