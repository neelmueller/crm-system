import prisma from '../../config/prisma';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { config } from '../../config/env'
import  jsonwebtoken  from 'jsonwebtoken'
const { sign, decode, verify} = jsonwebtoken


export async function register(email: string, password: string, name: string) {
    const user = await prisma.user.findUnique({
        where : {
            email,
        },
    })
    if (user) {
        throw new Error('User already exists');
    }else
        {
        const hashedPassword = await bcrypt.hash(password, 10);
        const secureToken = crypto.randomBytes(32).toString('hex');
        const newUser = await prisma.user.create({
        data: {
            email,
            password_hash: hashedPassword,
            name,
            verification_token: secureToken
        }
        })
    const {password_hash, ...userWithoutPassword} = newUser
    return userWithoutPassword
    }   
}

export async function login(email: string, password: string) {
    const user = await prisma.user.findUnique({
        where: {
            email,
        },
    })
    if (!user) throw new Error('Ungültige Anmeldedaten');
    const isValid = await bcrypt.compare(password, user.password_hash);
    if(!isValid) throw new Error ('Ungültige Anmeldedaten');
    const token = sign(
        { userId: user.id, role: user.role}, 
        config.jwt_secret, 
        {expiresIn: '7d'})
    return token;
}

export async function forgotPassword(email: string) {
    const user = await prisma.user.findUnique({
        where: {
            email,
        }
    })
    if (!user) throw new Error('Keine Gültige Email gefunden')
}