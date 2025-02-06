import axios from "axios";
import ConstantList from "../../appConfig";

const API_PATH = ConstantList.API_ENPOINT + "/api/project";


// API to save a project
export const saveProject = (dto) => {
    const url = `${API_PATH}`;
    return axios.post(url, dto);
};

// API to update a project by ID
export const updateProject = (dto) => {
    const url = `${API_PATH}/${dto?.id}`;
    return axios.put(url, dto);
};

// API to get a project by ID
export const getProject = (id) => {
    const url = `${API_PATH}/${id}`;
    return axios.get(url);
};

// API to delete a project by ID
export const deleteProject = (id) => {
    const url = `${API_PATH}/${id}`;
    return axios.delete(url);
};

// API to search projects by page
export const searchProjectsByPage = (searchDto) => {
    const url = `${API_PATH}/search-by-page`;
    return axios.post(url, searchDto);
};

// API to check project code
export const checkProjectCode = (id, code) => {
    const url = `${API_PATH}/check-code`;
    return axios.get(url, {params: {id, code}});
};

// API to get projects by username with pagination
export const getPageProjectByUsername = (searchDto) => {
    const url = `${API_PATH}/get-page-project-by-username`;
    return axios.post(url, searchDto);
};
