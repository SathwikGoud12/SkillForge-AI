import { Query } from "appwrite";
import AppwriteTablesDB from "./AppWriteTableDB";
import { CERTIFICATES_TABLE_ID } from "../utils/appwrite/constants";

const db = new AppwriteTablesDB();

class CertificateService {
    /**
     * Generate certificate ID
     * Format: SF-CERT-{YEAR}-{SEQUENTIAL}
     */
    async generateCertificateId() {
        const year = new Date().getFullYear();

        try {
            // Get count of certificates this year
            const res = await db.listRows(CERTIFICATES_TABLE_ID, [
                Query.contains("certificateId", `SF-CERT-${year}`)
            ]);

            const count = res.total || 0;
            const nextNumber = count + 1;
            const paddedNumber = String(nextNumber).padStart(6, '0');

            return `SF-CERT-${year}-${paddedNumber}`;
        } catch (error) {
            // If table is empty or error, start from 1
            return `SF-CERT-${year}-000001`;
        }
    }

    /**
     * Create a certificate for a verified domain
     * @param {Object} data - Certificate data
     */
    async createCertificate(data) {
        try {
            // Check if certificate already exists
            const existing = await this.getUserCertificateForDomain(data.userId, data.domainId);

            if (existing) {
                console.log("Certificate already exists for this domain");
                return existing;
            }

            // Generate certificate ID
            const certificateId = await this.generateCertificateId();

            const certificateData = {
                ...data,
                certificateId,
                issuedAt: new Date().toISOString(),
                status: "active"
            };

            return await db.createRow(CERTIFICATES_TABLE_ID, certificateData);
        } catch (error) {
            console.error("Error creating certificate:", error);
            throw error;
        }
    }

    /**
     * Get user's certificate for a specific domain
     * @param {string} userId 
     * @param {string} domainId 
     */
    async getUserCertificateForDomain(userId, domainId) {
        try {
            const res = await db.listRows(CERTIFICATES_TABLE_ID, [
                Query.equal("userId", userId),
                Query.equal("domainId", domainId),
                Query.equal("status", "active")
            ]);

            return res.rows && res.rows.length > 0 ? res.rows[0] : null;
        } catch (error) {
            console.error("Error getting certificate:", error);
            return null;
        }
    }

    /**
     * Get all certificates for a user
     * @param {string} userId 
     */
    async getUserCertificates(userId) {
        try {
            const res = await db.listRows(CERTIFICATES_TABLE_ID, [
                Query.equal("userId", userId),
                Query.equal("status", "active"),
                Query.orderDesc("issuedAt")
            ]);

            return res.rows || [];
        } catch (error) {
            console.error("Error getting user certificates:", error);
            return [];
        }
    }

    /**
     * Get certificate by ID
     * @param {string} certificateId 
     */
    async getCertificateById(certificateId) {
        try {
            const res = await db.listRows(CERTIFICATES_TABLE_ID, [
                Query.equal("certificateId", certificateId)
            ]);

            return res.rows && res.rows.length > 0 ? res.rows[0] : null;
        } catch (error) {
            console.error("Error getting certificate by ID:", error);
            return null;
        }
    }

    /**
     * Verify certificate exists
     * @param {string} certificateId 
     */
    async verifyCertificate(certificateId) {
        const certificate = await this.getCertificateById(certificateId);
        return certificate && certificate.status === "active";
    }

    /**
     * Revoke a certificate (Admin only)
     * @param {string} certificateId 
     */
    async revokeCertificate(certificateId) {
        try {
            const certificate = await this.getCertificateById(certificateId);

            if (!certificate) {
                throw new Error("Certificate not found");
            }

            return await db.updateRow(CERTIFICATES_TABLE_ID, certificate.$id, {
                status: "revoked"
            });
        } catch (error) {
            console.error("Error revoking certificate:", error);
            throw error;
        }
    }

    /**
     * Get certificate statistics
     * @param {string} userId 
     */
    async getCertificateStats(userId) {
        try {
            const certificates = await this.getUserCertificates(userId);

            return {
                total: certificates.length,
                active: certificates.filter(c => c.status === "active").length,
                domains: [...new Set(certificates.map(c => c.domainName))]
            };
        } catch (error) {
            console.error("Error getting certificate stats:", error);
            return { total: 0, active: 0, domains: [] };
        }
    }

    /**
     * Format certificate date for display
     * @param {string} isoDate 
     */
    formatCertificateDate(isoDate) {
        const date = new Date(isoDate);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
}

export default CertificateService;
