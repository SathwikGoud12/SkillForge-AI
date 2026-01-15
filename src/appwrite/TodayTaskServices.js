
import AppwriteTablesDB from "./AppwriteTablesDB";
import { Query } from "appwrite";

const db = new AppwriteTablesDB();
const TASKS_TABLE_ID = "todays_tasks";

class TodaysTasksService {

  async getUserTasks(userId) {
    return db.listRows(
      TASKS_TABLE_ID,
      [Query.equal("userId", userId)]
    );
  }

  async createTask(data) {
    return db.createRow(TASKS_TABLE_ID, data);
  }

  async updateTask(taskId, data) {
    return db.updateRow(TASKS_TABLE_ID, taskId, data);
  }
}

export default TodaysTasksService;
