// import { useContext, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { AuthContext } from "../../context/authContext";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import {
//   Box,
//   Card,
//   CardContent,
//   TextField,
//   Button,
//   Typography,
//   Grid,
//   Container,
// } from "@mui/material";

// const Login = () => {
//   const [inputs, setInputs] = useState({
//     username: "",
//     password: "",
//   });

//   const [errors, setErrors] = useState({
//     username: "",
//     password: "",
//   });

//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setInputs((prevValues) => {
//       return { ...prevValues, [e.target.name]: e.target.value };
//     });
//     setErrors((prevErrors) => ({
//       ...prevErrors,
//       [e.target.name]: "", // Clear the error for the specific field
//     }));
//   };

//   const validate = () => {
//     let valid = true;
//     const newErrors = {};

//     if (!inputs.username) {
//       newErrors.username = "Username is required.";
//       valid = false;
//     }
//     if (!inputs.password) {
//       newErrors.password = "Password is required.";
//       valid = false;
//     }

//     setErrors(newErrors);
//     return valid;
//   };

//   const { login } = useContext(AuthContext);

//   const handleLogin = async () => {
//     if (!validate()) {
//       return;
//     }

//     try {
//       await login(inputs);
//       navigate("/");
//       toast.success("Login successful!", {
//         position: "top-right",
//         autoClose: 3000,
//       });
//     } catch (error) {
//       if (error.response) {
//         setErrors({
//           username: error.response.data.mssg || "Login failed!",
//           password: error.response.data.mssg || "Login failed!",
//         });
//         toast.error(error.response.data.mssg || "Login failed!", {
//           position: "top-right",
//           autoClose: 3000,
//         });
//       } else if (error.request) {
//         setErrors({
//           username: "No response from server. Please try again later.",
//           password: "No response from server. Please try again later.",
//         });
//         toast.error("No response from server. Please try again later.", {
//           position: "top-right",
//           autoClose: 3000,
//         });
//       } else {
//         setErrors({
//           username: "An unexpected error occurred.",
//           password: "An unexpected error occurred.",
//         });
//         toast.error("An unexpected error occurred.", {
//           position: "top-right",
//           autoClose: 3000,
//         });
//       }
//     }
//   };

//   return (
//     <Container component="main" maxWidth="xs">
//       <Card>
//         <CardContent>
//           <Grid
//             container
//             spacing={2}
//             direction="column"
//             justifyContent="center"
//             alignItems="center"
//           >
//             <Grid item xs={12} textAlign="center">
//               <Typography variant="h4" gutterBottom>
//                 Login
//               </Typography>
//               <Typography variant="body1" color="textSecondary" gutterBottom>
//                 Welcome back! Please log in.
//               </Typography>
//             </Grid>

//             <form>
//               <TextField
//                 fullWidth
//                 label="Username"
//                 name="username"
//                 value={inputs.username}
//                 onChange={handleChange}
//                 error={!!errors.username}
//                 helperText={errors.username}
//                 margin="normal"
//                 variant="outlined"
//               />
//               <TextField
//                 fullWidth
//                 label="Password"
//                 name="password"
//                 type="password"
//                 value={inputs.password}
//                 onChange={handleChange}
//                 error={!!errors.password}
//                 helperText={errors.password}
//                 margin="normal"
//                 variant="outlined"
//               />

//               {errors.general && (
//                 <Typography color="error">{errors.general}</Typography>
//               )}

//               <Button
//                 fullWidth
//                 type="button"
//                 variant="contained"
//                 color="primary"
//                 onClick={handleLogin}
//                 style={{ marginTop: 20 }}
//               >
//                 Login
//               </Button>
//             </form>

//             <Grid item xs={12} textAlign="center" style={{ marginTop: 20 }}>
//               <Typography variant="body2" color="textSecondary">
//                 Don't have an account?{" "}
//                 <Link to="/register" style={{ textDecoration: "none" }}>
//                   <Button color="secondary">Register</Button>
//                 </Link>
//               </Typography>
//             </Grid>
//           </Grid>
//         </CardContent>
//       </Card>
//       <ToastContainer />
//     </Container>
//   );
// };

// export default Login;

import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Grid,
  Container,
} from "@mui/material";

const Login = () => {
  const [inputs, setInputs] = useState({
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    username: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setInputs((prevValues) => {
      return { ...prevValues, [e.target.name]: e.target.value };
    });
    setErrors((prevErrors) => ({
      ...prevErrors,
      [e.target.name]: "", // Clear the error for the specific field
    }));
  };

  const validate = () => {
    let valid = true;
    const newErrors = {};

    if (!inputs.username) {
      newErrors.username = "Username is required.";
      valid = false;
    }
    if (!inputs.password) {
      newErrors.password = "Password is required.";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const { login } = useContext(AuthContext);

  const handleLogin = async () => {
    if (!validate()) {
      return;
    }

    try {
      await login(inputs);
      navigate("/");
      toast.success("Login successful!", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      // Reset errors before setting specific ones
      setErrors({
        username: "",
        password: "",
      });

      if (error.response) {
        // If the error message relates to a specific field, set that field's error
        if (error.response.data.mssg.includes("username")) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            username: error.response.data.mssg || "Login failed!",
          }));
        } else if (error.response.data.mssg.includes("password")) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            password: error.response.data.mssg || "Login failed!",
          }));
        } else {
          // If the error is general, show it for both fields
          setErrors({
            username: error.response.data.mssg || "Login failed!",
            password: error.response.data.mssg || "Login failed!",
          });
        }

        toast.error(error.response.data.mssg || "Login failed!", {
          position: "top-right",
          autoClose: 3000,
        });
      } else if (error.request) {
        setErrors({
          username: "No response from server. Please try again later.",
          password: "No response from server. Please try again later.",
        });
        toast.error("No response from server. Please try again later.", {
          position: "top-right",
          autoClose: 3000,
        });
      } else {
        setErrors({
          username: "An unexpected error occurred.",
          password: "An unexpected error occurred.",
        });
        toast.error("An unexpected error occurred.", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Card>
        <CardContent>
          <Grid
            container
            spacing={2}
            direction="column"
            justifyContent="center"
            alignItems="center"
          >
            <Grid item xs={12} textAlign="center">
              <Typography variant="h4" gutterBottom>
                Login
              </Typography>
              <Typography variant="body1" color="textSecondary" gutterBottom>
                Welcome back! Please log in.
              </Typography>
            </Grid>

            <form>
              <TextField
                fullWidth
                label="Username"
                name="username"
                value={inputs.username}
                onChange={handleChange}
                error={!!errors.username}
                helperText={errors.username}
                margin="normal"
                variant="outlined"
              />
              <TextField
                fullWidth
                label="Password"
                name="password"
                type="password"
                value={inputs.password}
                onChange={handleChange}
                error={!!errors.password}
                helperText={errors.password}
                margin="normal"
                variant="outlined"
              />

              {errors.general && (
                <Typography color="error">{errors.general}</Typography>
              )}

              <Button
                fullWidth
                type="button"
                variant="contained"
                color="primary"
                onClick={handleLogin}
                style={{ marginTop: 20 }}
              >
                Login
              </Button>
            </form>

            <Grid item xs={12} textAlign="center" style={{ marginTop: 20 }}>
              <Typography variant="body2" color="textSecondary">
                Don't have an account?{" "}
                <Link to="/register" style={{ textDecoration: "none" }}>
                  <Button color="secondary">Register</Button>
                </Link>
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <ToastContainer />
    </Container>
  );
};

export default Login;
