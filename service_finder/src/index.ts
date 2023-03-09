const amqplib = require('amqplib/callback_api');
const connection = require('./model/connection');
const {ConvertDataFlow} = require("./controller/controlling");

const queue = 'finder';
const rabbitUser = "admin";
const rabbitPass = "1234";

// const hosting = "amqp://localhost"
const hosting = `amqp://${rabbitUser}:${rabbitPass}@host.docker.internal`;
connection.connect();

amqplib.connect(hosting, (err: any, conn: any) => {
    console.log("connected at rabbitMQ at amqp://localhost as receiver")
    if (err) throw err;

    // Listener
    conn.createChannel((err: any, ch2: any) => {
        if (err) throw err;

        ch2.assertQueue(queue);

        ch2.consume(queue, async (msg: any) => {
            if (msg !== null) {
                const stringData = msg.content.toString();
                const jsonData = JSON.parse(stringData);
                
                const findingData = new ConvertDataFlow.FinderData(jsonData.device_name);
                const dataOut = await findingData.haddleFinderData();
                console.log("dataout => ",dataOut)
                ch2.ack(msg);

            } else {
                console.log('Consumer cancelled by server');
            }
        });
    });
});