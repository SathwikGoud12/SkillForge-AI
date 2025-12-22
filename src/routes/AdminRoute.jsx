import { Navigate } from "react-router";
import useAuthStore from "../store/authStore";

const AdminRoute = (props) => {
    const {children} = props;
    const currentUser = useAuthStore((state) => state.currentUser);

    if(currentUser.labels.includes('admin')){
        return children
    }

    return <Navigate to="/" />
}

export default AdminRoute