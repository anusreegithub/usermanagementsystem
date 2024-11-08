const userSchema = require("../models/userModel");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const register = async (req, res) => {
  try {
    const { firstname, phonenumber, email, username, password, role } =
      req.body;

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
      req.session.user = {
        id: newUser._id,
        email: newUser.email,
        role: newUser.role,
      };
      return setTimeout(() => {
        res.render("login");
      }, 3000);
    }
  } catch (error) {
    console.log(error);
    return res.render("register", { message: "Error registering user" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
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

    req.session.user = { id: user._id, email: user.email, role: user.role };
    console.log("req.session.user:", req.session.user);

    if (user.role === 1 && isPasswodMatch) {
      console.log("logged in");
      return setTimeout(() => {
        res.redirect("admin/home");
      }, 3000);
    } else if (user.role === 2 && isPasswodMatch) {
      return setTimeout(() => {
        res.redirect("users/home");
      }, 3000);
    } else {
      console.log("else block executerd");
      return res.render("login", { message: "Logged in successfully" });
    }
  } catch (error) {
    console.log(error);
    return res.render("login", { message: "Wrong Details" });
  }
};

const listusers = async (req, res) => {
  console.log("request", req.body);
  try {
    const users = await userSchema.find({ role: 2 });

    const currentUser = req.session.user;
    console.log("currentUser", currentUser);
    const user = await userSchema.findOne({ email: req.body.email });

    console.log(user);
    return res.render("users/home", { users });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal server error");
  }
};

const Alllistusers = async (req, res) => {
  try {
    const users = await userSchema.find({ role: 2 });

    return res.render("admin/home", { users });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal server error");
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await userSchema.findById(req.params.id);
    console.log(user);
    res.render("update", { user });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal server error");
  }
};

const updateUser = async (req, res) => {
  try {
    const { firstname, phonenumber, email, username } = req.body;

    const existingUser = await userSchema.findById(req.params.id);

    await userSchema.findByIdAndUpdate(
      req.params.id,
      {
        firstname: firstname || existingUser.firstname,
        phonenumber: phonenumber || existingUser.phonenumber,
        email: email || existingUser.email,
        username: username || existingUser.username,
      },
      res.redirect("/admin/home")
    );
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal server error");
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await userSchema.findByIdAndDelete(req.params.id);
    res.redirect("/admin/home");
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal server error");
  }
};

const isAdmin = (req, res, next) => {
  if (req.session.user && req.session.user.role === 1) {
    return next();
  }
  return res
    .status(403)
    .render("login", { message: "Access Denied: Admins only" });
};

// Middleware for checking user role
const isUser = (req, res, next) => {
  if (req.session.user && req.session.user.role === 2) {
    return next();
  }
  return res
    .status(403)
    .render("login", { message: "Access Denied: Users only" });
};

const adminHome = (req, res) => {
  res.render("admin/home", { user: req.session.user });
};

const userHome = (req, res) => {
  res.render("users/home", { user: req.session.user });
};
const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
      return res.status(500).send("Internal Server Error"); 
    }
    res.clearCookie("connect.sid");
    res.redirect("/");
  });
};

module.exports = {
  login,
  register,
  listusers,
  updateUser,
  Alllistusers,
  getUserById,
  deleteUser,
  isAdmin,
  isUser,
  logout,
  adminHome,
  userHome,
};
