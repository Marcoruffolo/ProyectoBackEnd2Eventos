import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
    event: {type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true},
    user: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    quantity: {type: Number, required: true, default: 1},
    status: {type: String, enum: ["active","cancelled"], default: "active"},
    reservationCode: {type: String, required: true, unique: true},
    createdAt: {type: Date, default: Date.now},
    cancelledAt: {type: Date, default: null}
})

const Ticket = mongoose.model("Ticket", ticketSchema)

export default Ticket;
