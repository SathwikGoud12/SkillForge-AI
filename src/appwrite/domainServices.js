import { Databases, Storage, ID } from "appwrite";
import appwriteClient from ".";

class DomainService {
  constructor() {
    this.databases = new Databases(appwriteClient);
    this.storage = new Storage(appwriteClient);
  }

  // Upload image
  async uploadDomainImage(file) {
    return await this.storage.createFile(
      import.meta.env.VITE_APPWRITE_BUCKET_ID,
      ID.unique(),
      file
    );
  }
  async getDomainById(id) {
    return await this.databases.getDocument(
      import.meta.env.VITE_APPWRITE_DB_ID,
      import.meta.env.VITE_APPWRITE_Domains_TABLE_ID,
      id
    );
  }

  // 🔥 ADD THIS METHOD (VERY IMPORTANT)
  getImagePreview(imageId) {
    return this.storage.getFileView(
      import.meta.env.VITE_APPWRITE_BUCKET_ID,
      imageId
    );
  }

  // Create domain
  async createDomain(data) {
    return await this.databases.createDocument(
      import.meta.env.VITE_APPWRITE_DB_ID,
      import.meta.env.VITE_APPWRITE_Domains_TABLE_ID,
      ID.unique(),
      data
    );
  }

  // Get all domains
  async getAllDomains() {
    return await this.databases.listDocuments(
      import.meta.env.VITE_APPWRITE_DB_ID,
      import.meta.env.VITE_APPWRITE_Domains_TABLE_ID
    );
  }

  // Update domain
  async updateDomain(documentId, data) {
    return await this.databases.updateDocument(
      import.meta.env.VITE_APPWRITE_DB_ID,
      import.meta.env.VITE_APPWRITE_Domains_TABLE_ID,
      documentId,
      data
    );
  }
}

export default DomainService;
