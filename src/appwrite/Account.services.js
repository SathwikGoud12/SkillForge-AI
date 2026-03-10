import { Account, ID, OAuthProvider } from "appwrite";
import appwriteClient from ".";

class AppwriteAccount {
  constructor() {
    this.account = new Account(appwriteClient);
  }

  async createAppwriteAccount(email, password, fullName) {
    return await this.account.create(
      ID.unique(),
      email,
      password,
      fullName
    );
  }

  async createAppwriteEmailPasswordSession(email, password) {
    return await this.account.createEmailPasswordSession(
      email,
      password
    );
  }

  createGoogleOAuthSession() {
    const successUrl = `${window.location.origin}/oauth/callback`;
    const failureUrl = `${window.location.origin}/login`;
    // This redirects the browser to Google — no async needed
    this.account.createOAuth2Session(
      OAuthProvider.Google,
      successUrl,
      failureUrl
    );
  }

  async getAppwriteUser() {
    try {
      return await this.account.get();
    } catch {
      return null; // norm
    }
  }

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
