import axios from "axios";
import ConstantList from "../../appConfig";

const API_PATH = ConstantList.API_ENPOINT + "/api/staff";

// API to get department tree data
export const getDepartmentTree = () => {
  const url = `${API_PATH}/departmenttree`;
  return axios.get(url);
};

// API to get a staff by ID
export const getStaffById = (staffId) => {
  const url = `${API_PATH}/${staffId}`;
  return axios.get(url);
};

// API to delete multiple staff records
export const deleteMultipleStaffs = (staffs) => {
  const url = API_PATH;
  return axios.delete(url, { data: staffs });
};

// API to get staff records with pagination
export const getStaffsByPage = (pageIndex, pageSize) => {
  const url = `${API_PATH}/${pageIndex}/${pageSize}`;
  return axios.get(url);
};

// API to create a new staff
export const createStaff = (staff) => {
  const url = API_PATH;
  return axios.post(url, staff);
};

// API to update an existing staff by ID
export const updateStaff = (staff) => {
  const url = `${API_PATH}/${staff.id}`;
  return axios.put(url, staff);
};

// API to delete a single staff by ID
export const deleteStaffById = (staffId) => {
  const url = `${API_PATH}/${staffId}`;
  return axios.delete(url);
};

// API to find teachers by department with pagination
export const findTeachersByDepartment = (departmentId, pageIndex, pageSize) => {
  const url = `${API_PATH}/department/${departmentId}/${pageIndex}/${pageSize}`;
  return axios.get(url);
};

// API to get all staff records
export const getAllStaffs = () => {
  const url = `${API_PATH}/all`;
  return axios.get(url);
};

// API to search for staff with criteria and pagination
export const searchStaffs = (searchDto, pageIndex, pageSize) => {
  const url = `${API_PATH}/find/${pageIndex}/${pageSize}`;
  return axios.post(url, searchDto);
};

// API to search staff by code with pagination
export const getStaffsByCode = (textSearch, pageIndex, pageSize) => {
  const url = `${API_PATH}/staffcode/${textSearch}/${pageIndex}/${pageSize}`;
  return axios.get(url);
};

// API to perform a simple search for staff
export const simpleSearchStaff = (textSearch) => {
  const url = API_PATH;
  return axios.get(url, { params: { textSearch } });
};

// API to validate a staff code
export const validateStaffCode = (staffCode, staffId) => {
  const url = `${API_PATH}/validatestaffcode/${staffId}`;
  return axios.post(url, null, { params: { staffCode } });
};

// API to validate a username
export const validateUserName = (userName, userId) => {
  const url = `${API_PATH}/validateusername/${userId}`;
  return axios.post(url, null, { params: { userName } });
};

// API to search for staff by page
export const searchStaffByPage = (searchDto) => {
  const url = `${API_PATH}/searchByPage`;
  return axios.post(url, searchDto);
};

// API to check a staff's ID number
export const checkIdNumber = (staffDto) => {
  const url = `${API_PATH}/checkIdNumber`;
  return axios.post(url, staffDto);
};

// API to update a staff's image
export const updateStaffImage = (imagePath, id) => {
  const url = `${API_PATH}/imagePath/${id}`;
  return axios.post(url, null, { params: { imagePath } });
};
