import { Client } from "appwrite";

const appwriteClient = new Client()
    .setEndpoint("https://sgp.cloud.appwrite.io/v1")
    .setProject("69394df8000409a8bb82");

export default appwriteClient;