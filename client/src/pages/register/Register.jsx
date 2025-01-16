import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
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

const Register = () => {
  const [inputs, setInputs] = useState({
    username: "",
    email: "",
    password: "",
    name: "",
  });

  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
    name: "",
  });

  const handleChange = (e) => {
    setInputs((prevValues) => ({
      ...prevValues,
      [e.target.name]: e.target.value,
    }));
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
    if (!inputs.email) {
      newErrors.email = "Email is required.";
      valid = false;
    }
    if (!inputs.password) {
      newErrors.password = "Password is required.";
      valid = false;
    }
    if (!inputs.name) {
      newErrors.name = "Name is required.";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8800/api/auth/register",
        inputs,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Registration successful!");
      console.log("User Registered: ", response.data);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.mssg) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          general: error.response.data.mssg,
        }));
        toast.error(error.response.data.mssg);
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          general: "Something went wrong.",
        }));
        toast.error("Something went wrong.");
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
                Register
              </Typography>
              <Typography variant="body1" color="textSecondary" gutterBottom>
                Create a new account
              </Typography>
            </Grid>

            <form onSubmit={handleRegister} style={{ width: "100%" }}>
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
                label="Email"
                name="email"
                type="email"
                value={inputs.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
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
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={inputs.name}
                onChange={handleChange}
                error={!!errors.name}
                helperText={errors.name}
                margin="normal"
                variant="outlined"
              />

              {errors.general && (
                <Typography color="error">{errors.general}</Typography>
              )}

              <Button
                fullWidth
                type="submit"
                variant="contained"
                color="primary"
                style={{ marginTop: 20 }}
              >
                Register
              </Button>
            </form>

            <Grid item xs={12} textAlign="center" style={{ marginTop: 20 }}>
              <Typography variant="body2" color="textSecondary">
                Already have an account?{" "}
                <Link to="/login" style={{ textDecoration: "none" }}>
                  <Button color="secondary">Login</Button>
                </Link>
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <ToastContainer position="top-center" autoClose={3000} />
    </Container>
  );
};

export default Register;
