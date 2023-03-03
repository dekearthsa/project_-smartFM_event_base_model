const amqplib = require('amqplib/callback_api');
const queue = 'finder';

// const hosting = "amqp://localhost"
const hosting = "amqp://host.docker.internal"

amqplib.connect(hosting, (err: any, conn: any) => {
    console.log("connected at rabbitMQ at amqp://localhost as receiver")
    if (err) throw err;

    // Listener
    conn.createChannel((err: any, ch2: any) => {
        if (err) throw err;

        ch2.assertQueue(queue);

        ch2.consume(queue, (msg: any) => {
            if (msg !== null) {
                console.log(msg.content.toString());
                // add database //
                ch2.ack(msg);

            } else {
                console.log('Consumer cancelled by server');
            }
        });
    });
});