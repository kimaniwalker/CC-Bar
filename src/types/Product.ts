export type Product = {
  id: string;
  sku: string;
  name: string;
  description: string;
  price: number;
  on_sale: boolean;
  sale_price?: number;
  stock: number;
  tags?: string[];
  brand?: string;
  shippingInformation?: string;
  returnPolicy?: "30 days return policy" | "no returns";
  type?: ProductType;
  thumbnail: string;
  images?: string[];
};

//product_id uuid not null references products(id)
export type ProductOptionGroups = {
  id: string;
  product_id: string;
  name: string;
  selection_type: "single" | "multiple";
  display_order: number;
  created_at: string;
  max_selections?: number;
};

//option_group_id uuid not null references product_option_groups(id)
export type ProductOptions = {
  id: string;
  option_group_id: string;
  name: string;
  price_adjustment: number;
  display_order: number;
  dimensions?: {
    width: string;
    height: string;
    weight: string;
  };
  active: boolean;
  created_at: string;
};

//product_id uuid not null references products(id)
//ingredient_id uuid not null references ingredients(id)
export type ProductIngredients = {
  product_id: string;
  ingredient_id: string;
  required: boolean;
};

export type ProductWithOptions = Product & {
  product_option_groups: (ProductOptionGroups & {
    product_options: ProductOptions[];
  })[];
};

type SelectedOption = {
  groupId: string;
  groupName: string;
  optionId: string | string[];
  optionName: string | string[];
  priceAdjustment: number;
};

export type CartProduct = Product & {
  quantity: number;
  selected_options?: Record<string, SelectedOption>;
  product_option_groups?: (ProductOptionGroups & {
    product_options: ProductOptions[];
  })[];
  custom_message?: string;
};

export enum ProductAvailabilityStatus {
  IN_STOCK = "In Stock",
  OUT_OF_STOCK = "Out Of Stock",
  PRE_ORDER = "Pre-order",
  LOW_STOCK = "⚠️ Limited stock",
  SELLING_FAST = "🔥 Selling fast",
}

export type StockError = {
  key: string; // Changed from sku to key (unique cart key)
  availableStock: number;
  errorMessage: string;
  isDbError?: boolean;
};

export enum ProductType {
  EXPERIENCE = "experience",
  EXPERIENCE_ADD_ON = "experience_add_on",
  SNACKS_AND_DRINKS = "snacks_and_drinks",
  MERCHANDISE = "merchandise",
  CANDLE = "candle",
  ESSENTIAL_OIL = "essential_oil",
  SOAP = "soap",
  LOTION = "lotion",
  BODY_SCRUB = "body_scrub",
  BODY_BUTTER = "body_butter",
  BODY_OIL = "body_oil",
  BATH_SALT = "bath_salt",
  BATH_BOMB = "bath_bomb",
  HAIR_CARE = "hair_care",
  SKIN_CARE = "skin_care",
  LIP_CARE = "lip_care",
  PERFUME = "perfume",
  DIFFUSER = "diffuser",
  ROOM_SPRAY = "room_spray",
  GIFT_SET = "gift_set",
  OTHER = "other",
}
