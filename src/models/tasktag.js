import { DataTypes } from "sequelize";
import db from "../config/database.js";

const TaskTag = db.define(
  "TaskTag",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
  },
  {
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ["task_id", "tag_id"],
      },
    ],
  },
);

export default TaskTag;
