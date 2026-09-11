import { getUserFailure, getUserStart, getUserSuccess, deleteUserStart, deleteUserSuccess, deleteUserFailure } from '../../redux/slices/userSlice';
import axiosJWT from '../../config/axiosJWT';

// Get all users (for admin)
export const getAllUsers = async (dispatch) => {
    dispatch(getUserStart());
    try {
        console.log("👥 Getting all users...");
        // axiosJWT will automatically add token via interceptor
        const res = await axiosJWT.get('/api/users');
        dispatch(getUserSuccess(res.data));
        console.log("✅ Users fetched successfully");
        return res.data;
    } catch (error) {
        dispatch(getUserFailure());
        console.error('Error getting all users:', error);
        throw error;
    }
}

// Delete user
export const deleteUser = async (userId, dispatch) => {
    dispatch(deleteUserStart());
    try {
        console.log("🗑️ Deleting user API call...");
        // axiosJWT will automatically add token via interceptor
        const res = await axiosJWT.delete(`/api/users/${userId}`);
        dispatch(deleteUserSuccess(res.data));
        console.log("✅ User deleted successfully");
        return res.data;
    } catch (error) {
        dispatch(deleteUserFailure());
        console.error('Error deleting user:', error);
        throw error;
    }
}