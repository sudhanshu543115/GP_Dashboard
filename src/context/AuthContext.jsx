import React, { createContext, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout as logoutAction } from '../redux/slices/authSlice';
import { useLogoutMutation } from '../redux/api/authApiSlice';


const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const { user, loading, error } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const [logoutApi] = useLogoutMutation();

    const logout = async () => {
        try {
            await logoutApi().unwrap();
        } catch (error) {
            // Ignore 401 Unauthorized during logout, as it means the token is already invalid/expired
            if (error?.status !== 401) {
                console.error('Logout failed:', error);
            }
        } finally {
            dispatch(logoutAction());
        }
    };

    return (
        <AuthContext.Provider value={{ user, logout, loading, error }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
