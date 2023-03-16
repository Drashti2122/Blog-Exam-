const mongoose = require('mongoose');
mongoose.set('strictQuery', true);

const dotenv = require('dotenv');


dotenv.config({ path: "./config.env" });


const DB = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
);
const app = require('./app');

mongoose.connect(DB, {
    useNewUrlParser: true,
}).then(() => {
    console.log("DB connection successfully!");
});

const server = app.listen(process.env.PORT || 3011, '127.0.0.1', () => {
    console.log("Server running")
})

process.on('unhandledRejection', err => {
    console.log(err.name, err.message);
    console.log("UNHANDLER REJECTION!Shutting down...")
    //first of all we shout down the server,then close the application
    server.close(() => {
        process.exit(1)//killed all the pendding process
    });
})