import { makeAutoObservable, runInAction } from "mobx";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createStaff, deleteStaffById, getAllStaffs, searchStaffByPage, updateStaff } from "./StaffService";

export default class StaffStore {
  staffList = [];
  selectedStaff = null;
  totalElements = 0;
  totalPages = 0;
  pageIndex = 1;
  pageSize = 10;
  keyword = "";
  isLoading = false;
  isOpenForm = false;
  isOpenPopup = false;

  constructor() {
    makeAutoObservable(this);
  }

  fetchStaffs = async () => {
    this.isLoading = true;

    try {
      // let res = await searchStaffByPage(searchObject);
      let res = await getAllStaffs();

      runInAction(() => {
        // this.staffList = res?.data?.content || [];
        this.staffList = res?.data || [];
        this.totalElements = res?.data?.totalElements;
        this.totalPages = res?.data?.totalPages;
        this.isLoading = false;
      });
      console.log("this.staffList", this.staffList);
    } catch (error) {
      toast.warning("Failed to load staff.");
      this.isLoading = false;
    }
  };

  searchStaffByPage = async () => {
    this.isLoading = true;

    const searchObject = {
      keyword: this.keyword,
      pageIndex: this.page,
      pageSize: this.pageSize,
    };

    try {
      let res = await searchStaffByPage(searchObject);

      runInAction(() => {
        this.staffList = res?.data?.content || [];
        this.totalElements = res?.data?.totalElements;
        this.totalPages = res?.data?.totalPages;
        this.isLoading = false;
      });
    } catch (error) {
      toast.warning("Failed to load staff.");
      this.isLoading = false;
    }
  };

  setLoadingInitial = (state) => {
    this.isLoading = state;
  };

  setKeyword = (value) => {
    this.keyword = value;
  };

  setIsOpenForm = (state) => {
    this.isOpenForm = state;
  };

  setIsOpenPopup = (state) => {
    this.isOpenPopup = state;
  };

  setSelectedStaff = (staff) => {
    this.selectedStaff = staff;
  };

  setPageIndex = (newPage) => {
    this.pageIndex = newPage;
  };

  setPageSize = (value) => {
    this.pageSize = value;
  };

  deleteStaff = async (id) => {
    try {
      await deleteStaffById(id);
      this.fetchStaffs();
    } catch (error) {
      console.error("Error deleting staff:", error);
    }
  };

  updateStaff = async (value) => {
    try {
      const res = await updateStaff(value);
      this.handleClose(true);
      toast.success("Cập nhật thành công");
      return res?.data;
    } catch (error) {
      console.log(error);
      toast.warning("Lỗi! Vui lòng thử lại");
    }
  };

  createStaff = async (staff) => {
    // try {
    //   const res = await createStaff(value);
    //   this.handleClose(true);
    //   toast.success("Thêm nhân viên thành công");
    //   return res?.data;
    // } catch (error) {
    //   console.log(error);
    //   toast.warning("Lỗi! Vui lòng thử lại");
    // }
    try {
      await createStaff(staff);
      this.fetchStaffs();
    } catch (error) {
      console.error("Failed to add staff", error);
    }
  };

  resetStore = () => {
    this.staffList = [];
    this.totalElements = 0;
    this.totalPages = 0;
    this.selectedStaff = null;
    this.pageIndex = 1;
    this.pageSize = 10;
    this.keyword = "";
    this.isLoading = false;
    this.isOpenForm = false;
    this.isOpenPopup = false;
  };
}
