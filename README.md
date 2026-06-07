<img src="https://socialify.git.ci/Thandekaportiap/ShopListApp/image?font=KoHo&language=1&name=1&owner=1&theme=Dark" alt="ShopListApp" width="640" height="320" />

# 🛒 ShopList App

A bold, modern mobile shopping list app built with React Native and Expo. Manage multiple shopping lists, track items by category, set reminders, and never forget what to buy again.

---

## ✨ Features

- 📋 **Multiple Shopping Lists** — Create and manage lists for groceries, household, holidays and more
- ✅ **Item Management** — Add, edit, delete and mark items as purchased
- 🗂️ **Categories & Tags** — Organise items by category (Produce, Dairy, Meat, etc.)
- 🔍 **Search** — Find items and lists instantly across your entire app
- ⏰ **Reminders** — Set optional push notification reminders per list
- 📊 **Progress Tracking** — Visual progress bar showing items purchased per list
- 💾 **Offline Persistence** — All data saved locally with AsyncStorage
- 🌙 **Dark Theme** — Sleek dark UI with bold orange accents

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React Native + Expo | Mobile framework |
| TypeScript | Type safety |
| Redux Toolkit | State management |
| React Navigation | Screen navigation |
| AsyncStorage | Local data persistence |
| Expo Notifications | Push notification reminders |
| Poppins (Google Fonts) | Typography |

---

## 🚀 Getting Started

### Prerequisites

- Node.js v20+
- Expo Go app installed on your Android/iOS device
- npm or yarn

### Installation

Clone the repository:

```bash
git clone https://github.com/Thandekaportiap/ShopListApp.git
```

Navigate to the project folder:

```bash
cd ShopListApp
```

Install dependencies:

```bash
npm install --legacy-peer-deps
```

Start the Expo development server:

```bash
npx expo start
```

Scan the QR code using the **Expo Go** app on your Android or iOS device.

---

## 📱 User Guide

### Managing Lists
- Tap **+ New List** on the Home screen to create a shopping list
- Choose an emoji icon and give your list a name
- Tap any list card to open it and manage items
- Tap 🗑 to delete a list

### Managing Items
- Inside a list tap **+ Add Item** to add a new item
- Fill in the item name, quantity, category and optional notes
- Tap the **checkbox** to mark an item as purchased
- Tap ✏️ to edit an item
- Purchased items move to the bottom with a strikethrough

### Setting Reminders
- Open any list and tap the 🔔 bell icon in the top right
- Pick a date and time for your reminder
- Tap **Set Reminder** — you'll get a push notification at that time
- Tap ⏰ to update or clear an existing reminder
- Reminders are completely **optional**

### Searching
- Tap the **Search** tab at the bottom
- Type any keyword to search across all lists and items
- Results highlight your search term in orange
- Tap any result to jump directly to that list

---

## 📁 Project Structure

```
ShopListApp/
├── App.tsx                   # Root component, navigation & fonts
├── index.ts                  # Expo entry point
├── constants/
│   └── colors.ts             # Color palette & font constants
├── types/
│   └── index.ts              # TypeScript interfaces
├── store/
│   ├── index.ts              # Redux store
│   └── slices/
│       └── listsSlice.ts     # Lists & items state management
├── hooks/
│   ├── useAppDispatch.ts     # Typed Redux hooks
│   ├── usePersistence.ts     # AsyncStorage auto-save/load
│   └── useNotifications.ts  # Push notification helpers
├── screens/
│   ├── HomeScreen.tsx        # All lists + stats
│   ├── SearchScreen.tsx      # Search across lists
│   └── ListDetailScreen.tsx  # Items inside a list
└── components/
    ├── ListCard.tsx          # List preview card
    ├── ItemCard.tsx          # Single item row
    ├── AddListModal.tsx      # Create list bottom sheet
    ├── AddItemModal.tsx      # Add/edit item bottom sheet
    └── ReminderModal.tsx     # Set notification reminder
```

---

## 🎨 Color Palette

| Role | Color | Hex |
|---|---|---|
| Primary | Blaze Orange | `#FF4D00` |
| Background | Midnight Navy | `#1A1A2E` |
| Card | Deep Space | `#16213E` |
| Accent | Electric Cyan | `#00E5FF` |
| Success | Vivid Green | `#00C853` |
| Error | Crimson | `#FF1744` |

---

## 🧪 Running Tests

```bash
npm test
```

---

## 📦 Build for Production

```bash
npx eas build --platform android
```

---

## 🤝 Contributing

Pull requests are welcome. For major changes please open an issue first to discuss what you would like to change.

---

## 👩‍💻 Author

**Thandeka Portia**
- GitHub: [@Thandekaportiap](https://github.com/Thandekaportiap)
- Portfolio: [portfolio-6mbk.vercel.app](https://portfolio-6mbk.vercel.app)
- https://expo.dev/accounts/thandekaportiap/projects/ShopListApp/builds/63aa37a4-5b95-435e-8448-55dafb233290
