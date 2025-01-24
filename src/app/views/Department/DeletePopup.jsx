import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@material-ui/core";
import React from "react";
import { deleteDepartment } from "./DepartmentService";

function DeletePopup({
  isOpenDeletePopup,
  onClose,
  loadDepartments,
  selectedDepartment,
}) {
  const handleDeleteDepartment = async (id) => {
    if (selectedDepartment.children.length > 0) {
      alert("Không thể xóa phòng ban!");
    } else {
      try {
        await deleteDepartment(id);
        loadDepartments();
        onClose();
      } catch (error) {
        console.error("Error deleting deparment:", error);
      }
    }
  };

  return (
    <Dialog open={isOpenDeletePopup} onClose={onClose}>
      <DialogTitle>Bạn có chắc muốn xóa phòng ban này không?</DialogTitle>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Hủy
        </Button>
        <Button
          color="primary"
          type="submit"
          onClick={() => handleDeleteDepartment(selectedDepartment.id)}
        >
          Đồng ý
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default DeletePopup;
