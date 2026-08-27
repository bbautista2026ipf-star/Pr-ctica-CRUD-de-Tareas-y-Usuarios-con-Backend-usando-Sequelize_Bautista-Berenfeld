import User from "./user.js";
import Task from "./task.js";
import Profile from "./profile.js";
import Tag from "./tag.js";
import TaskTag from "./tasktag.js";

User.hasMany(Task, {
  foreignKey: { name: "user_id", allowNull: false },
  as: "tasks",
});
Task.belongsTo(User, {
  foreignKey: { name: "user_id", allowNull: false },
  as: "user",
});

User.hasOne(Profile, {
  foreignKey: { name: "user_id", allowNull: false, unique: true },
  as: "profile",
});
Profile.belongsTo(User, {
  foreignKey: { name: "user_id", allowNull: false },
  as: "user",
});

Task.belongsToMany(Tag, {
  through: TaskTag,
  foreignKey: "task_id",
  otherKey: "tag_id",
  as: "tags",
});
Tag.belongsToMany(Task, {
  through: TaskTag,
  foreignKey: "tag_id",
  otherKey: "task_id",
  as: "tasks",
});

export { User, Task, Profile, Tag, TaskTag };
