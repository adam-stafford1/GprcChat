const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');
var readline = require("readline");

const PROTO_PATH = 'chat.proto';
const SERVER_URI = '0.0.0.0:50051';

const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);

const client = new protoDescriptor.ChatService(SERVER_URI, grpc.credentials.createInsecure());

let username;

//Read terminal Lines
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

//Start the stream between server and client
function startChat() {
    let channel = client.joinChat({ user: username });

    channel.on("data", onData);

    rl.on("line", function (text) {
        client.sendMessage({ user: username, message: text }, res => { });
    });
}

//When server send a message
function onData(message) {
    if (message.user == username) {
        return;
    }
    console.log(`${message.user}: ${message.message}`);
}

//Ask user name than start the chat
rl.question("What's ur name? ", answer => {
    username = answer;

    startChat();
});

