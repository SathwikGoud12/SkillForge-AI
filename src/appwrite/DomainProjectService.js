import { Query } from "appwrite";
import AppwriteTablesDB from "./AppWriteTableDB";
import { DOMAIN_PROJECTS_TABLE_ID } from "../utils/appwrite/constants";

const db = new AppwriteTablesDB();

class DomainProjectService {
    /**
     * Create a new domain project (Admin only)
     * @param {Object} data - Project data
     */
    async createProject(data) {
        const projectData = {
            ...data,
            isActive: true
            // Removed createdAt - attribute doesn't exist in table
        };
        return await db.createRow(DOMAIN_PROJECTS_TABLE_ID, projectData);
    }

    /**
     * Get project by domain ID
     * @param {string} domainId 
     */
    async getProjectByDomain(domainId) {
        try {
            const res = await db.listRows(DOMAIN_PROJECTS_TABLE_ID, [
                Query.equal("domainId", domainId),
                Query.equal("isActive", true)
            ]);

            return res.rows && res.rows.length > 0 ? res.rows[0] : null;
        } catch (error) {
            console.error("Error getting domain project:", error);
            return null;
        }
    }

    /**
     * Get project by ID
     * @param {string} projectId 
     */
    async getProjectById(projectId) {
        try {
            return await db.getRow(DOMAIN_PROJECTS_TABLE_ID, projectId);
        } catch (error) {
            console.error("Error getting project:", error);
            return null;
        }
    }

    /**
     * Get all active projects (Admin)
     */
    async getAllProjects() {
        try {
            const res = await db.listRows(DOMAIN_PROJECTS_TABLE_ID, [
                Query.equal("isActive", true)
                // Removed orderDesc - createdAt doesn't exist
            ]);
            return res.rows || [];
        } catch (error) {
            console.error("Error getting all projects:", error);
            return [];
        }
    }

    /**
     * Update project (Admin only)
     * @param {string} projectId 
     * @param {Object} updates 
     */
    async updateProject(projectId, updates) {
        try {
            return await db.updateRow(DOMAIN_PROJECTS_TABLE_ID, projectId, updates);
        } catch (error) {
            console.error("Error updating project:", error);
            throw error;
        }
    }

    /**
     * Soft delete project (Admin only)
     * @param {string} projectId 
     */
    async deleteProject(projectId) {
        try {
            return await db.updateRow(DOMAIN_PROJECTS_TABLE_ID, projectId, {
                isActive: false
            });
        } catch (error) {
            console.error("Error deleting project:", error);
            throw error;
        }
    }

    /**
     * Parse requirements from JSON string
     * @param {string} requirementsJson 
     */
    parseRequirements(requirementsJson) {
        try {
            return JSON.parse(requirementsJson || "[]");
        } catch (error) {
            console.error("Error parsing requirements:", error);
            return [];
        }
    }
}

export default DomainProjectService;
