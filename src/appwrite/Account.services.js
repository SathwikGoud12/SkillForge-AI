import { Account, ID } from "appwrite";
import appwriteClient from ".";

class AppwriteAccount {
  constructor() {
    this.account = new Account(appwriteClient);
  }

  // REGISTER
  async createAppwriteAccount(email, password, fullName) {
    return await this.account.create(
      ID.unique(),
      email,
      password,
      fullName
    );
  }

  // LOGIN
  async createAppwriteEmailPasswordSession(email, password) {
    return await this.account.createEmailPasswordSession(
      email,
      password
    );
  }

  // GET CURRENT USER (NO ERRORS LOGGED)
  async getAppwriteUser() {
    try {
      return await this.account.get();
    } catch {
      return null; // normal when logged out
    }
  }

  // LOGOUT
  async logout() {
    try {
      await this.account.deleteSession("current");
      return true;
    } catch {
      return false;
    }
  }
}

export default AppwriteAccount;
