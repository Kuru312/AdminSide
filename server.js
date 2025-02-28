import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';

const app = express();

// Enable CORS for both frontend ports (5174 and 5175)
app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'];
    if (allowedOrigins.includes(origin) || !origin) { // Allow requests from allowed origins or no origin (for local testing)
      callback(null, true);  // Allow the request
    } else {
      callback(new Error('CORS policy: Origin not allowed'), false);  // Block the request
    }
  }
}));

// Middleware to parse JSON bodies
app.use(express.json());  // You were missing this middleware to handle JSON data in POST requests

// MongoDB connection
mongoose.connect('CoonectionSctring, { useNewUrlParser: true, useUnifiedTopology: true }) // Specify the database name
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);  // Exit the process with failure
  });

// Seller and Investor Application Schema
const sellerApplicationSchema = new mongoose.Schema({
  businessName: { type: String, required: true },
  companyType: { type: String, required: true },
  province: { type: String, required: true },
  city: { type: String, required: true },
  farmLocation: { type: String, required: true },
  contactNumber: { type: String, required: true },
  supportingDocument: { type: String, required: true },
});

const investorApplicationSchema = new mongoose.Schema({
  investmentType: { type: String, required: true },
  companyName: { type: String },
  industry: { type: String },
  contactNumber: { type: String, required: true },
  supportingDocument: { type: String, required: true },
});

// User Schema
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    cartData: { type: Object, default: {} },
    role: {
      type: [String],
      enum: ['user', 'seller', 'investor'],
      default: ['user'],
    },
    sellerApplication: { type: sellerApplicationSchema, default: null },
    investorApplication: { type: investorApplicationSchema, default: null },
  },
  { minimize: false }
);

// Order Item Schema
const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true },
});

// Order Schema
const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: {
    type: [orderItemSchema],
    required: true,  // Ensure items cannot be empty
  },
  amount: { type: Number, required: true },
  address: { type: Object, required: true },
  status: { type: String, default: 'Order Placed' },
  paymentMethod: { type: String, required: true },
  payment: { type: Boolean, default: false },
  date: { type: Number, required: true },
  courierId: { type: mongoose.Schema.Types.ObjectId, ref: 'Courier', default: null }, // Add courierId field
});

// Creating the Models
const User = mongoose.model('User', userSchema, 'users');  // Replace 'users' with the actual collection name if different
const Order = mongoose.model('Order', orderSchema, 'orders');

// ApproveSellerInvestor Schema
const approveSellerInvestorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  cartData: { type: Object, default: {} },
  role: {
    type: [String],
    enum: ['user', 'seller', 'investor'],
    default: ['user'],
  },
  sellerApplication: { type: sellerApplicationSchema, default: null },
  investorApplication: { type: investorApplicationSchema, default: null },
});

const ApproveSellerInvestor = mongoose.model('ApproveSellerInvestor', approveSellerInvestorSchema, 'approveSellerInvestor');

// Courier Schema
const courierSchema = new mongoose.Schema({
  name: { type: String, required: true },
  available: { type: Boolean, default: true },
  address: { type: String, required: true },
  plate_number: { type: String, required: true },
  driver_license: { type: String, required: true },
});

const Courier = mongoose.model('Courier', courierSchema, 'couriers');

// Route to fetch users
app.get('/users', async (req, res) => {
  try {
    const users = await User.find();  // Fetch users from MongoDB
    console.log("Users fetched from DB:", users);  // Log users to check data
    res.json(users);                  // Send users as JSON response
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `Error fetching users: ${error.message}` });
  }
});

// Route to fetch a user by ID
app.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);  // Fetch user by ID from MongoDB
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);  // Send user as JSON response
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `Error fetching user: ${error.message}` });
  }
});

// Route to fetch orders
app.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find();  // Fetch orders from MongoDB
    res.json(orders);                   // Send orders as JSON response
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `Error fetching orders: ${error.message}` });
  }
});

// Route to fetch an order by ID
app.get('/orders/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);  // Fetch order by ID from MongoDB
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);  // Send order as JSON response
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `Error fetching order: ${error.message}` });
  }
});

// Route to approve a user
app.post('/approve/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Move the user to the ApproveSellerInvestor collection
    const approvedUser = new ApproveSellerInvestor(user.toObject());
    await approvedUser.save();
    // Optionally, delete the user from the original collection
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'User approved' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `Error approving user: ${error.message}` });
  }
});

// Route to delete a user
app.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `Error deleting user: ${error.message}` });
  }
});

// Route to fetch approved users
app.get('/approveSellerInvestor', async (req, res) => {
  try {
    const approvedUsers = await ApproveSellerInvestor.find();  // Fetch approved users from MongoDB
    res.json(approvedUsers);  // Send approved users as JSON response
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `Error fetching approved users: ${error.message}` });
  }
});

// Route to fetch an approved user by ID
app.get('/approveSellerInvestor/:id', async (req, res) => {
  try {
    const approvedUser = await ApproveSellerInvestor.findById(req.params.id);  // Fetch approved user by ID from MongoDB
    if (!approvedUser) {
      return res.status(404).json({ message: 'Approved user not found' });
    }
    res.json(approvedUser);  // Send approved user as JSON response
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `Error fetching approved user: ${error.message}` });
  }
});

// Route to fetch couriers
app.get('/couriers', async (req, res) => {
  try {
    const couriers = await Courier.find();  // Fetch couriers from MongoDB
    res.json(couriers);  // Send couriers as JSON response
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `Error fetching couriers: ${error.message}` });
  }
});

// Route to update order status
app.post('/orders/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    order.status = status;
    await order.save();
    res.status(200).json({ message: 'Order status updated' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `Error updating order status: ${error.message}` });
  }
});

