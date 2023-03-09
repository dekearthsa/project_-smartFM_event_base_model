const amqplib = require('amqplib/callback_api');
const mqtt = require("mqtt");   
require("dotenv").config({path:"../.env"})

const username = process.env.USERNAME || "admin"
const password = process.env.PASSWORD || "1234"
const isTopic = process.env.TOPIC || "lfl/message"
const queueTopicInsert = 'inserting';
const queueTopicFinder = 'update';

const rabbitUser = "admin";
const rabbitPass = "1234";

// const connMQTT = process.env.CONN || "mqtt://localhost:1883";
// const connRabbitMQ = process.env.CONNRABBITMQ || "amqp://localhost";

const connMQTT = process.env.CONN || "mqtt://host.docker.internal:1883";
const connRabbitMQ = process.env.CONNRABBITMQ || `amqp://${rabbitUser}:${rabbitPass}@host.docker.internal`;

// const port = process.env.PORT 


const mqttClient = mqtt.connect(
    connMQTT,
    {
        username: username,
        password: password
    }
)

mqttClient.on("connect", () => {
    console.log("MQTT service lfl is running.")

    mqttClient.subscribe(isTopic, (err: any) => {
        if (err) {
            console.log("error subcribe")
        }
    })

    mqttClient.on("message", async (topic: string, message: any) => {
        try {
            console.log(`on sub ${topic} shot msg => ${message}`)
            // sender //
            amqplib.connect(connRabbitMQ, (err:any, conn:any) => {
                if (err) throw err;
                conn.createChannel((err:any, ch:any) => {
                    if(err) throw err;
                    ch.assertQueue(queueTopicFinder);
                    ch.sendToQueue(queueTopicFinder, Buffer.from(message));
                    ch.assertQueue(queueTopicInsert);
                    ch.sendToQueue(queueTopicInsert, Buffer.from(message));
                })
            })
        } catch (err) {
            console.log(`error => ${err}`)
        }
    })

})

