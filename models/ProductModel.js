import { Sequelize, DataTypes } from "sequelize";
import db from "../config/Database.js";

const Products = db.define(
  "items",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    product_name: {
      type: DataTypes.STRING
    },
    description: {
      type: DataTypes.STRING
    },
    qty: {
      type: DataTypes.INTEGER
    },
    lokasi_penyimpanan: {
      type: DataTypes.STRING
    },
    harga: {
      type: DataTypes.INTEGER
    },
  },
  {
    timestamps: true, 
  }
);

export default Products;
