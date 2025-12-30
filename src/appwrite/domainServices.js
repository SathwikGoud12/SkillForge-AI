import AppwriteTablesDB from "./AppWriteTableDB";

const appwrite = new AppwriteTablesDB();

class DomainService {
  uploadDomainImage(file) {
    return appwrite.uploadFile(file);
  }

  createDomain(data) {
    return appwrite.createRow(
      import.meta.env.VITE_APPWRITE_Domains_TABLE_ID,
      data
    );
  }

  getAllDomains() {
    return appwrite.listRows(
      import.meta.env.VITE_APPWRITE_Domains_TABLE_ID
    );
  }

  getDomainById(id) {
    return appwrite.getRow(
      import.meta.env.VITE_APPWRITE_Domains_TABLE_ID,
      id
    );
  }

  updateDomain(id, data) {
    return appwrite.updateRow(
      import.meta.env.VITE_APPWRITE_Domains_TABLE_ID,
      id,
      data
    );
  }

  getImagePreview(imageId) {
    return appwrite.getFilePreview(imageId);
  }
}

export default DomainService;
