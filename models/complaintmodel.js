import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema({
  user_id: {type: mongoose.Schema.Types.ObjectId,ref: 'Users',required: true},
  order_id: {type: mongoose.Schema.Types.ObjectId,ref: 'Orders',required: true},
  type: {type: String,enum: ['Missing Item', 'Wrong Item', 'Damaged Item', 'Other'], required: true
  },
  description: {type: String,required: true,trim: true
  },
  image_url: {type: String,default: null   },
  status: {type: String,enum: ['Pending', 'In Progress', 'Resolved', 'Rejected'],default: 'Pending'}
}, { timestamps: true });

const Complaint = mongoose.model('Complaint', complaintSchema);
export default Complaint;
