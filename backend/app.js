const express = require('express');
const cors = require('cors');
const app = express();
const productRoutes = require('./routes/products');

app.use(cors());
app.use(express.json());

app.use('/api/products', productRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
