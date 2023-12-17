// models/todo.js
'use strict';
const {
  Model, Op
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    static async addTask(params) {
      return await Todo.create(params);
    }
    static async showList() {
      console.log("My Todo list \n");

      console.log("Overdue");
      // FILL IN HERE
      const overdu = await Todo.overdue();
      const formatOverdu = overdu
        .map((todo) => todo.displayableString())
        .join("\n")
        .trim();
      console.log(formatOverdu);
      console.log("\n");

      console.log("Due Today");
      // FILL IN HERE
      const due = await Todo.dueToday();
      const formatDue = due
        .map((todo) => todo.displayableString())
        .join("\n")
        .trim();
      console.log(formatDue);
      console.log("\n");

      console.log("Due Later");
      // FILL IN HERE
      const dueLate = await Todo.dueLater();
      const formatDueLater = dueLate
        .map((todo) => todo.displayableString())
        .join("\n")
        .trim();
      console.log(formatDueLater);
    }

    static async overdue() {
      // FILL IN HERE TO RETURN OVERDUE ITEMS
      const overdue = await Todo.findAll({
        where: {
          dueDate: { [Op.lt]: new Date() },
        },
      });
      return overdue;
    }

    static async dueToday() {
      // FILL IN HERE TO RETURN ITEMS DUE tODAY
      const due = await Todo.findAll({
        where: {
          dueDate: { [Op.eq]: new Date() },
        },
      });
      return due;
    }

    static async dueLater() {
      // FILL IN HERE TO RETURN ITEMS DUE LATER
      const dueLate = await Todo.findAll({
        where: {
          dueDate: { [Op.gt]: new Date() },
        },
      });
      return dueLate;
    }

    static async markAsComplete(id) {
      // FILL IN HERE TO MARK AN ITEM AS COMPLETE
      await Todo.update(
        {
          completed: true,
        },
        {
          where: { id: id },
        }
      );
    }

    displayableString() {
      let checkbox = this.completed ? "[x]" : "[ ]";
      return `${this.id}. ${checkbox} ${this.title} ${
        String(this.dueDate) === new Date().toISOString().slice(0, 10)
          ? ""
          : " " + this.dueDate
      }`;
    }
  }
  Todo.init({
    title: DataTypes.STRING,
    dueDate: DataTypes.DATEONLY,
    completed: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Todo',
  });
  return Todo;
};
