import express from "express";
import cors from "cors";
import morgan from "morgan";
import tweetsRouter from "./router/tweets.js";
import authRouter from "./router/auth.js";
import { config } from './config.js';
import { initSocket } from './connection/socket.js'
import { sequelize } from './db/database.js'

const app = express();

//배포를 하기 위한 cors 옵션 설정
const corsOption = {
    origin:config.cors.allowOrigin,
    optionsSuccessStaus:200
}

app.use(express.json());
app.use(cors(corsOption));
app.use(morgan("tiny")); // 사용자들이 들어오게되면 로그를 콘솔에 찍어줌

app.use("/tweets", tweetsRouter);
app.use("/auth", authRouter);

app.use((req, res, next) => {
    res.sendStatus(404);
});

app.use((error, req, res, next) => {
    console.log(error);
    res.sendStatus(500);
});


// db.getConnection().then('연결완료')

sequelize.sync().then((client)=>{
    console.log(`서버가 죽다 살아남 ${new Date()}`)
    const server = app.listen(config.port);
    initSocket(server);
})


