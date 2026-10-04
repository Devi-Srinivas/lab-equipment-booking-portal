const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        console.log("==================================");
        console.log("PORT =", process.env.PORT);
        console.log("MONGO_URI exists =", process.env.MONGO_URI ? "YES" : "NO");
        console.log("MONGO_URI =", process.env.MONGO_URI);
        console.log("==================================");

        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB Atlas Connected Successfully");

    } catch (error) {

        console.log("Database Connection Failed");
        console.log(error);

        process.exit(1);
    }
};

module.exports = connectDB;