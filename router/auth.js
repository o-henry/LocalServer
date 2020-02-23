const express = require("express");
const passport = require("passport");
const router = express.Router();
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../config/.env") });

const LocalStrategy = require("passport-local").Strategy;

// const KaKaoStrategy = require("passport-kakao").Strategy;
// const kakaoKey = {
//   cliendID: process.env.KAKAO_CLIENT_ID,
//   clientSecret: process.env.KAKAO_CLIENT_SECRET,
//   callbackURL: process.env.KAKAO_CALLBACK_URL
// };

// passport.use(
//   "kakao-login",
//   new KaKaoStrategy(kakaoKey, (accessToken, refreshToken, profile, done) => {
//     console.log(profile);
//   })
// );

// router.get("/kakao", passport.authenticate("kakao-login"));
// router.get(
//   "/kakao/callback",
//   passport.authenticate("kakao-login", {
//     successRedirect: "/",
//     failureRedirect: "/api/auth/fail"
//   })
// );

module.exports = router;
