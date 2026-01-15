import { Query } from "appwrite";
import AppwriteTablesDB from "./AppWriteTableDB";
const db = new AppwriteTablesDB();
const USER_PROFILES_TABLE_ID = "userprofiles";

class UserProfileService {

  async createProfile(data) {
    return db.createRow(USER_PROFILES_TABLE_ID, data);
  }

  async getProfileByUserId(userId) {
    return db.listRows(
      USER_PROFILES_TABLE_ID,
      [Query.equal("userId", userId)]
    );
  }

  async updateProfile(rowId, data) {
    return db.updateRow(USER_PROFILES_TABLE_ID, rowId, data);
  }

  async deleteProfile(rowId) {
    return db.deleteRow(USER_PROFILES_TABLE_ID, rowId);
  }
}

export default UserProfileService;
