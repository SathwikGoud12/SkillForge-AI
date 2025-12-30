import { Query } from "appwrite";
import AppwriteTablesDB from "./AppWriteTableDB";
import { QUESTIONS_TABLE_ID } from "../utils/appwrite/constants";

const db = new AppwriteTablesDB();

class InterviewQuestionService {
  async createQuestion(data) {
    return db.createRow(QUESTIONS_TABLE_ID, data);
  }

  async getQuestionsByTopic(topicId) {
    return db.listRows(QUESTIONS_TABLE_ID, [
      Query.equal("topicId", topicId),
      Query.orderAsc("order"),
    ]);
  }

  async deleteQuestion(id) {
    return db.updateRow(QUESTIONS_TABLE_ID, id, { isActive: false });
  }
}

export default InterviewQuestionService;
