const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, 'agroverse.sqlite'),
  logging: false
});

// User Model
const User = sequelize.define('User', {
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.ENUM('farmer', 'customer'), defaultValue: 'customer' },
  balance: { type: DataTypes.FLOAT, defaultValue: 10000 }
});

// Product Model
const Product = sequelize.define('Product', {
  name: { type: DataTypes.STRING, allowNull: false },
  category: { type: DataTypes.STRING },
  brand: { type: DataTypes.STRING },
  price: { type: DataTypes.FLOAT, allowNull: false },
  mrp: { type: DataTypes.FLOAT },
  stock: { type: DataTypes.INTEGER, defaultValue: 0 },
  unit: { type: DataTypes.STRING, defaultValue: 'kg' },
  img: { type: DataTypes.STRING },
  description: { type: DataTypes.TEXT },
  location: { type: DataTypes.STRING }
});

// Order Model
const Order = sequelize.define('Order', {
  total: { type: DataTypes.FLOAT, allowNull: false },
  status: { type: DataTypes.ENUM('pending', 'confirmed', 'delivered', 'rejected'), defaultValue: 'pending' },
  items: { type: DataTypes.JSON }, // Store as JSON array
  customerName: { type: DataTypes.STRING },
  customerPhone: { type: DataTypes.STRING },
  customerId: { type: DataTypes.INTEGER, allowNull: true } // Explicitly allow null for guests
});

// Detection History Model
const Detection = sequelize.define('Detection', {
  type: { type: DataTypes.ENUM('crop', 'soil'), allowNull: false },
  inputData: { type: DataTypes.JSON }, // Image path or manual parameters
  result: { type: DataTypes.JSON },
  status: { type: DataTypes.STRING }
});

// Relationships
User.hasMany(Product, { foreignKey: 'farmerId' });
Product.belongsTo(User, { as: 'farmer', foreignKey: 'farmerId' });

User.hasMany(Order, { foreignKey: 'customerId' });
Order.belongsTo(User, { as: 'customer', foreignKey: 'customerId' });

User.hasMany(Detection, { foreignKey: 'userId' });

const initDB = async () => {
  await sequelize.sync();
  console.log('Database synced');

  // Seed initial users if empty
  const userCount = await User.count();
  if (userCount === 0) {
    await User.bulkCreate([
      { id: 1, name: 'Agroverse Admin', email: 'admin@agroverse.com', password: 'password', role: 'farmer' },
      { id: 2, name: 'Guest User', email: 'guest@agroverse.com', password: 'password', role: 'customer' }
    ]);
    console.log('Default users seeded');
  }

  // Seed initial products if empty
  const count = await Product.count();
  if (count === 0) {
    await Product.bulkCreate([
      { name: 'Coragen Insecticide', brand: 'FMC', category: 'insecticides', price: 129, mrp: 220, stock: 50, unit: 'bottle', img: 'https://images.unsplash.com/photo-1471193945509-9ad0617afabf?w=300&q=80' },
      { name: 'Syngenta Tomato Seeds', brand: 'Syngenta', category: 'seeds', price: 299, mrp: 480, stock: 100, unit: 'packet', img: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=300&q=80' },
      { name: 'Organic Tomatoes', category: 'Vegetables', price: 45, mrp: 60, stock: 150, unit: 'kg', img: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=300&q=80', location: 'Pune' },
      { name: 'Alphonso Mangoes', category: 'Fruits', price: 450, mrp: 600, stock: 80, unit: 'dozen', img: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=300&q=80', location: 'Ratnagiri' },
      { name: 'NPK 19:19:19 Fertilizer', brand: 'IFFCO', category: 'nutrients', price: 180, mrp: 250, stock: 200, unit: 'kg', img: 'https://images.unsplash.com/photo-1628352081506-83c43123ed6d?w=300&q=80' },
      { name: 'Urea Fertilizer', brand: 'IFFCO', category: 'nutrients', price: 266, mrp: 300, stock: 500, unit: 'bag', img: 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?w=300&q=80' },
      { name: 'Basmati Rice (Premium)', brand: 'Daawat', category: 'grains', price: 110, mrp: 150, stock: 300, unit: 'kg', img: 'https://images.unsplash.com/photo-1586201327693-86629f7bb19c?w=300&q=80' },
      { name: 'Dried Red Chillies', brand: 'Guntur', category: 'spices', price: 220, mrp: 300, stock: 120, unit: 'kg', img: 'https://images.unsplash.com/photo-1599599810694-b5b37304c041?w=300&q=80' },
      { name: 'Sunflower Seeds', brand: 'Mahyco', category: 'seeds', price: 350, mrp: 500, stock: 80, unit: 'packet', img: 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=300&q=80' },
      { name: 'Bio-Pesticide (Organic)', category: 'insecticides', price: 450, mrp: 650, stock: 60, unit: 'bottle', img: 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?w=300&q=80' }
    ]);
  }
};

module.exports = { sequelize, User, Product, Order, Detection, initDB };
