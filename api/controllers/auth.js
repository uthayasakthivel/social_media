import { db } from "../dbConnection.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = (req, res) => {
  const { username, email, password, name } = req.body;

  // Check if the user already exists
  const checkQuery = "SELECT * FROM users WHERE username = ?";
  db.query(checkQuery, [username], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Database error", details: err });
    }
    if (result.length > 0) {
      return res.status(400).json({ mssg: "User already exists" });
    }

    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(password, salt);
    const insertQuery =
      "INSERT INTO users (`username`, `email`, `password`, `name`) VALUES (?, ?, ?, ?)";

    db.query(
      insertQuery,
      [username, email, hashedPassword, name],
      (err, results) => {
        if (err) {
          return res
            .status(500)
            .json({ error: "Can't create user", details: err });
        }

        const newUser = {
          id: results.insertId, // Get the new user's ID from the query result
          username,
          email,
          name,
        };

        return res
          .status(200)
          .json({ mssg: "User Created Successfully", user: newUser });
      }
    );
  });
};

export const login = (req, res) => {
  const { username, password } = req.body;

  const findQuery = "SELECT * FROM users WHERE username = ?"; // Query by username
  console.log("Querying for username: ", username); // Log the username for debugging

  db.query(findQuery, [username], (err, results) => {
    if (err) {
      console.error("Database error: ", err);
      return res.status(500).json({ error: "Database error", details: err });
    }

    console.log("Query Results: ", results); // Log results to see if user is found

    if (results.length === 0) {
      return res.status(404).json({ mssg: "User not found" });
    }

    // Check if password matches
    const checkPassword = bcrypt.compareSync(password, results[0].password);

    if (!checkPassword) {
      return res.status(400).json({ mssg: "Wrong password" });
    }

    // Create token using the user's ID
    const token = jwt.sign({ id: results[0].id }, "dummy_secret_key", {
      expiresIn: "1h",
    });

    // Destructure to remove password from response
    const { password: hashedPassword, ...userData } = results[0]; // Renamed 'password' to 'hashedPassword'

    // Return the user data along with the token
    return res.status(200).json({
      mssg: "Login successful",
      user: userData,
      token,
    });
  });
};

export const logout = (req, res) => {
  return res.status(200).json({ mssg: "Logout successful" });
};
