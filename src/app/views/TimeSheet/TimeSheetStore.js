import { makeAutoObservable, runInAction } from "mobx";
import {
  getTimeSheetById,
  getTimeSheetByWorkingDate,
  deleteTimeSheetById,
  deleteTimeSheets,
  searchStaffByName,
  findTimeSheetByStaff,
  searchTimeSheetByDto,
  getTimeSheetDetail,
  confirmTimeSheets,
  searchTimeSheetByPage,
  saveTimeSheet,
  updateTimeSheetStatus,
  exportTimeSheetsToExcel,
} from "./TimeSheetService";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";

export default class TimeSheetStore {
  timeSheetList = [];
  selectedTimeSheet = null;
  totalElements = 0;
  totalPages = 0;
  pageIndex = 1;
  pageSize = 10;
  keyword = "";
  projectId = "";
  isLoading = false;
  isOpenForm = false;
  isOpenPopup = false;

  constructor() {
    makeAutoObservable(this);
  }

  setIsLoading = (state) => {
    this.isLoading = state;
  };

  setKeyword = (value) => {
    this.keyword = value;
  };
  setProjectId = (value) => {
    this.projectId = value;
    this.search();
  };

  search = async () => {
    this.isLoading = true;

    const searchObject = {
      keyword: this.keyword,
      pageIndex: this.pageIndex,
      pageSize: this.pageSize,
      projectId: this.projectId,
    };

    try {
      let res = await searchTimeSheetByPage(searchObject);

      runInAction(() => {
        this.timeSheetList = res?.data?.content || [];
        this.totalElements = res?.data?.totalElements;
        this.totalPages = res?.data?.totalPages;
        this.isLoading = false;
      });
    } catch (error) {
      toast.warning("Failed to load staff.");
      this.isLoading = false;
    }
  };

  setIsOpenPopup = (state) => {
    this.isOpenPopup = state;
  };

  setIsOpenForm = (state) => {
    console.log(this);
    this.isOpenForm = state;
  };

  handleClose() {
    this.isOpenForm = false;
  }

  setSelectedTimeSheet = (value) => {
    this.selectedTimeSheet = value;
  };

  setPageIndex = (page) => {
    this.pageIndex = page;
  };
  setPageSize = (event) => {
    this.pageSize = Number(event.target.value) || 10;
    this.pageIndex = 1;
  };

  handleChangePage = (event, newPage) => {
    this.setPageIndex(newPage);
  };

  handleConfirmDelete = async () => {
    try {
      const res = await deleteTimeSheetById(this.selectedTimeSheet.id);
      if (res?.data) {
        this.isOpenPopup = false;
        toast.success("Deleted successfully.");
        this.search();
      } else {
        console.error(res?.data);
        toast.warning("Deleted failure.");
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occurred. Please try again later.");
    }
  };

  getById = async (id) => {
    if (id != null) {
      try {
        const data = await getTimeSheetById(id);
        this.selected = data?.data;
      } catch (error) {
        console.log(error);
      }
    } else {
      this.handleSelect(null);
    }
  };

  updateData = async (value) => {
    try {
      const res = await saveTimeSheet(value);
      this.handleClose(true);
      toast.success("Updated successfully!");
      this.search();
      return res?.data;
    } catch (error) {
      console.log(error);
      toast.warning("An error occurred while saving.");
    }
  };

  saveData = async (value) => {
    try {
      const res = await saveTimeSheet(value);
      this.handleClose(true);
      toast.success("Created successfully!");
      this.search();
      return res?.data;
    } catch (error) {
      console.log(error);
      toast.warning("An error occurred while saving.");
    }
  };

  resetStore = () => {
    this.timeSheetList = [];
    this.totalElements = 0;
    this.totalPages = 0;
    this.selectedTimeSheet = null;
    this.pageIndex = 1;
    this.pageSize = 10;
    this.keyword = "";
    this.isLoading = false;
    this.isOpenForm = false;
    this.isOpenPopup = false;
  };
}
