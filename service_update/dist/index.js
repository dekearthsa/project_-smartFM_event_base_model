"use strict";
const amqplib = require('amqplib/callback_api');
const queue = 'update';
// const hosting = "amqp://localhost"
const hosting = "amqp://host.docker.internal";
amqplib.connect(hosting, (err, conn) => {
    console.log("connected at rabbitMQ at amqp://localhost as receiver");
    if (err)
        throw err;
    // Listener //
    conn.createChannel((err, ch2) => {
        if (err)
            throw err;
        ch2.assertQueue(queue);
        ch2.consume(queue, (msg) => {
            if (msg !== null) {
                console.log(msg.content.toString());
                ch2.ack(msg);
            }
            else {
                console.log('Consumer cancelled by server');
            }
        });
    });
});
