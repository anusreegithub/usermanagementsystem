const userSchema = require("../models/userModel");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const register = async (req, res) => {
  try {
    const { firstname, phonenumber, email, username, password, role } =
      req.body;
    //  console.log(req.body)
    const user = await userSchema.findOne({ email });
    if (user) {
      return res.render("register", { message: "user already exist" });
    } else {
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const newUser = new userSchema({
        firstname,
        phonenumber,
        email,
        username,
        role,
        password: hashedPassword,
      });

      await newUser.save();

      return res.render("login");
    }
  } catch (error) {
    console.log(error);
    return res.render("register", { message: "Error registering user" });
  }
};

const login = async (req, res) => {
  console.log("requesr", req.body);
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      console.log("Email and password are required");
      return res.render("/login", {
        message: "Email and password are required",
      });
    }

    const user = await userSchema.findOne({ email });
    console.log("user", user.role);

    if (!user) {
      console.log("user not found");
      return res.status(400).send("Invalid email or password");
    }

    const isPasswodMatch = await bcrypt.compare(password, user.password);
    console.log(isPasswodMatch);
    console.log(user.role);
    // if (isPasswodMatch) {

    //   return res.render("admin/home", { message: "Logged in successfully" });
    // } else {
    //   return res.render("admin/login", { message: "Incorrect password" });
    // }
    if (user.role === 1 && isPasswodMatch) {
      console.log("logged in");
      return res.render("admin/home", { message: "Logged in successfully" });
    } else if (user.role === 2 && isPasswodMatch) {
      return res.render("users/home", { message: "Logged in successfully" });
    } else {
      console.log("else blvkn");
      return res.render("login", { message: "Logged in successfully" });
    }
  } catch (error) {
    console.log(error);
    return res.render("login", { message: "Wrong Details" });
  }
};

module.exports = {
  login,
  register,
};
