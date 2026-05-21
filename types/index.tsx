export interface Item {
  id: string;
  name: string;
  quantity: string;
  category: string;
  notes?: string;
  purchased: boolean;
  createdAt: string;
}

export interface ShoppingList {
  id: string;
  name: string;
  emoji: string;
  items: Item[];
  createdAt: string;
}

export type RootState = {
  lists: ShoppingList[];
};