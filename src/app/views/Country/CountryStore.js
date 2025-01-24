import { makeAutoObservable, runInAction } from "mobx";
import {
  createCountry,
  deleteCountry,
  editCountry,
  pagingCountries,
} from "./CountryService";

export default class CountryStore {
  countryList = [];
  selectedCountry = null;
  totalElements = 0;
  currentPage = 0;
  pageSize = 10;
  searchValue = "";
  loadingInitial = false;
  shouldOpenEditorDialog = false;
  shouldOpenConfirmationDialog = false;
  loading = false;

  constructor() {
    makeAutoObservable(this);
  }

  // Fetch tất cả các country từ API
  fetchCountries = async () => {
    this.loading = true;
    let searchObject = {
      pageIndex: this.currentPage,
      pageSize: this.pageSize,
      keyword: this.searchValue,
    };
    try {
      const response = await pagingCountries(searchObject);
      runInAction(() => {
        this.countryList = response?.data?.content || [];
        this.totalElements = response?.data?.totalElements;
        this.loading = false;
      });
      console.log("this.countryList", this.countryList);
    } catch (error) {
      console.error("Failed to fetch countries", error);
      this.loading = false;
    }
  };

  // Thêm country mới
  addCountry = async (country) => {
    try {
      await createCountry(country);
      this.fetchCountries();
    } catch (error) {
      console.error("Failed to add country", error);
    }
  };

  // Cập nhật country
  updateCountry = async (country) => {
    try {
      await editCountry(country);
      this.fetchCountries();
    } catch (error) {
      console.error("Failed to edit country", error);
    }
  };

  // Xóa country
  removeCountry = async (id) => {
    try {
      await deleteCountry(id);
      this.fetchCountries();
    } catch (error) {
      console.error("Error deleting country:", error);
    }
  };

  // Chọn country để chỉnh sửa
  setSelectedCountry = (country) => {
    this.selectedCountry = country;
  };

  setSearchValue = (value) => {
    this.searchValue = value;
  };

  setPageSize = (value) => {
    this.pageSize = value;
  };

  setCurrentPage = (newPage) => {
    this.currentPage = newPage;
  };
}

export const countryStore = new CountryStore();
