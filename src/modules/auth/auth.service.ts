import prisma from '../../config/prisma';
import bcrypt from 'bcryptjs';
import crypto, { hash } from 'crypto';
import { config } from '../../config/env'
import  jsonwebtoken  from 'jsonwebtoken'
import { asyncWrapProviders } from 'async_hooks';
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
    if (!user) throw new Error('Keine Gültige Email gefunden');
    const resetToken = crypto.randomBytes(32).toString('hex');
    const passwordRestToken= crypto
                        .createHash('sha256')
                        .update(resetToken)    
                        .digest('hex');
    
    await prisma.password_reset_tokens.create({
        data: {
            user_id: user.id,
            token_hash: passwordRestToken,
            expires_at: new Date(Date.now() + 60 * 60 * 1000)
        }
    })
    console.log('Reset Token (nur für Entwicklung):', resetToken)
}

export async function resetPassword(newPassword: string, token: string){
    const hash = await crypto.createHash('sha256').update(token).digest('hex')
    const resetToken = await prisma.password_reset_tokens.findFirst({
        where: {
            token_hash: hash,
            used_at: null, 
            expires_at: {gt: new Date()}
        }
    })
    if(!resetToken?.user_id) throw new Error('Ungültiger Token oder Abgelaufen');
    await prisma.user.update(
        {
         where: {id: resetToken.user_id}, 
         data:{ password_hash: await bcrypt.hash(newPassword, 10)}   
        }
    )
    await prisma.password_reset_tokens.update({
        where: { id: resetToken.id},
        data: {used_at: new Date()}
    })
    
}