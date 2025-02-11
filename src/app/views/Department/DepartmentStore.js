import { makeAutoObservable, runInAction } from "mobx";
import {
  createDepartment,
  deleteDepartment,
  editDepartment,
  getDepartment,
  pagingDepartments,
} from "../Department/DepartmentService";

export default class DepartmentStore {
  departmentList = [];
  selectedDepartment = null;
  selectedList = [];
  parentId = "";
  parent = null;
  totalElements = 0;
  totalPages = 0;
  pageIndex = 1;
  pageSize = 10;
  keyword = "";
  isLoading = false;
  isOpenForm = false;
  isOpenPopup = false;
  isOpenSelectDepartmentDialog = false;

  constructor() {
    makeAutoObservable(this);
  }

  setIsLoading = (state) => {
    this.isLoading = state;
  };
  setParent = (state) => {
    this.parent = state;
  };
  setSelectedList = (state) => {
    this.selectedList = state;
  };
  setIsOpenSelectDepartmentDialog = (state) => {
    this.isOpenSelectDepartmentDialog = state;
  };
  setSelectedDepartment = (value) => {
    this.selectedDepartment = value;
  };
  setKeyword = (value) => {
    this.keyword = value;
  };

  fetchDepartments = async () => {
    this.isLoading = true;

    const searchObject = {
      keyword: this.keyword,
      pageIndex: this.pageIndex,
      pageSize: this.pageSize,
    };

    function flattenDepartments(departments) {
      let result = [];

      function recurse(deptList) {
        deptList.forEach((dept) => {
          result.push(dept);
          if (dept.children && dept.children.length > 0) {
            recurse(dept.children);
          }
        });
      }
      recurse(departments);
      return result;
    }
    // function flattenDepartments(departments, parentId = null) {
    //   return departments.flatMap((department) => {
    //     const { children, ...rest } = department;
    //     return [
    //       { ...rest, parentId },
    //       ...flattenDepartments(children || [], department.id),
    //     ];
    //   });
    // }

    try {
      let res = await pagingDepartments(searchObject);
      console.log(res.data.content);

      runInAction(() => {
        if (res?.data?.content) {
          this.departmentList = flattenDepartments(res.data.content);
        } else {
          this.departmentList = [];
        }
        this.totalElements = res?.data?.totalElements;
        this.totalPages = res?.data?.totalPages;
        this.isLoading = false;
      });
    } catch (error) {
      console.log("error", error);
      this.isLoading = false;
    }
  };

  setIsOpenPopup = (state) => {
    this.isOpenPopup = state;
  };

  setIsOpenForm = (state) => {
    this.isOpenForm = state;
  };

  updatePageData = (keyword) => {
    if (keyword !== "" && keyword !== undefined && keyword !== null) {
      this.pageIndex = 1;
      this.keyword = keyword;
    }
    this.fetchDepartments();
  };

  setPageIndex = (pageIndex) => {
    this.pageIndex = pageIndex;
    this.updatePageData();
  };

  setPageSize = (event) => {
    this.pageSize = Number(event.target.value) || 10;
    this.pageIndex = 1;
    this.updatePageData();
  };

  handleChangePage = (event, newPage) => {
    this.setPage(newPage);
  };

  handleConfirmDelete = async () => {
    try {
      console.log("hien", this.selectedDepartment.id);
      const res = await deleteDepartment(this.selectedDepartment.id);
      if (res?.data) {
        this.handleClose(true);
        console.log("Deleted successfully.");
      } else {
        console.error(res?.data);
        console.log("Deleted failure.");
      }
    } catch (error) {
      console.log(error);
      console.log("An error occurred. Please try again later.");
    }
  };

  getDepartment = async (id) => {
    if (id != null) {
      try {
        const data = await getDepartment(id);
        this.handleSelectDepartment(data?.data);
      } catch (error) {
        console.log(error);
      }
    } else {
      this.handleSelectDepartment(null);
    }
  };

  handleSelectDepartment = (department) => {
    this.selectedDepartment = department;
  };

  updateDepartment = async (department) => {
    try {
      console.log(this);
      const res = await editDepartment(department);
      this.handleClose(true);
      console.log("Updated successfully!");
      return res?.data;
    } catch (error) {
      console.log(error);
      console.log("An error occurred while updating.");
    }
  };

  createDepartment = async (department) => {
    try {
      await createDepartment(department);
      this.fetchDepartments();
    } catch (error) {
      console.error("Failed to add department", error);
    }
  };

  resetDepartmentStore = () => {
    this.DepartmentList = [];
    this.totalElements = 0;
    this.totalPages = 0;
    this.selectedDepartment = null;
    this.pageIndex = 1;
    this.pageSize = 10;
    this.keyword = "";
    this.isLoading = false;
    this.isOpenForm = false;
    this.isOpenPopup = false;
  };
}
