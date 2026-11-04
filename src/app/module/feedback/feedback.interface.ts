export interface Feedback {
    id: string;
    complaintId: string;
    authorId: string;
    rating: number;
    comment?: string;
}