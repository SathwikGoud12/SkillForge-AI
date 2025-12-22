import { Databases, ID, Query } from "appwrite";
import appwriteClient from ".";

class TopicServices {
  constructor() {
    this.databases = new Databases(appwriteClient);
  }

  async createTopic(data) {
    return await this.databases.createDocument(
      import.meta.env.VITE_APPWRITE_DB_ID,
      import.meta.env.VITE_APPWRITE_TOPICS_TABLE_ID,
      ID.unique(),
      data
    );
  }

  async getTopicsByDomain(domainId) {
    return await this.databases.listDocuments(
      import.meta.env.VITE_APPWRITE_DB_ID,
      import.meta.env.VITE_APPWRITE_TOPICS_TABLE_ID,
      [Query.equal("domainId", domainId)]
    );
  }

  async updateTopic(id, data) {
    return await this.databases.updateDocument(
      import.meta.env.VITE_APPWRITE_DB_ID,
      import.meta.env.VITE_APPWRITE_TOPICS_TABLE_ID,
      id,
      data
    );
  }

  async deleteTopic(id) {
    return await this.databases.deleteDocument(
      import.meta.env.VITE_APPWRITE_DB_ID,
      import.meta.env.VITE_APPWRITE_TOPICS_TABLE_ID,
      id
    );
  }
}

export default TopicServices;
