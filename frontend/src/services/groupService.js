import axiosInstance from "./axiosService";
import { API_ENDPOINTS } from "../config/api";

const groupService = {
    // create group
    async createGroup({ name, bio, privacy, image }) {
        const formData = new FormData();
        formData.append("name", name);
        formData.append("bio", bio);
        formData.append("privacy", privacy);
        if (image) formData.append("image", image);

        const res = await axiosInstance.post(
            API_ENDPOINTS.groups.createGroup,
            formData,
            {
                headers: { "Content-Type": "multipart/form-data" },
            }
        );

        return res.data.group;
    },

    // get all groups
    async getAllGroups() {
        const res = await axiosInstance.get(API_ENDPOINTS.groups.getAllGroups);
        return res.data.groups;
    },

    // get group by ID
    async getGroupById(groupId) {
        const res = await axiosInstance.get(API_ENDPOINTS.groups.getGroupById(groupId));
        return res.data.group;
    },

    // join group
    async joinGroup(groupId) {
        const res = await axiosInstance.post(API_ENDPOINTS.groups.joinGroup(groupId));
        return res.data;
    },

    // leave group
    async leaveGroup(groupId) {
        const res = await axiosInstance.post(API_ENDPOINTS.groups.leaveGroup(groupId));
        return res.data;
    },

    // update group
    async updateGroup(groupId, data) {
        const res = await axiosInstance.put(`${API_ENDPOINTS.groups.updateGroup}/${groupId}`, data);
        return res.data.group;
    },

    // delete group
    async deleteGroup(groupId) {
        const res = await axiosInstance.delete(`${API_ENDPOINTS.groups.deleteGroup}/${groupId}`);
        return res.data;
    },
};

export default groupService;
