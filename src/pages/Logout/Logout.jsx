import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../redux/thunks/authApi";
import { Navigate, useNavigate } from "react-router-dom";

const Logout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(logoutUser());
    }, []);
    
    return <Navigate to={'/login'} />
}
 
export default Logout;