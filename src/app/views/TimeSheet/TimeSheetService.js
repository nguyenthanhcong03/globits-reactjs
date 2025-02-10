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

// import axios from "axios";

// const API_URL = "http://localhost:8080/api/timesheet"; // Đổi thành URL của backend
// const token = localStorage.getItem("token"); // Lấy Bearer Token từ localStorage

// const axiosInstance = axios.create({
//   baseURL: API_URL,
//   headers: {
//     Authorization: `Bearer ${token}`,
//     "Content-Type": "application/json",
//   },
// });

// // ✅ 1. Lấy TimeSheet theo ID
// export const getTimeSheetById = async (id) => {
//   try {
//     const response = await axiosInstance.get(`/${id}`);
//     return response.data;
//   } catch (error) {
//     console.error("Lỗi khi lấy TimeSheet:", error);
//     return null;
//   }
// };

// // ✅ 2. Lấy danh sách TimeSheet theo ngày làm việc
// export const getTimeSheetByWorkingDate = async (workingDate, pageIndex, pageSize) => {
//   try {
//     const response = await axiosInstance.get(`/workingdate/${workingDate}/${pageSize}/${pageIndex}`);
//     return response.data;
//   } catch (error) {
//     console.error("Lỗi khi lấy TimeSheet theo ngày:", error);
//     return null;
//   }
// };

// // ✅ 3. Xóa TimeSheet theo ID
// export const deleteTimeSheet = async (id) => {
//   try {
//     const response = await axiosInstance.delete(`/${id}`);
//     return response.data;
//   } catch (error) {
//     console.error("Lỗi khi xóa TimeSheet:", error);
//     return false;
//   }
// };

// // ✅ 4. Xóa nhiều TimeSheet
// export const deleteMultipleTimeSheets = async (list) => {
//   try {
//     const response = await axiosInstance.delete("/", { data: list });
//     return response.data;
//   } catch (error) {
//     console.error("Lỗi khi xóa nhiều TimeSheet:", error);
//     return false;
//   }
// };

// // ✅ 5. Tìm kiếm nhân viên theo tên
// export const searchStaffByName = async (name, pageIndex, pageSize) => {
//   try {
//     const response = await axiosInstance.get(`/searchStaff/${name}/${pageIndex}/${pageSize}`);
//     return response.data;
//   } catch (error) {
//     console.error("Lỗi khi tìm nhân viên:", error);
//     return null;
//   }
// };

// // ✅ 6. Tìm TimeSheet theo nhân viên
// export const getTimeSheetByStaff = async (name, pageIndex, pageSize) => {
//   try {
//     const response = await axiosInstance.get(`/staff/${name}/${pageIndex}/${pageSize}`);
//     return response.data;
//   } catch (error) {
//     console.error("Lỗi khi tìm TimeSheet theo nhân viên:", error);
//     return null;
//   }
// };

// // ✅ 7. Tìm kiếm TimeSheet bằng DTO
// export const searchTimeSheetByDto = async (searchDto, pageIndex, pageSize) => {
//   try {
//     const response = await axiosInstance.post(`/searchByDto/${pageIndex}/${pageSize}`, searchDto);
//     return response.data;
//   } catch (error) {
//     console.error("Lỗi khi tìm kiếm TimeSheet:", error);
//     return null;
//   }
// };

// // ✅ 8. Lấy chi tiết TimeSheet theo ID
// export const getTimeSheetDetail = async (id, pageIndex, pageSize) => {
//   try {
//     const response = await axiosInstance.get(`/detail/${id}/${pageIndex}/${pageSize}`);
//     return response.data;
//   } catch (error) {
//     console.error("Lỗi khi lấy chi tiết TimeSheet:", error);
//     return null;
//   }
// };

// // ✅ 9. Xác nhận danh sách TimeSheet
// export const confirmTimeSheets = async (list) => {
//   try {
//     const response = await axiosInstance.post("/confirm", list);
//     return response.data;
//   } catch (error) {
//     console.error("Lỗi khi xác nhận TimeSheet:", error);
//     return false;
//   }
// };

// // ✅ 10. Tìm kiếm TimeSheet theo trang
// export const searchTimeSheetByPage = async (searchDto) => {
//   try {
//     const response = await axiosInstance.post("/search-by-page", searchDto);
//     return response.data;
//   } catch (error) {
//     console.error("Lỗi khi tìm kiếm TimeSheet theo trang:", error);
//     return null;
//   }
// };

// // ✅ 11. Lưu TimeSheet mới
// export const saveTimeSheet = async (dto) => {
//   try {
//     const response = await axiosInstance.post("/", dto);
//     return response.data;
//   } catch (error) {
//     console.error("Lỗi khi lưu TimeSheet:", error);
//     return null;
//   }
// };

// // ✅ 12. Cập nhật TimeSheet theo ID
// export const updateTimeSheet = async (id, dto) => {
//   try {
//     const response = await axiosInstance.put(`/${id}`, dto);
//     return response.data;
//   } catch (error) {
//     console.error("Lỗi khi cập nhật TimeSheet:", error);
//     return null;
//   }
// };

// // ✅ 13. Cập nhật trạng thái TimeSheet
// export const updateTimeSheetStatus = async (id, workingStatusId) => {
//   try {
//     const response = await axiosInstance.put(`/update-status/${id}/${workingStatusId}`);
//     return response.data;
//   } catch (error) {
//     console.error("Lỗi khi cập nhật trạng thái TimeSheet:", error);
//     return null;
//   }
// };

// // ✅ 14. Xuất file Excel TimeSheet
// export const exportTimeSheetToExcel = async (searchDto) => {
//   try {
//     const response = await axiosInstance.post("/exportExcel", searchDto, {
//       responseType: "blob", // Trả về file
//     });
//     const url = window.URL.createObjectURL(new Blob([response.data]));
//     const link = document.createElement("a");
//     link.href = url;
//     link.setAttribute("download", "TimeSheet.xlsx");
//     document.body.appendChild(link);
//     link.click();
//     return true;
//   } catch (error) {
//     console.error("Lỗi khi xuất file Excel:", error);
//     return false;
//   }
// };
