
import { APPWRITE_DB_ID, SUBJECT_PDFS_TABLE_ID } from "@/utils/appwrite/constants";
import { Query } from "appwrite";
import { databases } from "../lib/appwrite";
class StudyMaterialsService {
    /**
     * Get all subjects filtered by year, branch, and semester
     */
    async getSubjects(year, branch, semester) {
        try {
            const queries = [];

            if (year) queries.push(Query.equal("Year", year));
            if (branch) queries.push(Query.equal("Branch", branch));
            if (semester) queries.push(Query.equal("Semester", semester));

            const response = await databases.listDocuments(
                APPWRITE_DB_ID,
                SUBJECT_PDFS_TABLE_ID,
                queries
            );

            return response.documents;
        } catch (error) {
            console.error("Error fetching subjects:", error);
            throw error;
        }
    }

    /**
     * Get a single subject by ID
     */
    async getSubjectById(subjectId) {
        try {
            const response = await databases.getDocument(
                APPWRITE_DB_ID,
                SUBJECT_PDFS_TABLE_ID,
                subjectId
            );
            return response;
        } catch (error) {
            console.error("Error fetching subject:", error);
            throw error;
        }
    }

    /**
     * Create a new subject (Admin only)
     */
    async createSubject(subjectData) {
        try {
            const response = await databases.createDocument(
                APPWRITE_DB_ID,
                SUBJECT_PDFS_TABLE_ID,
                "unique()",
                subjectData
            );
            return response;
        } catch (error) {
            console.error("Error creating subject:", error);
            throw error;
        }
    }

    /**
     * Update a subject (Admin only)
     */
    async updateSubject(subjectId, subjectData) {
        try {
            const response = await databases.updateDocument(
                APPWRITE_DB_ID,
                SUBJECT_PDFS_TABLE_ID,
                subjectId,
                subjectData
            );
            return response;
        } catch (error) {
            console.error("Error updating subject:", error);
            throw error;
        }
    }

    /**
     * Delete a subject (Admin only)
     */
    async deleteSubject(subjectId) {
        try {
            await databases.deleteDocument(
                APPWRITE_DB_ID,
                SUBJECT_PDFS_TABLE_ID,
                subjectId
            );
            return { success: true };
        } catch (error) {
            console.error("Error deleting subject:", error);
            throw error;
        }
    }

    /**
     * Get all unique years
     */
    async getYears() {
        try {
            const response = await databases.listDocuments(
                APPWRITE_DB_ID,
                SUBJECT_PDFS_TABLE_ID
            );

            const years = [...new Set(response.documents.map(doc => doc.Year))];
            return years.filter(Boolean).sort();
        } catch (error) {
            console.error("Error fetching years:", error);
            throw error;
        }
    }

    /**
     * Get all unique branches for a year
     */
    async getBranches(year) {
        try {
            const queries = year ? [Query.equal("Year", year)] : [];

            const response = await databases.listDocuments(
                APPWRITE_DB_ID,
                SUBJECT_PDFS_TABLE_ID,
                queries
            );

            const branches = [...new Set(response.documents.map(doc => doc.Branch))];
            return branches.filter(Boolean).sort();
        } catch (error) {
            console.error("Error fetching branches:", error);
            throw error;
        }
    }

    /**
     * Get all unique semesters for a year and branch
     */
    async getSemesters(year, branch) {
        try {
            const queries = [];
            if (year) queries.push(Query.equal("Year", year));
            if (branch) queries.push(Query.equal("Branch", branch));

            const response = await databases.listDocuments(
                APPWRITE_DB_ID,
                SUBJECT_PDFS_TABLE_ID,
                queries
            );

            const semesters = [...new Set(response.documents.map(doc => doc.Semester))];
            return semesters.filter(Boolean).sort();
        } catch (error) {
            console.error("Error fetching semesters:", error);
            throw error;
        }
    }
}

export default StudyMaterialsService;
