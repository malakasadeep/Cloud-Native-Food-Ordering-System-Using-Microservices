import partnerService from "../services/partnerServices";
import { authFailure, authStart, loginSuccess } from "../slices/partnerSlices";

export const login = (credentials, navigate) => async (dispatch) => {
    dispatch(authStart());
  
    try {
      const response = await partnerService.login(credentials);
      console.log("Login response action:", response);
      
  
      if (response.success && response.user) {
        dispatch(
          loginSuccess({
            user: response.user,
          })
        );
  
        if (response.user.role === "admin") {
          navigate("/admin");
        } else if (response.user.role === "restaurant_owner")  {
          navigate("/restaurant");
        }else if (response.user.role === "delivery_rider"){
          navigate("/delivery");
        }
  
        return { success: true };
      } else {
        dispatch(authFailure(response.message));
        return { success: false, message: response.message };
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Login failed";
      dispatch(authFailure(errorMessage));
      return { success: false, message: errorMessage };
    }
  };