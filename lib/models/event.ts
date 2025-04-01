import mongoose from "mongoose"

const EventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide an event title"],
    },
    description: {
      type: String,
      required: [true, "Please provide an event description"],
    },
    date: {
      type: Date,
      required: [true, "Please provide an event date"],
    },
    location: String,
    image: String,
    link: String,
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
)

export default mongoose.models.Event || mongoose.model("Event", EventSchema)

