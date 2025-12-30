import { TablesDB, ID, Storage } from "appwrite";
import appwriteClient from ".";
import { APPWRITE_DB_ID, APPWRITE_BUCKET_ID } from "../utils/appwrite/constants";

class AppwriteTablesDB {
  constructor() {
    this.tablesDb = new TablesDB(appwriteClient);
    this.storage = new Storage(appwriteClient);
  }
  
  async createRow(tableId, data) {
    return this.tablesDb.createRow({
      databaseId: APPWRITE_DB_ID,
      tableId,
      rowId: ID.unique(),
      data,
    });
  }

  async getRow(tableId, rowId) {
    return this.tablesDb.getRow({
      databaseId: APPWRITE_DB_ID,
      tableId,
      rowId,
    });
  }

  async listRows(tableId, queries = []) {
    return this.tablesDb.listRows({
      databaseId: APPWRITE_DB_ID,
      tableId,
      queries,
    });
  }

  async updateRow(tableId, rowId, data) {
    return this.tablesDb.updateRow({
      databaseId: APPWRITE_DB_ID,
      tableId,
      rowId,
      data,
    });
  }

  async deleteRow(tableId, rowId) {
    return this.tablesDb.deleteRow({
      databaseId: APPWRITE_DB_ID,
      tableId,
      rowId,
    });
  }

  async uploadFile(file) {
    return this.storage.createFile(
      APPWRITE_BUCKET_ID,
      ID.unique(),
      file
    );
  }
  getFilePreview(fileId) {
    return this.storage.getFileView(
      APPWRITE_BUCKET_ID,
      fileId
    );
  }
}

export default AppwriteTablesDB;
