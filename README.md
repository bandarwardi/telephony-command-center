# Telephony Command Center

Please build a modern, high-performance, and fully responsive Admin Panel for a Telecommunications & Area Code Lookup platform. 

The tech stack should be React (Vite) with Tailwind CSS and Shadcn UI (or Lucide Icons). 

The backend must be Firebase (Firebase Auth for authentication and Firestore for the database).

## Core Requirements & Setup:

1. Firebase Integration: Set up a Firebase connection file (e.g., `firebase.js`). Include Firebase Authentication (Email/Password login) to protect the entire admin panel. Unauthorized users should be redirected to a `/login` page.

2. Layout & UI: Create a clean dashboard layout with a sidebar navigation menu (Dashboard, Area Codes, Blog/Articles, FAQs, Site Settings) and a top header (showing the logged-in admin email and a logout button). Use a sleek Dark/Light mode theme.

## Required Modules & Firestore Collections:

1. Dashboard (Overview)

- Display mock statistics cards (Total Area Codes, Total Articles, Total Lookups, Active Users).

- Display a recent activity table or chart.

2. Area Codes Management (Firestore Collection: `areaCodes`)

- A data table displaying area codes with columns: Code, City, State, Country, Timezone, and Status (Safe/Scam).

- Add/Edit/Delete functionality with a form containing:

  - Code (e.g., 212)

  - Region/City (e.g., New York City)

  - State (e.g., NY)

  - Country (US/Canada)

  - Timezone (e.g., Eastern (EDT))

  - Carrier information

  - isScam (Boolean toggle for highlighting high-risk Caribbean/Wangiri numbers).

3. Blog & Content Management (Firestore Collection: `articles`)

- A data table displaying articles with columns: Title, Author, Date, and Status (Published/Draft).

- Add/Edit/Delete functionality.

- The Add/Edit form should include: Title, Slug, Excerpt, Author, Tags (comma separated), Status (Draft/Published), and a rich text area (or markdown textarea) for Content.

4. FAQ Management (Firestore Collection: `faqs`)

- A drag-and-drop or simple list of FAQs.

- Add/Edit/Delete functionality with fields: Question, Answer (textarea), and Order number.

5. Site Settings (Firestore Collection: `settings`, Document: `global`)

- A form to update static company info without deploying code.

- Fields: Company Name, Support Email, Phone Number, Business Hours, Headquarters Address, and Social Media links (Twitter, LinkedIn).

- Save button to update the single `global` document in Firestore.

## Developer Instructions:

- Provide all the necessary React components, routing (using React Router), and Firebase logic (CRUD operations).

- Make sure the UI looks premium, using glassmorphism effects or clean borders.

- Include state management for loading states (spinners) and success/error toasts when interacting with Firestore.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/318ef3bb-29f1-4a42-b7c3-3ea30f5221fe).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
