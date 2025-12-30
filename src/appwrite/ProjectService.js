import { Query } from "appwrite";
import AppwriteTablesDB from "./AppWriteTableDB";
import { PROJECTS_TABLE_ID } from "../utils/appwrite/constants";

const db = new AppwriteTablesDB();

class ProjectService {

  // ✅ Create project
  async createProject(data) {
    return db.createRow(PROJECTS_TABLE_ID, data);
  }

  // ✅ Projects under a topic (TopicDetail page)
  async getProjectsByTopic(topicId) {
    return db.listRows(
      PROJECTS_TABLE_ID,
      [
        Query.equal("topicId", topicId),
        Query.equal("isActive", true),
      ]
    );
  }

  // ✅ Admin dashboard usage
  async getAllProjects() {
    return db.listRows(PROJECTS_TABLE_ID);
  }

  // ✅ Optional: soft delete
  async deleteProject(id) {
    return db.updateRow(
      PROJECTS_TABLE_ID,
      id,
      { isActive: false }
    );
  }
}

export default ProjectService;
