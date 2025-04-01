import mongoose from "mongoose"

const SectionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a section name"],
      unique: true,
    },
    title: {
      type: String,
      required: [true, "Please provide a title"],
    },
    subtitle: String,
    content: String,
    items: [
      {
        title: String,
        description: String,
        icon: String,
        image: String,
        link: String,
      },
    ],
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

export default mongoose.models.Section || mongoose.model("Section", SectionSchema)