// Logistics Schema
const logisticsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: {
    type: [orderItemSchema],
    required: true,
  },
  amount: { type: Number, required: true },
  address: { type: Object, required: true },
  status: { type: String, default: 'Shipped' },
  paymentMethod: { type: String, required: true },
  payment: { type: Boolean, default: false },
  date: { type: Number, required: true },
  courierId: { type: mongoose.Schema.Types.ObjectId, ref: 'Courier', default: null },
});

const Logistics = mongoose.model('Logistics', logisticsSchema, 'logistics');

// Route to update order status and move to logistics collection
app.post('/orders/:id/ship', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    order.status = 'Shipped';
    await order.save();

    // Move the order to the Logistics collection
    const logisticsOrder = new Logistics(order.toObject());
    await logisticsOrder.save();

    // Remove the order from the original collection
    await Order.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Order shipped and moved to logistics' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `Error shipping order: ${error.message}` });
  }
});

// Route to fetch logistics orders
app.get('/logistics', async (req, res) => {
  try {
    const logisticsOrders = await Logistics.find();  // Fetch orders from the Logistics collection
    res.json(logisticsOrders);  // Send orders as JSON response
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `Error fetching logistics orders: ${error.message}` });
  }
});

// CounterPanel Schema
const courierPanelSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: {
    type: [orderItemSchema],
    required: true,
  },
  amount: { type: Number, required: true },
  address: { type: Object, required: true },
  status: { type: String, default: 'Assigned to Courier' },
  paymentMethod: { type: String, required: true },
  payment: { type: Boolean, default: false },
  date: { type: Number, required: true },
  courierId: { type: mongoose.Schema.Types.ObjectId, ref: 'Courier', default: null },
});

const CourierPanel = mongoose.model('courierpanel', courierPanelSchema, 'courierpanel');

// Route to fetch a courier by ID
app.get('/couriers/:courierId', async (req, res) => {
  try {
    const courierId = req.params.courierId;
    const courier = await Courier.findById(courierId); // Assuming Courier is your model for the couriers collection
    if (!courier) {
      return res.status(404).json({ message: 'Courier not found' });
    }
    res.json(courier);
  } catch (error) {
    console.error('Error fetching courier:', error);
    res.status(500).json({ message: 'Error fetching courier' });
  }
});
// Route to assign a courier to an order
// Route to assign a courier to an order and update the status
app.post('/logistics/:orderId/assign-courier', async (req, res) => {
  try {
    const { orderId } = req.params;
    const { courierId, status } = req.body;

    // Find the order by ID in the logistics collection
    const order = await Logistics.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Update the order with the courierId and status
    order.courierId = courierId;
    order.status = status;

    // Insert the updated order into the courierpanel collection
    const newOrder = new CourierPanel(order.toObject());
    await newOrder.save();

    // Remove the order from the logistics collection
    await Logistics.findByIdAndDelete(orderId);

    res.json(newOrder);
  } catch (error) {
    console.error('Error assigning courier:', error);
    res.status(500).json({ message: 'Error assigning courier' });
  }
});

// Route to update the status of an order in the Logistics collection
app.post('/logistics/:orderId/status', async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    // Find the order in the Logistics collection
    const order = await Logistics.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Update the status of the order
    order.status = status;
    await order.save();

    res.status(200).json({ message: 'Order status updated successfully' });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Error updating order status' });
  }
});

app.get('/couriers', async (req, res) => {
  try {
    const couriers = await Courier.find();
    res.json(couriers);
  } catch (error) {
    console.error('Error fetching couriers:', error);
    res.status(500).json({ message: 'Error fetching couriers' });
  }
});

// Route to add a new courier
app.post('/couriers', async (req, res) => {
  try {
    const newCourier = new Courier(req.body);
    await newCourier.save();
    res.status(201).json(newCourier);
  } catch (error) {
    console.error('Error adding courier:', error);
    res.status(500).json({ message: 'Error adding courier' });
  }
});

// Route to fetch orders from the courierpanel collection
app.get('/courierpanel/orders', async (req, res) => {
  try {
    const orders = await CourierPanel.find(); // Assuming CourierPanel is your model for the courierpanel collection
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Error fetching orders' });
  }
});
// Route to fetch orders assigned to a specific courier
app.get('/couriers/:courierId/orders', async (req, res) => {
  try {
    const { courierId } = req.params;
    const orders = await Logistics.find({ courierId });
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Error fetching orders' });
  }
});

// Route to update the status of an order in the courierpanel collection
app.post('/courierpanel/:orderId/status', async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    // Find the order by ID in the courierpanel collection and update the status
    const order = await CourierPanel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Error updating order status' });
  }
});
app.get('/couriers/:courierId/orders', async (req, res) => {
  const { courierId } = req.params; // Get the courierId from the request parameters
  try {
    // Fetch orders assigned to the specific courier (you need to modify this query based on your database model)
    const orders = await Order.find({ courierId }); // Assuming `Order` is your order model and it has a `courierId` field
    res.json(orders);  // Send the list of orders as a JSON response
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Error fetching orders" });
  }
});
// Route to fetch a courier by ID
app.get('/couriers/:courierId', async (req, res) => {
  try {
    const courierId = req.params.courierId;
    const courier = await Courier.findById(courierId); // Assuming Courier is your model for the couriers collection
    if (!courier) {
      return res.status(404).json({ message: 'Courier not found' });
    }
    res.json(courier);
  } catch (error) {
    console.error('Error fetching courier:', error);
    res.status(500).json({ message: 'Error fetching courier' });
  }
});
const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});
