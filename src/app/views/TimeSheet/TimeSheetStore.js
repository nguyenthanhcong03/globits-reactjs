import {makeAutoObservable, runInAction} from "mobx";
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
    exportTimeSheetsToExcel
} from "./TimeSheetService"
import "react-toastify/dist/ReactToastify.css";
import {toast} from "react-toastify";

export default class TimeSheetStore {
    listData = [];
    selected = null;
    totalElements = 0;
    totalPages = 0;
    page = 1;
    rowsPerPage = 10;
    keyword = "";
    projectId = "";
    loadingInitial = false;
    shouldOpenEditorDialog = false;
    shouldOpenConfirmationDialog = false;

    constructor() {
        makeAutoObservable(this);
    }


    setLoadingInitial = (state) => {
        this.loadingInitial = state;
    };

    setKeyword = (value) => {
        this.keyword = value;  // Cập nhật 'keyword' trong store
    }
    setProjectId = (value) => {
        this.projectId = value;  // Cập nhật 'keyword' trong store
        this.search();
    }

    search = async () => {
        this.loadingInitial = true;

        const searchObject = {
            keyword: this.keyword, pageIndex: this.page, pageSize: this.rowsPerPage, projectId: this.projectId
        };

        try {
            let res = await searchTimeSheetByPage(searchObject);

            runInAction(() => {
                this.listData = res?.data?.content || [];
                this.totalElements = res?.data?.totalElements;
                this.totalPages = res?.data?.totalPages;
                this.loadingInitial = false;
            });
        } catch (error) {
            toast.warning("Failed to load staff.");
            this.loadingInitial = false;
        }
    };

    setShouldOpenConfirmationDialog = (state) => {
        this.shouldOpenConfirmationDialog = state;
    }

    setShouldOpenEditorDialog = (state) => {
        console.log(this)
        this.shouldOpenEditorDialog = state;
    }


    handleClose() {
        this.shouldOpenEditorDialog = false;
    }

    updatePageData = (keyword) => {
        if (keyword !== "" && keyword !== undefined && keyword !== null) {
            this.page = 1;
            this.keyword = keyword;
        }
        this.search();
    };

    setSelected = (value) => {
        this.getById(value?.id);
    };

    setPage = (page) => {
        this.page = page;
        this.updatePageData();
    };
    setRowsPerPage = (event) => {
        this.rowsPerPage = Number(event.target.value) || 10;
        this.page = 1;
        this.updatePageData();
    };

    handleChangePage = (event, newPage) => {
        this.setPage(newPage);
    };

    handleConfirmDelete = async () => {
        try {
            const res = await deleteTimeSheetById(this.selected.id);
            if (res?.data) {
                this.shouldOpenConfirmationDialog = false
                toast.success("Deleted successfully.");
                this.search()
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

    handleSelect = (value) => {
        this.selected = value;
    };

    updateData = async (value) => {
        try {
            const res = await saveTimeSheet(value);
            this.handleClose(true);
            toast.success("Updated successfully!")
            this.search()
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
            this.search()
            return res?.data;
        } catch (error) {
            console.log(error);
            toast.warning("An error occurred while saving.");
        }
    };

    resetStore = () => {
        this.listData = [];
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