import { Query } from "appwrite";
import AppwriteTablesDB from "./AppWriteTableDB";
import { PROJECTS_TABLE_ID } from "../utils/appwrite/constants";

const db = new AppwriteTablesDB();

class ProjectService {

  async createProject(data) {
    return db.createRow(PROJECTS_TABLE_ID, data);
  }


  async getProjectsByTopic(topicId) {
    return db.listRows(
      PROJECTS_TABLE_ID,
      [
        Query.equal("topicId", [topicId]),
        // Removed isActive filter - attribute doesn't exist in table
      ]
    );
  }

  async getAllProjects() {
    return db.listRows(PROJECTS_TABLE_ID);
  }

  async deleteProject(id) {
    // Hard delete since we don't have isActive attribute
    return db.deleteRow(PROJECTS_TABLE_ID, id);
  }
}

export default ProjectService;
