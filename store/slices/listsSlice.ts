import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ShoppingList, Item } from '../../types';

const initialState: ShoppingList[] = [];

const listsSlice = createSlice({
  name: 'lists',
  initialState,
  reducers: {
    // List actions
    addList: (state, action: PayloadAction<ShoppingList>) => {
      state.push(action.payload);
    },
    deleteList: (state, action: PayloadAction<string>) => {
      return state.filter(list => list.id !== action.payload);
    },
    editList: (state, action: PayloadAction<{ id: string; name: string; emoji: string }>) => {
      const list = state.find(l => l.id === action.payload.id);
      if (list) {
        list.name = action.payload.name;
        list.emoji = action.payload.emoji;
      }
    },

    // Item actions
    addItem: (state, action: PayloadAction<{ listId: string; item: Item }>) => {
      const list = state.find(l => l.id === action.payload.listId);
      if (list) list.items.push(action.payload.item);
    },
    deleteItem: (state, action: PayloadAction<{ listId: string; itemId: string }>) => {
      const list = state.find(l => l.id === action.payload.listId);
      if (list) list.items = list.items.filter(i => i.id !== action.payload.itemId);
    },
    editItem: (state, action: PayloadAction<{ listId: string; item: Item }>) => {
      const list = state.find(l => l.id === action.payload.listId);
      if (list) {
        const index = list.items.findIndex(i => i.id === action.payload.item.id);
        if (index !== -1) list.items[index] = action.payload.item;
      }
    },
    togglePurchased: (state, action: PayloadAction<{ listId: string; itemId: string }>) => {
      const list = state.find(l => l.id === action.payload.listId);
      const item = list?.items.find(i => i.id === action.payload.itemId);
      if (item) item.purchased = !item.purchased;
    },

    // Persistence
    loadLists: (_, action: PayloadAction<ShoppingList[]>) => {
      return action.payload;
    },

    // Add inside reducers
setReminder: (state, action: PayloadAction<{
  id: string;
  notificationId: string;
  date: string;
}>) => {
  const list = state.find(l => l.id === action.payload.id);
  if (list) {
    list.reminder = {
      notificationId: action.payload.notificationId,
      date: action.payload.date,
    };
  }
},
clearReminder: (state, action: PayloadAction<string>) => {
  const list = state.find(l => l.id === action.payload);
  if (list) delete list.reminder;
},
  },
});

export const {
  addList, deleteList, editList,
  addItem, deleteItem, editItem,
  togglePurchased, loadLists,
  setReminder, clearReminder,
} = listsSlice.actions;

export default listsSlice.reducer;