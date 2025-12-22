import { TablesDB, ID } from "appwrite"
import appwriteClient from "."
import { APPWRITE_DB_ID } from "../utils/appwrite/constants";
class AppwriteTablesDB {
    constructor() {
        this.tablesDb = new TablesDB(appwriteClient)
    }

    async createRow(tablesId, data) {
        try {
            const result = await this.tablesDb.createRow({
                databaseId: APPWRITE_DB_ID,
                tableId: tablesId,
                rowId: ID.unique(),
                data: data
            });

            return result
        } catch (error) {
            console.error(error)
            throw new Error(error.message)
        }
    }
}

export default AppwriteTablesDB;