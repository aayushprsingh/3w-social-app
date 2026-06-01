# 3W Business Full Stack Internship Assignment - Mini Social Post App

This is a premium, high-performance, and responsive full-stack **Mini Social Post Application** built from scratch. It is inspired by the design and layout of the **TaskPlanet** Android application's social feed, fulfilling all assignment parameters.

## 🌟 Visual Inspiration & UI Accuracy (TaskPlanet Screenshots Match)
Every detail from the provided application screenshots has been carefully replicated:
1. **The Header Strip**: Contains the "Social" text logo on the left, and standard TaskPlanet stats on the right: the `56 Star` coin pill, `₹0.00` active balance pill, and the red dot notification bell.
2. **Sub-navbar**: Features a rounded search bar ("Search promotions, users, posts..."), a fully functional **Light/Dark Mode toggle** (updates local style sheets instantly), and user avatars.
3. **The Pinned Post Accent**: If a post is created by a promotional user (e.g. `Nitin Pandey`), it renders with the **distinctive golden border**, a pin badge in the top right, a verification check mark next to their name, and a gold `🪙 Post & Earn` points tag—exactly like Nitin's post in the Play Store screenshot!
4. **Subheader Filter Strip**: Features a scrolling pill selector with options: "All Post" (active blue pill), "For You", "Most Liked", "Most Commented", and "Most Shared".
5. **Feed Card Actions**: Action indicators for Likes (renders active counts and toggles red on tap), Comments (opens/collapses comment drawers), and Shares (renders custom counts).
6. **Mobile Aspect Ratio**: Center-aligned layout with mobile aspect max-width (500px) that behaves exactly like an Android screen on web, while scaling beautifully to all viewports.
7. **App Bottom Navigation Bar**: Sticky bottom nav bar showing: Home, Tasks, Social (active globe icon centered inside active blue tab), Leader Board, and Chat.

---

## 🛠️ Architecture & Database Constraints
* **Strict 2-Collection MongoDB Rule**: To comply with the constraints, the app utilizes only two MongoDB collections:
  1. `users` (credentials and password hashing)
  2. `posts` (contains the author, text, image, an array of liked usernames, and a nested sub-document array of comments).
* **Self-Contained Image Handling**: Post images support standard URL paths or standard **Base64 string conversion** directly in the browser! This allows you to attach and view images instantly without setting up AWS S3 or Cloudinary accounts.
* **Instant UI updates**: Built-in optimistic state updating handles likes and comments instantly in the React viewport before database callbacks complete.
* **Database Auto-Seeder**: On initial database connection, if the posts collection is empty, a seeder script **automatically seeds the exact mock posts from the Play Store screenshots** (Nitin Pandey'spinned post, Md Mustaquiem's post, and Sudhan Kumar's leaderboard post)! This guarantees that the feed is populated and beautiful from the very first launch.

---

## 📁 File Structure
```
Companies/3W/
├── backend/
│   ├── middleware/
│   │   └── auth.js         # JWT verification middleware
│   ├── models/
│   │   ├── User.js         # Mongoose User Schema (hashing hooks)
│   │   └── Post.js         # Mongoose Post Schema (embedded comments/likes)
│   ├── routes/
│   │   ├── auth.js         # signup, login, session checker routes
│   │   └── posts.js        # create post, fetch feed, toggle like, comment
│   ├── utils/
│   │   └── seeder.js       # Auto-seeds TaskPlanet posts
│   ├── .env.example
│   ├── .env                # Local environmental variables
│   ├── server.js           # Server setup & DB connection
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── BottomNav.jsx
│   │   │   ├── CreatePost.jsx
│   │   │   ├── Navbar.jsx
│   │   │   └── PostCard.jsx
│   │   ├── pages/
│   │   │   ├── Feed.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── App.jsx         # App router and session controller
│   │   ├── index.css       # Premium custom stylesheet (No Tailwind)
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js      # Proxy server forwarding /api to backend
│   └── package.json
└── README.md
```

---

## 🚀 How to Run Locally

### Prerequisites
1. **Node.js** (v16 or higher recommended)
2. **MongoDB** running locally on port `27017` (e.g. `mongodb://localhost:27017`), or a MongoDB Atlas URI string.

### Step 1: Run the Backend
1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server (runs on `http://localhost:5000` by default):
   ```bash
   npm run dev
   ```
   *The console will print `MongoDB Connected Successfully` and `TaskPlanet mock data auto-seeded successfully!`.*

### Step 2: Run the Frontend
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite dev server (runs on `http://localhost:3000`):
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to `http://localhost:3000`.

---

## 📈 Verification Checklist
- [x] **Registration & Login**: Sign up a new account. Try overlapping names to test validation.
- [x] **Light/Dark Toggle**: Click the moon/sun icon in the search bar header to watch the theme transition fluidly.
- [x] **Feed Scroll**: Check out the populated mock posts from the seeder.
- [x] **Like Post**: Tap the heart button. Watch it optimistic-increment immediately and turn red.
- [x] **Post Comment**: Tap the speech bubble button to slide open the comments drawer. Type a comment, hit send, and see it populate instantly.
- [x] **Create Post**: Type a message or upload an image, and click "Post" to see your new update slide into the top of the feed list.
