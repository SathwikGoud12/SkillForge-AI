import { Query } from "appwrite";
import AppwriteTablesDB from "./AppWriteTableDB";
import { ASSESSMENTS_TABLE_ID } from "../utils/appwrite/constants";

const db = new AppwriteTablesDB();

class AssessmentService {

  async createAssessment(data) {
    return db.createRow(
      ASSESSMENTS_TABLE_ID,
      data
    );
  }

  // ✅ Topic-specific MCQs
  async getAssessmentsByTopic(topicId) {
    return db.listRows(
      ASSESSMENTS_TABLE_ID,
      [Query.equal("topicId", topicId)]
    );
  }

  // ✅ Admin dashboard
  async getAllAssessments() {
    return db.listRows(ASSESSMENTS_TABLE_ID);
  }

  async getAssessmentById(id) {
    return db.getRow(
      ASSESSMENTS_TABLE_ID,
      id
    );
  }

  async updateAssessment(id, data) {
    return db.updateRow(
      ASSESSMENTS_TABLE_ID,
      id,
      data
    );
  }

  // ✅ Soft delete (optional)
  async deleteAssessment(id) {
    return db.updateRow(
      ASSESSMENTS_TABLE_ID,
      id,
      { isActive: false }
    );
  }
}

export default AssessmentService;
