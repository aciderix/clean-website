import mongoose from "mongoose"

const PartnerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a partner name"],
      unique: true,
    },
    logo: {
      type: String,
      required: [true, "Please provide a logo URL"],
    },
    website: String,
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
)

export default mongoose.models.Partner || mongoose.model("Partner", PartnerSchema)

