const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  middleName: { type: String },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  address: {
    municipality: { type: String, required: true, default: 'Bantayan' },
    province: { type: String, required: true, default: 'Cebu' },
    barangay: { type: String, required: true }
  },
  password: { type: String, required: true },
  bio: { type: String },
  role: { type: String, enum: ['user', 'admin', 'co-admin'], default: 'user' },
  assignedBarangays: [{ type: String }], // for co-admins
  verified: { type: Boolean, default: false }, // admin verification
  pushSubscription: { type: Object },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);