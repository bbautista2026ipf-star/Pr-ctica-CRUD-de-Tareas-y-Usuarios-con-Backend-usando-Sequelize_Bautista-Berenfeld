import { DataTypes } from "sequelize";
import db from "../config/database.js";

const Profile = db.define(
  "Profile",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    bio: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
  },
  {
    timestamps: false,
  },
);

export default Profile;
