const express = require('express');
const authenticationHandler = require('./../handlers/authentication');
const authRoutes = express.Router();

// REGISTER API END POINT
authRoutes.post('/register',authenticationHandler.register);

authRoutes.post('/register/nextOfKin', authenticationHandler.nextOfkingSignUp);

authRoutes.post('/register/account' , authenticationHandler.accoutSetUp);

// LOGIN API END POINT
authRoutes.post('/login',authenticationHandler.signin);

// LOGOUT API END POINT

authRoutes.post('/logout' , authenticationHandler.logOut);

// USER SIGN IN CHECKER

authRoutes.post('/userSignin',authenticationHandler.signinChecker);
authRoutes.post('/account',authenticationHandler.loadAccount);
authRoutes.post('/nextofkin', authenticationHandler.loadNextOfKin)

// PASSWORD RESET

authRoutes.post('/passwordRest', authenticationHandler.passwordRest);

// PASSREST FROM DASHBOARD

authRoutes.post('/passwordRest/dashboard', authenticationHandler.passwordRestFromDashboard);

module.exports = authRoutes;