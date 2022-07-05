const mongoose = require("mongoose");
const User = require("../models/user");
const Student = require("../models/student");
const Teacher = require("../models/teacher");
const Admin = require("../models/admin");

module.exports.renderLoginPage = (req, res) => {
  res.render("users/login");
};

module.exports.newUser = async (req, res) => {
  const { emailAddress, role, username, password } = req.body;
  const newUser = new User({
    emailAddress: emailAddress,
    role: role,
    username: username,
  });

  if (role == "Student") {
    const foundStudent = await Student.findOne({ emailAddress: emailAddress });
    if (!foundStudent) {
      req.flash("error", "No student with that email address found.");
      res.redirect("/register");
    } else {
      newUser.mainId = foundStudent;
      const registeredUser = await User.register(newUser, password);
      req.flash("success", "Successfully created a new user");
      res.redirect(`/students/${foundStudent._id}`);
    }
  } else if (role == "Teacher") {
    const foundTeacher = await Teacher.findOne({ emailAddress: emailAddress });
    if (!foundTeacher) {
      req.flash("error", "No teacher with that email address found.");
      res.redirect("/register");
    } else {
      newUser.mainId = foundTeacher;
      const registeredUser = await User.register(newUser, password);
      req.flash("success", "Successfully created a new user");
      res.redirect(`/teachers/${foundTeacher._id}`);
    }
  } else if (role == "Admin") {
    const foundAdmin = await Admin.findOne({ emailAddress: emailAddress });
    if (!foundAdmin) {
      req.flash("error", "No admin with that email address found.");
      res.redirect("/register");
    } else {
      newUser.mainId = foundAdmin;
      const registeredUser = await User.register(newUser, password);
      req.flash("success", "Successfully created a new admin");
      res.redirect("/");
    }
  } else {
    req.flash("error", "Authorisation could not be provided");
    res.redirect("/");
  }

  console.log(newUser);
};

module.exports.loginUser = async (req, res, next) => {
  console.log("Logged in ", req.user);
  if (req.user.role == "Teacher") {
    res.redirect(`/teachers/${req.user.mainId}`);
  } else if (req.user.role == "Student") {
    res.redirect(`/students/${req.user.mainId}`);
  } else {
    res.redirect(`/`);
  }
};

module.exports.logoutUser = async (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
  });
  req.flash("success", "Successfully logged out");
  res.redirect("/login");
};

module.exports.showUser = async (req, res) => {
  const { id } = req.params;
  const foundUser = await User.findById(id);
  if (!foundUser) {
    console.log("User could not be found");
  } else {
    console.log(foundUser);
  }
};

module.exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  const deletedUser = await User.findByIdAndDelete(id);
  if (!deletedUser) {
    console.log("User could not be found");
  } else {
    console.log(deletedUser);
  }
};
