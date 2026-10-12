export interface Recipe {
  id: number;
  name: string;
  description: string;
  instructions: string;
  imageUrl: string | null;
  servings: number;
  categoryIds: number[];
  authorId: number;
  statusId: number;
  totalCalories: number;
  caloriesPerServing: number;
  createdAt: string;
  updatedAt: string;
  status: string;
  publishedAt: string | null;
  reviewedAt: string | null;
  reviewedBy: number | null;
}
