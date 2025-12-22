
import { Navigate } from "react-router";
import useAuthStore from "../store/authStore";


function PrivateRoute(props) {
    const { children } = props;

    const currentUser = useAuthStore((state) => state.currentUser)
    const isCheckingUser = useAuthStore((state) => state.isCheckingUser)
    
    /**
     * 1. Empty Dependency Array: Run only once
     * 2. Act as componentDidMount()
     * 3. Doesn't get called after every re-render
     */

    if(isCheckingUser){
        return(
            <h1>Loading.....</h1>
        )
    }

    if(!currentUser){
        return (
            <Navigate to="/login" />
        )
    }

    return children;
}

export default PrivateRoute;