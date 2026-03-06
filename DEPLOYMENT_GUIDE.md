# SISIMA GROUP — Deployment & Hosting Guide
## Firebase + sisimagroups.com

---

## OVERVIEW

| What | Where | Cost |
|------|-------|------|
| Website hosting | Firebase Hosting | Free |
| Car database | Firebase Firestore | Free |
| Admin login | Firebase Authentication | Free |
| Domain name | Namecheap | ~$12/year |
| Total | | ~$12/year |

---

## PART 1 — BUY YOUR DOMAIN

1. Go to **https://www.namecheap.com**
2. Search for `sisimagroups.com`
3. Add to cart and complete purchase (~$10–14)
4. You don't need to set anything up yet — just own it

---

## PART 2 — SET UP FIREBASE (30 minutes, free)

### 2.1 Create a Firebase Project

1. Go to **https://console.firebase.google.com**
2. Sign in with a Google account (create one if needed — use a business email like `sisimagroup@gmail.com`)
3. Click **"Add project"**
4. Name it: `sisima-group`
5. Disable Google Analytics (not needed) → Click **"Create project"**

---

### 2.2 Enable Firebase Storage (for photo uploads)

1. In the left menu click **"Storage"**
2. Click **"Get started"**
3. Choose **"Start in production mode"** → Next → Done
4. Click the **"Rules"** tab and replace with:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /cars/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

5. Click **"Publish"**

---

### 2.3 Create the Firestore Database

1. In your project dashboard, click **"Firestore Database"** in the left menu
2. Click **"Create database"**
3. Choose **"Start in production mode"** → Next
4. Select region: **`eur3 (europe-west)`** or **`us-central`** → Click **"Enable"**

**Set security rules** (allows anyone to READ, only authenticated admin to WRITE):

