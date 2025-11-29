export interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  image: string;
  category: 'luxury' | 'daily' | 'stuffed';
}

export interface CartItem extends Product {
  quantity: number;
}

export interface RecipeRequest {
  dateType: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface RecipeResponse {
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  prepTime: string;
}

export interface DeliveryRates {
  cairo: number;
  giza: number;
  october: number;
  haram: number;
  rehab: number;
  madinaty: number;
  ismailia: number;
  alex: number;
  tanta: number;
  mansoura: number;
  others: number;
}

export interface StoreSettings {
  deliveryRates: DeliveryRates;
  discountPercentage: number; // 0 to 100
  isDiscountActive: boolean;
}