const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB } = require('./config/database');
const userRoutes = require('./routes/userRoutes');
const parcelRoutes = require('./routes/parcelRoutes');
const errorHandler = require('./middlewares/errorHandler');
const locationRoutes = require("./routes/locationRoutes")
const paymentRoutes = require("./routes/paymentRoutes")

dotenv.config();

const app = express();
app.use(cors())
// app.use(cors({
//     credentials: true
// }));;
app.use(express.json());

// Connect to db
connectDB();

// Routes
app.use('/api/users', userRoutes);
app.use('/api/parcels', parcelRoutes);
app.use("/api/locations", locationRoutes)
app.use("/api/pay", paymentRoutes)

app.get('/', (req, res) => {
    res.send('Welcome to Send-It API');
});

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 8085;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.use("/api/sms", smsRoutes);