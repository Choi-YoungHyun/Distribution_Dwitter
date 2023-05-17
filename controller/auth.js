import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt'
import * as userRepository from '../data/auth.js';
import {config} from '../config.js'

const jwtSecretKey = config.jwt.secretKey; // 임의의 32bit 키를 가져옴.
const jwtExpiresInDays = config.jwt.expiresInSec // 이틀동안 사용이 가능.
const bcryptSaltRounds = config.bcrypt.saltRounds;  // 10번 반복해서 돌림.

export async function signup(req, res){
    const { username, password, name, email, url } = req.body;
    const sign_id = await userRepository.findByUsername(username);
    if (sign_id) {
        res.status(409).json({message:`${username}은 이미 가입됨.`});
    }
    const hashed = await bcrypt.hash(password, bcryptSaltRounds);
    const userId = await userRepository.createUser({
        username,
        password: hashed,
        name,
        email,
        url
    });
    const token = createJwtToken(userId); // data와 상관이 없는 함수이므로, 아래에 생성할 예정.
    res.status(201).json({token, username});
    }   
 // req.body로 data를 받아서 회원가입을 시키는 함수.
 // 해당 id가 존재한다면 '409'를 return.
 // userRepository에 데이터를 저장(비밀번호는 bcrypt를 사용하자)하여 회원가입을 진행.
 // JWT를 이용하여 사용자에게 json으로 전달할 예정.

export async function login(req, res){
    const {username, password} = req.body

    const user = await userRepository.findByUsername(username);

    if (!user) {   // 로그인이므로, user객체가 없으면 오류가 발생.
        return res.status(401).json({message:'아이디/비밀번호 확인좀.'});
    }

    const isValidpassword = await bcrypt.compare(password, user.password) 

    if(!isValidpassword){ // false인 경우, 401 error.
        return res.status(401).json({message:'아이디/비밀번호 확인좀.'});
    }
    res.status(200).json({message:'로그인 완료'})
    const token = createJwtToken(user.id);   
}

export async function me(req, res, next){
    const user = await userRepository.findById(req.userId);
    if (!user) {
        return res.status(404).json({message:'사용자가 없음.'});
    }
    res.status(200).json({token:req.token, username:user.username});
}


function createJwtToken(id){
    return jwt.sign({id}, jwtSecretKey, {expiresIn: jwtExpiresInDays});
}