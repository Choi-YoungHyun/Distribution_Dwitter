import SQ from 'sequelize'
import { sequelize } from '../db/database.js';
import { User } from './auth.js';

const DateTypes = SQ.DataTypes;

//users 테이블 만들기
export const Tweet = sequelize.define(
    'tweet',
    {
        id: {
            type: DateTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        text: {
            type: DateTypes.TEXT,
            allowNull: false,
        }
    }
);

//join  한다는 의미
Tweet.belongsTo(User);

// //foreignkey지정
// // User.hasMany(Tweet,{foreignKey:'id', as:'u'});
// // Tweet.belongsTo(User,{foreignKey:'userid'});

const INCLUDE_USER = {
    attributes: [
        'id',
        'text',
        'createdAt',
        'userId',
        [sequelize.col('user.name'), 'name'],
        [sequelize.col('user.username'), 'username'],
        [sequelize.col('user.url'), 'url']
    ],
    include: {
        model: User,
        attributes: []
    }
}

const ORDER_DESC = {
    order: [['createdAt', 'DESC']]
}

export async function getAll() {
    return Tweet.findAll({ ...INCLUDE_USER, ...ORDER_DESC })
}


export async function getAllByUsername(username) {
    return Tweet.findAll({
        ...INCLUDE_USER,
        ...ORDER_DESC,
    include: {
        ...INCLUDE_USER.include,
        where: {username}
    }
})};

export async function getById(id) {
    return Tweet.findOne({
        where: { id }, ...INCLUDE_USER
    })
}

export async function create(text, userId) {
    return Tweet.create({ text, userId }).then((data) => {
        console.log(data)
        return data;
    })
}

export async function update(text, id) {
    return Tweet.findByPk(id, INCLUDE_USER).then((tweet) => {
        tweet.text = text;
        return tweet.save()
    })
}

export async function remove(id) {
    return Tweet.findByPk(id).then((tweet) => {
        tweet.destroy();
    })
}