1. Click the **"Rules"** tab in Firestore
2. Replace everything with this:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /cars/{carId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

3. Click **"Publish"**

---

### 2.4 Set Up Admin Login

1. In the left menu click **"Authentication"**
2. Click **"Get started"**
3. Under "Sign-in method", click **"Email/Password"** → Enable it → Save
4. Click the **"Users"** tab → **"Add user"**
5. Enter:
   - Email: `admin@sisimagroups.com` (or any email you want)
   - Password: choose a strong password (min 8 characters)
6. Click **"Add user"**

> ⚠️ **Keep this email and password safe** — this is how you log in to the admin panel

---

### 2.5 Register Your Web App & Get Config

1. Click the **gear icon** (⚙️) → **"Project settings"**
2. Scroll down to **"Your apps"** → click the **Web icon** (`</>`)
3. App nickname: `sisima-website` → Click **"Register app"**
4. You will see a `firebaseConfig` object like this:

```js
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "sisima-group.firebaseapp.com",
  projectId: "sisima-group",
  storageBucket: "sisima-group.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdefabcdefabcdef"
};
```

5. **Copy these values** — you need to paste them in TWO files:

---

## PART 3 — PASTE YOUR FIREBASE CONFIG INTO THE CODE

Open these two files in your code editor (VS Code etc.) and paste your values:

### File 1: `index.html`
Search for `PASTE_YOUR_API_KEY_HERE` near the bottom of the file.
Replace the entire firebaseConfig block with your real values.

### File 2: `admin.html`
Search for `PASTE_YOUR_API_KEY_HERE` in the `<script type="module">` block.
Replace the entire firebaseConfig block with your real values.

> Do this for ALL six fields: apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId

---

## PART 4 — UPLOAD YOUR EXISTING CARS TO FIRESTORE

Before deploying, seed your database with the 5 cars you already have:

1. In Firebase Console → **Firestore Database** → **"+ Start collection"**
2. Collection ID: `cars` → Next
3. For each car, click **"+ Add document"** (leave Document ID as auto-generated)
4. Add these fields for each car:

| Field | Type | Example |
|-------|------|---------|
| name | string | Toyota Alphard |
| category | string | van |
| status | string | available |
| year | string | 2006 |
| fuel | string | Petrol |
| transmission | string | Auto |
| mileage | string | Low KM |
| color | string | White |
| location | string | Nakonde |
| description | string | Spacious Toyota Alphard... |
| image | string | images/cars/Toyota Alphard.jpg |
| whatsapp_msg | string | Hello SISIMA GROUP, I am interested in the Toyota Alphard. |

Repeat for all 5 cars: BMW 3 Series, Mitsubishi Canter, Honda Fit, Lexus IS 250, Toyota Alphard.

> After this, you won't need to manually add to Firestore again — use the admin panel instead.

---

## PART 5 — DEPLOY TO FIREBASE HOSTING

### 5.1 Install Firebase CLI

You need Node.js installed. Download from https://nodejs.org (LTS version).

Then open a terminal/command prompt and run:
```
npm install -g firebase-tools
```

### 5.2 Login & Initialize

In your terminal, navigate to your project folder:
```
cd "D:\SCHOOL STUFFS\PROJECTS\SisimaGroups"
```

Login to Firebase:
```
firebase login
```
(Opens a browser window — sign in with the same Google account)

Initialize Firebase Hosting:
```
firebase init hosting
```

Answer the prompts:
- **Which project?** → Select `sisima-group`
- **Public directory?** → Type `.` (a single dot — your files are in the root)
- **Single-page app?** → `N`
- **Overwrite index.html?** → `N`

### 5.3 Deploy

```
firebase deploy
```

Your site goes live at:
`https://sisima-group.web.app`

---

## PART 6 — CONNECT sisimagroups.com

1. In Firebase Console → **Hosting** → **"Add custom domain"**
2. Enter: `sisimagroups.com`
3. Firebase shows you two DNS records to add (TXT and A records)
4. Go to **Namecheap** → **Domain List** → **Manage** → **Advanced DNS**
5. Add the records Firebase gave you
6. Also add:
   - Type: **A Record**, Host: `www`, Value: Firebase IP
   - Type: **CNAME**, Host: `www`, Value: `sisima-group.web.app`
7. Wait 15–60 minutes for DNS to propagate
8. Firebase auto-generates a free SSL certificate (HTTPS)

Your site is now live at `https://sisimagroups.com` ✅

---

## PART 7 — HOW TO UPDATE STOCK GOING FORWARD

### Add a new car:
1. Go to `https://sisimagroups.com/admin.html`
2. Log in with your admin email and password
3. Click **"Add New Car"**
4. Fill in the details
5. For the image: place the photo in the `images/cars/` folder, then run `firebase deploy` to upload it, then put the path in the image field
6. Click **"Save to Database"** — it appears on the website instantly

### Mark a car as sold:
1. Open admin panel
2. Find the car → click **"Toggle Status"** until it shows 🔴 Sold
3. It disappears from the public site immediately — no redeploy needed

### Update text/design changes:
Any changes to HTML, CSS or JS files require rerunning:
```
firebase deploy
```

---

## QUICK REFERENCE

| Task | How |
|------|-----|
| View admin panel | sisimagroups.com/admin.html |
| Add/remove cars | Admin panel (no coding) |
| Update car photos | Add to images/cars/ folder → firebase deploy |
| Update site design | Edit files → firebase deploy |
| Check Firebase console | console.firebase.google.com |
| Admin login email | (the one you set in Step 2.3) |

---

## ESTIMATED COSTS SUMMARY

| Item | Provider | Cost |
|------|----------|------|
| sisimagroups.com domain | Namecheap | ~$12/year |
| Website hosting | Firebase (free tier) | $0 |
| Database (Firestore) | Firebase (free tier) | $0 |
| SSL certificate (HTTPS) | Firebase (included) | $0 |
| Admin authentication | Firebase (free tier) | $0 |
| **Total** | | **~$12/year** |

The Firebase free tier allows 50,000 database reads and 20,000 writes per day —
far more than a car dealership site will ever use.

---

*Guide prepared for SISIMA GROUP ZAMBIA LIMITED*
*TM Technologies*
