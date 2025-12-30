import { Query } from "appwrite";
import AppwriteTablesDB from "./AppWriteTableDB";
import { USER_TOPIC_PROGRESS_TABLE_ID } from "../utils/appwrite/constants";

const db = new AppwriteTablesDB();

class UserTopicProgressService {

  // ✅ Get progress of a user for a specific topic
  async getProgress(userId, topicId) {
    const res = await db.listRows(
      USER_TOPIC_PROGRESS_TABLE_ID,
      [
        Query.equal("userId", userId),
        Query.equal("topicId", topicId),
      ]
    );
    return res.rows[0] || null;
  }

  // ✅ Insert or update progress
  async upsertProgress(data) {
    const existing = await this.getProgress(
      data.userId,
      data.topicId
    );

    if (existing) {
      return db.updateRow(
        USER_TOPIC_PROGRESS_TABLE_ID,
        existing.$id,
        data
      );
    }

    return db.createRow(
      USER_TOPIC_PROGRESS_TABLE_ID,
      data
    );
  }

  // ✅ Admin dashboard usage
  async getAllProgress() {
    return db.listRows(USER_TOPIC_PROGRESS_TABLE_ID);
  }
}

export default UserTopicProgressService;
