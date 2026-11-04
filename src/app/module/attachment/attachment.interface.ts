export interface Attachment {
  id: string;
  complaintId: string;
  uploadedById: string;
  type: string;
  filePublicId: string;
  fileUrl: string;
  fileSize?: number;
}
