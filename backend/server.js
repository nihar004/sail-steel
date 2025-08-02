const express = require('express');
const cors = require('cors');
const adminAuthMiddleware = require('./middleware/adminAuth');
const app = express();
const productRoutes = require('./routes/public/products');
const authRoutes = require('./routes/admin/auth');
const userRoutes = require('./routes/admin/users');
const adminProductRoutes = require('./routes/admin/products');
const adminCategoryRoutes = require('./routes/admin/category');

app.use(cors());
app.use(express.json());

// Change the wildcard route to use middleware for specific routes
app.use('/admin', adminAuthMiddleware);

app.use('/products', productRoutes);
app.use('/auth', authRoutes);
app.use('/admin/users', userRoutes); // This will now be protected by the middleware
app.use('/admin/products', adminProductRoutes); // This will also be protected
app.use('/admin/categories', adminCategoryRoutes); // This will also be protected

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
