import customerService from "../services/customerServices";
import {
  authStart,
  loginSuccess,
  authFailure,
  logout as logoutAction,
  setCurrentUser,
  completeUser,
} from "../slices/customerSlice";


export const sendEmailOtp = (email) => async (dispatch) => {
  try {
    const response = await customerService.sendEmailOtp(email);

    if (response.success) {
      return { success: true, message: response.message };
    } else {
      dispatch(authFailure(response.message));
      return { success: false, message: response.message };
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Sending failed";
    dispatch(authFailure(errorMessage));
    return { success: false, message: errorMessage };
  }
};

export const sendSMSOtp = (mobile) => async (dispatch) => {
  try {
    const response = await customerService.sendSMSOtp(mobile);

    if (response.success) {
      return { success: true, message: response.message };
    } else {
      dispatch(authFailure(response.message));
      return { success: false, message: response.message };
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Sending failed";
    dispatch(authFailure(errorMessage));
    return { success: false, message: errorMessage };
  }
};


export const verifyEmailOtp = ({email,otp}, navigate) => async (dispatch) => {
  dispatch(authStart());

  try {
    const response = await customerService.VerifiEmailOtp({email,otp});

    if (response.success && response.user && response.token) {
      dispatch(
        loginSuccess({
          user: response.user,
          token: response.token,
        })
      );
      
      if (response.user.isProfileCompleted === false) {
        navigate("/?showProfilePopup=true");
      } else {
        navigate("/");
      }

      return { success: true };
    } else {
      dispatch(authFailure(response.message));
      return { success: false, message: response.message };
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "verification failed";
    dispatch(authFailure(errorMessage));
    return { success: false, message: errorMessage };
  }
};
export const verifySMSOtp = ({mobile,otp}, navigate) => async (dispatch) => {
  dispatch(authStart());

  try {
    const response = await customerService.VerifiSMSOtp({mobile,otp});

    if (response.success && response.user && response.token) {
      dispatch(
        loginSuccess({
          user: response.user,
          token: response.token,
        })
      );
      
      if (response.user.isProfileCompleted === false) {
        navigate("/?showProfilePopup=true");
      } else {
        navigate("/");
      }

      return { success: true };
    } else {
      dispatch(authFailure(response.message));
      return { success: false, message: response.message };
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "verification failed";
    dispatch(authFailure(errorMessage));
    return { success: false, message: errorMessage };
  }
};



// export const loginWithGoogle = (navigate) => async (dispatch) => {
//   dispatch(authStart());

//   try {
//     const response = await authService.loginWithGoogle();
//     console.log(response);

//     if (response.success && response.user && response.token) {
//       dispatch(
//         loginSuccess({
//           user: response.user,
//           token: response.token,
//         })
//       );
//       navigate("/");
//       return { success: true };
//     } else {
//       dispatch(authFailure(response.message));
//       return { success: false, message: response.message };
//     }
//   } catch (error) {
//     const errorMessage =
//       error instanceof Error ? error.message : "Google login failed";
//     dispatch(authFailure(errorMessage));
//     return { success: false, message: errorMessage };
//   }
// };


export const completeProfile = (profileData) => async (dispatch) => {
  dispatch(authStart());

  try {
    const response = await customerService.completeProfile(profileData);
    console.log("user",response.user);

    if (response.success && response.user) {
      console.log("suceed");
      
      dispatch(completeUser(response.user));
      dispatch(setCurrentUser(response.user)); 
      return { success: true, message: response.message };
    } else {
      dispatch(authFailure(response.message));
      return { success: false, message: response.message };
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to update profile";
    dispatch(authFailure(errorMessage));
    return { success: false, message: errorMessage };
  }
};

export const logout = (navigate) => async (dispatch) => {
  try {
    await customerService.logout();
    dispatch(logoutAction());
    navigate("/");
    return { success: true };
  } catch (error) {
    console.error("Logout error:", error);
    dispatch(logoutAction());
    navigate("/");
    return { success: true };
  }
};

export const checkAuthStatus = () => async (dispatch) => {
  const token = localStorage.getItem("token");

  if (!token) {
    dispatch(logoutAction());
    return;
  }

  try {
    const user = await authService.getCurrentUser();
    if (user) {
      dispatch(setCurrentUser(user));
    } else {
      dispatch(logoutAction());
    }
  } catch (error) {
    console.error("Auth check error:", error);
    dispatch(logoutAction());
  }
};
