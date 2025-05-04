import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

// mongoose recommend to use capital letter for model name
// it will use a plural form of the model name, automatically add an "s" to the end;
const Product = mongoose.model("Product", productSchema);

export default Product;
