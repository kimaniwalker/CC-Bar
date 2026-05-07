export interface ProductReview {
    id: number;
    product_id: number;
    rating: 1 | 2 | 3 | 4 | 5;
    comment: string;
    name: string;
    email?: string;
    created_at: string;
}

export interface ProductReviewFormInputs {
    rating: 1 | 2 | 3 | 4 | 5;
    comment: string;
    name: string;
    email?: string;
    product_id: number;
  }