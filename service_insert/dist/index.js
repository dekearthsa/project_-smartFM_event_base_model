"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const amqplib = require('amqplib/callback_api');
const connection = require('./model/connection');
// import collection // 
// const storeModel = require('./model/storeModel');
// import collection //
const { ConvertDataFlow } = require("./controller/controlling");
const queue = 'inserting';
const rabbitUser = "admin";
const rabbitPass = "1234";
// const hosting = `amqp://${rabbitUser}:${rabbitPass}@localhost`   
connection.connect();
const hosting = `amqp://${rabbitUser}:${rabbitPass}@host.docker.internal`;
amqplib.connect(hosting, (err, conn) => {
    console.log("connected at rabbitMQ at amqp://localhost as receiver");
    if (err)
        throw err;
    // Listener
    conn.createChannel((err, ch2) => {
        if (err)
            throw err;
        ch2.assertQueue(queue);
        ch2.consume(queue, (msg) => __awaiter(void 0, void 0, void 0, function* () {
            if (msg !== null) {
                const stringData = msg.content.toString();
                // console.log("stringData => ", stringData)
                const jsonData = JSON.parse(stringData);
                // console.log("jsonData => ",jsonData)
                const insertingData = new ConvertDataFlow.InsertData(jsonData.device_name, jsonData.timestamp);
                const dataOut = yield insertingData.haddleInsertData();
                console.log("dataout => ", dataOut);
                ch2.ack(msg);
            }
            else {
                console.log('Consumer cancelled by server');
            }
        }));
    });
});
