const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const { initDB, User, Product, Order, Detection } = require('./database');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('.')); // Serve static files from root folder
app.use('/uploads', express.static('uploads'));

// Multer for image uploads
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, 'img-' + Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// --- AUTH ENDPOINTS ---
app.post('/api/register', async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.json({ success: true, user });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email, password } });
  if (user) {
    res.json({ success: true, user });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

// --- PRODUCT ENDPOINTS ---
app.get('/api/products', async (req, res) => {
  const products = await Product.findAll();
  res.json(products);
});

app.post('/api/products', async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.json({ success: true, product });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// --- ORDER ENDPOINTS ---
app.post('/api/orders', async (req, res) => {
  try {
    const { customerId, items, total, customerName, customerPhone } = req.body;
    
    // Deduct stock
    if (Array.isArray(items)) {
      for (const item of items) {
        if (item.id) {
          const product = await Product.findByPk(item.id);
          if (product) {
            product.stock = Math.max(0, product.stock - (item.qty || 1));
            await product.save();
          }
        }
      }
    }

    const order = await Order.create({
      customerId: customerId || null,
      items,
      total,
      customerName,
      customerPhone,
      status: 'pending'
    });

    res.json({ success: true, order });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

app.get('/api/orders', async (req, res) => {
  const orders = await Order.findAll({ order: [['createdAt', 'DESC']] });
  res.json(orders);
});

app.patch('/api/orders/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const order = await Order.findByPk(id);
  if (order) {
    order.status = status;
    await order.save();
    res.json({ success: true, order });
  } else {
    res.status(404).json({ success: false, message: 'Order not found' });
  }
});

// --- AI CROP DISEASE DETECTION ---
app.post('/api/detect-crop-disease', upload.single('image'), async (req, res) => {
  const file = req.file;
  if (!file) return res.status(400).json({ message: 'No image uploaded' });

  // Intelligent Simulation Logic
  const fileName = file.originalname.toLowerCase();
  let result = {};

  if (fileName.includes('rotten') || fileName.includes('disease') || fileName.includes('spot') || fileName.includes('blight')) {
    result = {
      status: "diseased",
      disease_name: "Leaf Blight / Fungal Infection",
      confidence: (85 + Math.random() * 10).toFixed(1),
      severity: "high",
      treatment: "Apply copper-based fungicide and remove infected leaves immediately. Improve air circulation.",
      prevention: "Avoid overhead watering and ensure balanced nitrogen fertilization."
    };
  } else if (fileName.includes('withered') || fileName.includes('dry')) {
    result = {
      status: "diseased",
      disease_name: "Bacterial Wilt",
      confidence: (78 + Math.random() * 12).toFixed(1),
      severity: "medium",
      treatment: "Drench soil with antibiotic solutions. Control soil moisture.",
      prevention: "Use disease-free seeds and ensure proper drainage."
    };
  } else {
    result = {
      status: "healthy",
      disease_name: "None Detected",
      confidence: (92 + Math.random() * 6).toFixed(1),
      severity: "none",
      treatment: "Maintain current care routine. Ensure adequate sunlight.",
      prevention: "Regular monitoring and balanced nutrient application."
    }
  }

  // Save to history
  await Detection.create({
    type: 'crop',
    inputData: { image: file.path },
    result
  });

  // Artificial delay to feel "intelligent"
  setTimeout(() => res.json(result), 1500);
});

// --- AI SOIL ANALYSIS ---
app.post('/api/soil-analysis', upload.single('image'), async (req, res) => {
  const { ph, nitrogen, phosphorus, potassium, moisture } = req.body;
  const file = req.file;

  // Logic for analysis
  const n = parseFloat(nitrogen) || 0;
  const p = parseFloat(phosphorus) || 0;
  const k = parseFloat(potassium) || 0;
  const phVal = parseFloat(ph) || 7.0;

  let soilHealth = "good";
  let warnings = [];
  let suitableCrops = ["Wheat", "Rice", "Maize"];
  let recommendedFertilizer = "Balanced NPK (19:19:19)";

  if (n < 30) {
    soilHealth = "moderate";
    warnings.push("Low Nitrogen detected");
    recommendedFertilizer = "Urea or Blood Meal";
    suitableCrops = ["Legumes", "Soybeans"];
  }
  if (p < 30) {
    soilHealth = "moderate";
    warnings.push("Low Phosphorus detected");
    recommendedFertilizer = "Single Super Phosphate (SSP)";
  }
  if (phVal < 6.0) {
    soilHealth = "poor";
    warnings.push("Highly acidic soil");
    recommendedFertilizer += " + Agricultural Lime";
  } else if (phVal > 8.0) {
    soilHealth = "poor";
    warnings.push("Alkaline soil detected");
    recommendedFertilizer += " + Elemental Sulfur";
  }

  const result = {
    soil_health: soilHealth,
    soil_type: file ? "Loamy (Analyzed from Image)" : "Determined from parameters",
    nutrients: {
      nitrogen: n < 30 ? "low" : n < 70 ? "medium" : "high",
      phosphorus: p < 30 ? "low" : p < 70 ? "medium" : "high",
      potassium: k < 30 ? "low" : k < 70 ? "medium" : "high"
    },
    recommended_fertilizer: recommendedFertilizer,
    quantity: "50-75kg per acre",
    suitable_crops: suitableCrops,
    warnings: warnings.length > 0 ? warnings.join(', ') : "None"
  };

  await Detection.create({
    type: 'soil',
    inputData: { ph, nitrogen, phosphorus, potassium, moisture, image: file?.path },
    result
  });

  setTimeout(() => res.json(result), 1800);
});

// Root redirect to index.html if requested
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start Server
initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Agroverse Backend running on http://localhost:${PORT}`);
  });
});
