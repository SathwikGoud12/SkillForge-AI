import { Client, Account, Databases, Functions, Storage } from "appwrite";
const client = new Client()
  .setEndpoint("https://sgp.cloud.appwrite.io/v1")
  .setProject("69394df8000409a8bb82");

export const account = new Account(client);
export const databases = new Databases(client);
export const functions = new Functions(client);
export const storage = new Storage(client);

export default client;
