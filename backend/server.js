const express = require('express');
const cors = require('cors');
const adminAuthMiddleware = require('./middleware/adminAuth');
const app = express();
const productRoutes = require('./routes/public/products');
const usersRouter = require('./routes/public/users');
const authRoutes = require('./routes/admin/auth');
const adminUserRoutes = require('./routes/admin/users');
const categoryRoutes = require('./routes/public/category');
const adminProductRoutes = require('./routes/admin/products');
const adminCategoryRoutes = require('./routes/admin/category');

app.use(cors());
app.use(express.json());

// Change the wildcard route to use middleware for specific routes
app.use('/admin', adminAuthMiddleware);
app.use('/users', usersRouter); // Public route for user creation
app.use('/products', productRoutes);
app.use('/auth', authRoutes);
app.use('/admin/users', adminUserRoutes); // This will now be protected by the middleware
app.use('/admin/products', adminProductRoutes); // This will also be protected
app.use('/admin/categories', adminCategoryRoutes); // This will also be protected
app.use('/categories', categoryRoutes); // Public route for categories

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
