import { Query } from "appwrite";
import AppwriteTablesDB from "./AppWriteTableDB";

const db = new AppwriteTablesDB();
const TOPICS_TABLE_ID = import.meta.env.VITE_APPWRITE_TOPICS_TABLE_ID;

class TopicServices {

  async createTopic(data) {
    return db.createRow(TOPICS_TABLE_ID, data);
  }

  // ✅ Topic list inside a domain
  async getTopicsByDomain(domainId) {
    return db.listRows(
      TOPICS_TABLE_ID,
      [Query.equal("domainId", domainId)]
    );
  }

  // ✅ Admin usage
  async getAllTopics() {
    return db.listRows(TOPICS_TABLE_ID);
  }

  async getTopicById(topicId) {
    return db.getRow(TOPICS_TABLE_ID, topicId);
  }

  async updateTopic(topicId, data) {
    return db.updateRow(TOPICS_TABLE_ID, topicId, data);
  }

  async deleteTopic(topicId) {
    return db.deleteRow(TOPICS_TABLE_ID, topicId);
  }
}

export default TopicServices;
