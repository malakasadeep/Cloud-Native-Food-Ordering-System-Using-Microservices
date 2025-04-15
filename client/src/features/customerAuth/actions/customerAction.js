
import customerService from "../services/customerServices";
import {
  authStart,
  loginSuccess,
  authFailure,
  logout as logoutAction,
  setCurrentUser,
} from "../slices/customerSlice";

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
    navigate("/");

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

// export const loginWithFacebook = (navigate) => async (dispatch) => {
//   dispatch(authStart());

//   try {
//     const response = await authService.loginWithFacebook();
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
//       error instanceof Error ? error.message : "Facebook login failed";
//     dispatch(authFailure(errorMessage));
//     return { success: false, message: errorMessage };
//   }
// };

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

export const logout = (navigate) => async (dispatch) => {
  try {
    await authService.logout();
    dispatch(logoutAction());
    navigate("/signin");
    return { success: true };
  } catch (error) {
    console.error("Logout error:", error);
    dispatch(logoutAction());
    navigate("/signin");
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
