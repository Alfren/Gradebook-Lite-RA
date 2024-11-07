import sequelize from "./db.js";
import { Assignment, AssignmentGroup } from "./assignmentModel.js";
import { Class } from "./classModel.js";
import { Teacher } from "./teacherModel.js";
import { Student, Grade } from "./studentModel.js";

Class.hasMany(Student, {
  foreignKey: "classId",
  onDelete: "CASCADE",
  as: "students",
});
Class.belongsTo(Teacher, { foreignKey: "teacherId" });
Teacher.hasMany(Class, {
  foreignKey: "teacherId",
  onDelete: "CASCADE",
  as: "classes",
});

AssignmentGroup.belongsTo(Class, { foreignKey: "classId" });
Assignment.hasMany(Grade, {
  foreignKey: "assignmentId",
  onDelete: "CASCADE",
  as: "grades",
});

Assignment.belongsTo(AssignmentGroup, { foreignKey: "assignmentGroupId" });

Student.hasMany(Grade, {
  foreignKey: "studentId",
  onDelete: "CASCADE",
  as: "grades",
});
Student.belongsTo(Class, { foreignKey: "classId" });

Grade.belongsTo(Student, { foreignKey: "studentId" });
Grade.belongsTo(Assignment, { foreignKey: "assignmentId" });

await sequelize.authenticate().then(async () => {
  console.log("Database connection has been established successfully.");
  // create schema private if not exists
  await sequelize.query("CREATE SCHEMA IF NOT EXISTS private");
  // Sync all models at once
  const force = true,
    alter = false;

  await sequelize
    .sync({ force, alter })
    .then(() => {
      console.log("All models synced successfully");
    })
    .catch((err) => {
      console.error("Error syncing models:", err);
    });
});

export { Assignment, AssignmentGroup, Class, Teacher, Student, Grade };
