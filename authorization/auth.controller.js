import bcrypt from "bcrypt-nodejs";
import jwt from "jsonwebtoken";
import configkeys from "../config";
import { Users } from "../api/users/users.model";
import { getUserDetails } from "../commonDbFunctions";

const expirationInterval =
  process.env.NODE_ENV === "development"
    ? 30 * 24 * 60 * 60
    : (parseInt(process.env.JWTSECRET) || 1) * 24 * 60 * 60;

const tokenForUser = (user, loginDetails) => {
  try {
    const timestamp = new Date().getTime();
    return jwt.sign(
      {
        sub: user.emailId,
        iat: timestamp,
        // entityDetails: loginDetails.relatedFaEntities[0],
        exp: Math.floor(Date.now() / 1000) + expirationInterval
      },
      configkeys.secrets.JWT_SECRET
    );
  } catch (err) {
    throw err;
  }
};

export const signup = async (req, res) => {
  const { mobileNo, firstName, lastName } = req.body;
  let { emailId, password } = req.body;
  emailId = emailId && emailId.toLowerCase();
  const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  console.log({ emailId, emailRegexp });
  if (!emailRegexp.test(emailId)) {
    return res.status(422).send({ success: false, message: "Invalid Email" });
  }

  const isEmailExist = await Users.findOne({
    emailId: req.body.emailId
  }).then(data => {
    return data ? true : false;
  });
  if (isEmailExist) {
    return res
      .status(422)
      .send({ success: false, message: "Email is alrady exist" });
  }
  password = bcrypt.hashSync(password);

  try {
    await Users.create({
      firstName,
      lastName,
      emailId,
      password,
      mobileNo,
      role: "user",
      onboardingStatus: "new"
    });
    return res.status(201).send({
      success: true,
      message: "User created successfully."
    });
  } catch (err) {
    res.status(422).send({ success: false, message: err.message });
  }
};

export const signin = async (req, res) => {
  const { email } = req.body;
  try {
    const [userDetails] = await Promise.all([getUserDetails(email)]);
    if (Object.keys(userDetails).length > 0) {
      const status = req.user.onboardingStatus;
      if (status === "new") {
        res
          .status(422)
          .send({ success: false, message: "Please varify your email!" });
      } else if (status === "active") {
        res.status(200).send({
          success: true,
          token: tokenForUser(userDetails)
        });
      } else if (status === "disable") {
        res.status(422).send({
          success: false,
          message: "your account is disabled!"
        });
      } else {
        res.status(422).send({
          success: false,
          message: "your account status in not active!"
        });
      }
    } else {
      res.status(422).send({
        success: false,
        error: `Incorrect email ID : ${email}`
      });
    }
  } catch (e) {
    console.log("The error while sign in is", e);
    res.status(422).send({
      success: false,
      error: `Unable to Login using email - ${email}`
    });
  }
};
