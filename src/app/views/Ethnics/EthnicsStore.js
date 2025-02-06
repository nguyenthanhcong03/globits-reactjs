import { makeAutoObservable, runInAction } from "mobx";
import {
  pagingEthnicities,
  getEthnics,
  createEthnics,
  editEthnics,
  deleteEthnics,
  getAllEthnicities,
} from "./EthnicsService"; // Assuming these are the correct imports
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";

export default class EthnicsStore {
  ethnicList = [];
  selected = null;
  totalElements = 0;
  totalPages = 0;
  page = 1;
  rowsPerPage = 10;
  keyword = "";
  loadingInitial = false;
  shouldOpenEditorDialog = false;
  shouldOpenConfirmationDialog = false;

  constructor() {
    makeAutoObservable(this);
  }

  // Set loading state for initial data load
  setLoadingInitial = (state) => {
    this.loadingInitial = state;
  };

  // Set search keyword
  setKeyword = (value) => {
    this.keyword = value;
  };

  // Search for ethnics data
  search = async () => {
    this.loadingInitial = true;

    const searchObject = {
      keyword: this.keyword,
      pageIndex: this.page,
      pageSize: this.rowsPerPage,
    };

    try {
      let res = await pagingEthnicities(searchObject);

      console.log("search ~ res:", res);

      runInAction(() => {
        this.ethnicList = res?.data?.content || [];
        this.totalElements = res?.data?.totalElements;
        this.totalPages = res?.data?.totalPages;
        this.loadingInitial = false;
      });
    } catch (error) {
      toast.warning("Failed to load ethnic data.");
      this.loadingInitial = false;
    }
  };

  // Set dialog visibility for confirmation
  setShouldOpenConfirmationDialog = (state) => {
    this.shouldOpenConfirmationDialog = state;
  };

  // Set dialog visibility for editor
  setShouldOpenEditorDialog = (state) => {
    this.shouldOpenEditorDialog = state;
  };

  // Handle close for both dialogs
  handleClose = () => {
    this.shouldOpenEditorDialog = false;
    this.shouldOpenConfirmationDialog = false;
  };

  // Update the page data when keyword or page changes
  updatePageData = (keyword) => {
    if (keyword !== "" && keyword !== undefined && keyword !== null) {
      this.page = 1;
      this.keyword = keyword;
    }
    this.search();
  };

  // Set selected ethnic
  setSelected = (ethnic) => {
    this.selected = ethnic;
  };

  // Set the page number
  setPage = (page) => {
    this.page = page;
    this.updatePageData();
  };

  // Set rows per page and reset to first page
  setRowsPerPage = (event) => {
    this.rowsPerPage = Number(event.target.value) || 10;
    this.page = 1;
    this.updatePageData();
  };

  // Handle page change
  handleChangePage = (event, newPage) => {
    this.setPage(newPage);
  };

  // Confirm delete action
  handleConfirmDelete = async () => {
    try {
      const res = await deleteEthnics(this.selected.id);
      if (res?.data) {
        this.handleClose();
        toast.success("Deleted successfully.");
      } else {
        console.error(res?.data);
        toast.warning("Failed to delete.");
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occurred. Please try again later.");
    }
  };

  // Get a specific ethnic by ID
  getEthnic = async (id) => {
    if (id != null) {
      try {
        const data = await getEthnics(id);
        this.setSelected(data?.data);
      } catch (error) {
        console.log(error);
      }
    } else {
      this.setSelected(null);
    }
  };

  getAllEthnic = async () => {
    this.loadingInitial = true;
    try {
      let res = await getAllEthnicities();

      console.log(res);

      runInAction(() => {
        this.ethnicList = res?.data || [];
        this.loadingInitial = false;
      });
    } catch (error) {
      toast.warning("Failed to load ethnic data.");
      this.loadingInitial = false;
    }
  };

  // Update ethnic information
  updateEthnic = async (ethnic) => {
    try {
      const res = await editEthnics(ethnic);
      this.handleClose();
      toast.success("Updated successfully!");
      return res?.data;
    } catch (error) {
      console.log(error);
      toast.warning("An error occurred while saving.");
    }
  };

  // Save a new ethnic
  saveEthnic = async (ethnic) => {
    try {
      const res = await createEthnics(ethnic);
      this.handleClose();
      toast.success("Created successfully!");
      return res?.data;
    } catch (error) {
      console.log(error);
      toast.warning("An error occurred while saving.");
    }
  };

  // Reset the store state
  resetEthnicsStore = () => {
    this.ethnicList = [];
    this.totalElements = 0;
    this.totalPages = 0;
    this.selected = null;
    this.page = 1;
    this.rowsPerPage = 10;
    this.keyword = "";
    this.loadingInitial = false;
    this.shouldOpenEditorDialog = false;
    this.shouldOpenConfirmationDialog = false;
  };
}
