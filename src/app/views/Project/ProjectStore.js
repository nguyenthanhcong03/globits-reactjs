import { makeAutoObservable, runInAction } from "mobx";
import { createProject, deleteProject, getProject, searchProjectsByPage, updateProject } from "./ProjectService";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";

export default class ProjectStore {
  projectList = [];
  selectedProject = null;
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

  fetchProjects = async () => {
    this.isLoading = true;

    const searchObject = {
      keyword: this.keyword,
      pageIndex: this.pageIndex,
      pageSize: this.pageSize,
    };

    try {
      let res = await searchProjectsByPage(searchObject);
      console.log(res);

      runInAction(() => {
        // Chỉ cập nhật dữ liệu nếu keyword chưa thay đổi
        this.projectList = res?.data?.content || [];
        console.log(this.projectList);
        this.totalElements = res?.data?.totalElements;
        this.totalPages = res?.data?.totalPages;
        this.isLoading = false;
      });
    } catch (error) {
      toast.warning("Failed to load project.");
      this.isLoading = false;
    }
  };

  getById = async (id) => {
    if (id != null) {
      try {
        const data = await getProject(id);
        this.selectedProject = data?.data;
      } catch (error) {
        console.log(error);
      }
    } else {
      this.setSelectedProject(null);
    }
  };
  deleteProject = async (id) => {
    try {
      await deleteProject(id);
      this.fetchProjects();
    } catch (error) {
      console.error("Error deleting project:", error);
    }
    this.setIsOpenPopup(false);
  };

  updateProject = async (value) => {
    try {
      await updateProject(value);
      this.fetchProjects();
    } catch (error) {
      console.error("Error edit project:", error);
    }
  };

  createProject = async (value) => {
    try {
      await createProject(value);
      this.fetchProjects();
    } catch (error) {
      console.error("Failed to add project", error);
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

  setSelectedProject = (value) => {
    this.selectedProject = value;
  };

  setPageIndex = (newPage) => {
    this.pageIndex = newPage;
  };

  setPageSize = (value) => {
    this.pageSize = value;
  };
}
