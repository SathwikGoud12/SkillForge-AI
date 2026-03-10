import { Client, TablesDB, ID } from "appwrite";

const client = new Client()
    .setEndpoint("https://sgp.cloud.appwrite.io/v1")
    .setProject("69394df8000409a8bb82");

const db = new TablesDB(client);
const DB_ID = "69455c25002afee245db";

async function test() {
    try {
        const row = await db.createRow({
            databaseId: DB_ID,
            tableId: "topics",
            rowId: ID.unique(),
            data: {
                title: "TEST - Delete Me",
                description: "SDK test",
                domainId: "6946553b0021f29ad5f6",
                order: 99,
                isActive: true,
            },
        });
        console.log("✅ SDK works! Row ID:", row.$id);
    } catch (e) {
        console.error("❌ Error:", e.message, e.code);
    }
}

test();
