
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  image_url?: string;
  user_id: string;
  created_at: string;
  product_type?: 'physical' | 'digital' | 'subscription';
}
