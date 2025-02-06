import axios from "axios";
import ConstantList from "../../appConfig";

const API_PATH = ConstantList.API_ENPOINT + "/api/timesheet";

// API to get a timesheet by ID
export const getTimeSheetById = (timeSheetId) => {
    const url = `${API_PATH}/${timeSheetId}`;
    return axios.get(url);
};

// API to get timesheets by working date
export const getTimeSheetByWorkingDate = (workingDate, pageIndex, pageSize) => {
    const url = `${API_PATH}/workingdate/${workingDate}/${pageSize}/${pageIndex}`;
    return axios.get(url);
};

// API to delete a timesheet by ID
export const deleteTimeSheetById = (timeSheetId) => {
    const url = `${API_PATH}/${timeSheetId}`;
    return axios.delete(url);
};

// API to delete multiple timesheets
export const deleteTimeSheets = (timeSheets) => {
    return axios.delete(API_PATH, { data: timeSheets });
};

// API to search staff by name
export const searchStaffByName = (name, pageIndex, pageSize) => {
    const url = `${API_PATH}/searchStaff/${name}/${pageIndex}/${pageSize}`;
    return axios.get(url);
};

// API to find timesheets by staff name
export const findTimeSheetByStaff = (staffName, pageIndex, pageSize) => {
    const url = `${API_PATH}/staff/${staffName}/${pageIndex}/${pageSize}`;
    return axios.get(url);
};

// API to search timesheets by DTO
export const searchTimeSheetByDto = (searchDto, pageIndex, pageSize) => {
    const url = `${API_PATH}/searchByDto/${pageIndex}/${pageSize}`;
    return axios.post(url, searchDto);
};

// API to get timesheet details by ID
export const getTimeSheetDetail = (timeSheetId, pageIndex, pageSize) => {
    const url = `${API_PATH}/detail/${timeSheetId}/${pageIndex}/${pageSize}`;
    return axios.get(url);
};

// API to confirm timesheets
export const confirmTimeSheets = (timeSheets) => {
    const url = `${API_PATH}/confirm`;
    return axios.post(url, timeSheets);
};

// API to search timesheets by page
export const searchTimeSheetByPage = (searchDto) => {
    const url = `${API_PATH}/search-by-page`;
    return axios.post(url, searchDto);
};

// API to save or update a timesheet
export const saveTimeSheet = (timeSheetDto) => {
    const url = timeSheetDto?.id ? `${API_PATH}/${timeSheetDto?.id}` : API_PATH;
    const method = timeSheetDto?.id ? axios.put : axios.post;
    return method(url, timeSheetDto);
};

// API to update status of a timesheet
export const updateTimeSheetStatus = (timeSheetId, workingStatusId) => {
    const url = `${API_PATH}/update-status/${timeSheetId}/${workingStatusId}`;
    return axios.put(url);
};

// API to export timesheets to Excel
export const exportTimeSheetsToExcel = (searchDto) => {
    const url = `${API_PATH}/exportExcel`;
    return axios.post(url, searchDto, {
        responseType: "blob", // This is necessary for file downloads
    });
};
