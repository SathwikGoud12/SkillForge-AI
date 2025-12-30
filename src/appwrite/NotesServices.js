import { Query } from "appwrite";
import { APPWRITE_TOPIC_NOTES_TABLE_ID } from "../utils/appwrite/constants";
import AppwriteTablesDB from "./AppWriteTableDB";

const db = new AppwriteTablesDB();

class NotesServices {

  async createNote(data) {
    return db.createRow(
      APPWRITE_TOPIC_NOTES_TABLE_ID,
      data
    );
  }

  // ✅ Notes inside a topic
  async noteListRows(topicId) {
    return db.listRows(
      APPWRITE_TOPIC_NOTES_TABLE_ID,
      [Query.equal("topicId", topicId)]
    );
  }

  // ✅ Admin usage
  async getAllNotes() {
    return db.listRows(APPWRITE_TOPIC_NOTES_TABLE_ID);
  }
}

export default NotesServices;
