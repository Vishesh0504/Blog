const express = require('express');

const authRouter = express.router();


authRouter.get('/login/google');
authRouter.get('/login/google/callback')

authRouter.get('/login/github');
authRouter.get('/login/github/callback')

authRouter.post('/signup/local');
authRouter.post('/login/local');