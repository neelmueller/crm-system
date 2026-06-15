import { register, login } from '../auth/auth.service'
import { Router } from 'express'

const router = Router();

export default router;

router.post('/register', async (req, res) =>{
    const {email, password, name} = req.body;
    if(!name || !email || ! password){
        console.log('Name, email or password is missing');
        res.status(400);
        throw new Error('Name, email or password is missing');
    }
    try {
     const newUser = await register(email, password, name);
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
        res.cookie('token', exsistingUser,{
            httpOnly: true,
            secure: process.env.NODE_EN !== 'development',
            sameSite: 'strict',
            maxAge: 7*24*60*60*100
        } )
        res.status(200).json({message: 'Login erfolgreich'})
    }catch(error){
        res.status(400).json({message: (error as Error).message})
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