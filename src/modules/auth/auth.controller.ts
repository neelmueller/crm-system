import { register, login, forgotPassword, resetPassword } from '../auth/auth.service'
import { Router } from 'express'

const router = Router();

router.post('/register', async (req, res) =>{
    const {email, password, name} = req.body;
    if(!name || !email || ! password){
        console.log('Name, email or password is missing');
        res.status(400);
        throw new Error('Name, email or password is missing');
    }
    try {
     const newUser = await register(name, email, password);
        res.status(201).json({user: newUser})
    } catch (error) {
        res.status(400).json({ message: (error as Error).message})
    }
});

router.post('/login', async (req, res) =>{
    const {email, password} = req.body
    if(!email || !password){
        console.log('Email or password is missing');
        res.status(400);
        throw new Error ('Email or password is missing');
    }
    try{
        const exsistingUser = await login(email, password);
        res.cookie('token', exsistingUser, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV !== 'development',
                    sameSite: 'strict',
                    maxAge: 7 * 24 * 60 * 60 * 1000
                    })
        res.status(200).json({message: 'Login erfolgreich'})
    }catch(error){
        res.status(400).json({message: (error as Error).message})
    }
});

router.post('/forgotPassword', async(req, res) =>{
    const {email} = req.body
    if(!email){
        console.log('Email is wrong')
        res.status(400);
        throw new Error('Email is wrong')
    }
    try{
        const userPasswordForgot = await forgotPassword(email);
        res.status(200).json({message: 'Mail sucessfull'});
    }catch(error){
        res.status(400).json({
            message: (error as Error).message
        })
    }
});

router.post('/resetPassword', async(req, res) =>{
    const {newPassword, token} = req.body;
    if(!newPassword || !token){
        console.log('New Password or Token is not valid');
        res.status(400);
        throw new Error('New Password or Token is not valid');
    }
    try{
        const userPasswordReset = await resetPassword(newPassword, token );
        res.status(201).json({message: 'Password change succesfull'})
    }catch(error){
        res.status(400).json({
            message: (error as Error).message
        })
    }
});

router.post('/logout', async (req, res ) =>{
    res.clearCookie('token',{
        httpOnly: true,
        secure: process.env.NODE_EN !== 'development',
        sameSite: 'strict',
        maxAge: 0 
    })
    .end();
});

export default router;