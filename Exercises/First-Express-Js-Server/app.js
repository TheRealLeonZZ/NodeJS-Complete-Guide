const express = require('express');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const app = express();

app.use(adminRoutes);
app.use(shopRoutes);

app.listen(3000);
