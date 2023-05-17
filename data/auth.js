import SQ, { DATE } from 'sequelize'
import { sequelize } from '../db/database.js';

const DateTypes = SQ.DataTypes;

//users 테이블 만들기
export const User = sequelize.define(
    'user',
    {
        id:{
            type:DateTypes.INTEGER,
            autoIncrement:true,
            allowNull:false,
            primaryKey:true
        },
        username:{
            type:DateTypes.STRING(45),
            allowNull: false,
        },
        password:{
            type:DateTypes.STRING(128),
            allowNull:false
        },
        name:{
            type:DateTypes.STRING(45),
            allowNull:false
        },
        email:{
            type:DateTypes.STRING(128),
            allowNull:false
        },
        url:{
            type:DateTypes.TEXT
        },
        regdate:{
            type:DateTypes.DATE,
            defaultValue:DateTypes.NOW
        }
    },
    {timestamps: false}
)

    export async function findByUsername(username){
        return User.findOne({where:{username}})
    }

    export async function createUser(user){
        return User.create(user).then((data)=>data.dataValues.id)
    }

    export async function findById(id){
        return User.findByPk(id);
    }