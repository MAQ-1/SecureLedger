require("dotenv").config();
const app = require('./Src/App');
const connectDB = require('./Src/config/db');

const PORT = 3000;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});