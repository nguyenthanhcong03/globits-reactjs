import { makeAutoObservable, runInAction } from "mobx";
import axios from "axios";
import ConstantList from "../../appConfig";
import { pagingDepartments } from "./DepartmentService";

const API_PATH = ConstantList.API_ENPOINT + "/api/hRDepartment";
const API_PATH_CORE = ConstantList.API_ENPOINT + "/api/department";

export default class DepartmentStore {
  departments = [];
  selectedDepartment = null;
  expanded = {};
  currentPage = 0;
  pageSize = 10;
  totalElements = 0;
  searchValue = "";

  constructor() {
    makeAutoObservable(this);
  }

  setLoadingInitial = (state) => {
    this.loadingInitial = state;
  };

  setKeyword(value) {
    this.searchValue = value; // Cập nhật 'keyword' trong store
  }

  search = async () => {
    this.loadingInitial = true;

    const searchObject = {
      pageIndex: this.currentPage + 1,
      pageSize: this.pageSize,
      keyword: this.searchValue,
    };

    try {
      let res = await pagingDepartments(searchObject);

      runInAction(() => {
        this.departments = res?.data?.content || [];
        this.totalElements = res?.data?.totalElements;
        this.loadingInitial = false;
      });
    } catch (error) {
      // toast.warning("Failed to load countries.");
      this.loadingInitial = false;
    }
  };
}
