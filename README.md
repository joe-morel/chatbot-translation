## Chatbot Translation Web App
<img width="600" alt="chatbot-github-cover" src="https://github.com/user-attachments/assets/1550525a-e967-428f-a997-ead6c6bd1cb7">

This project is a real-time language translation chatbot designed to facilitate 
multilingual communication through a chat interface. Users can send messages in 
one language and receive instant translations in another language.

#### **Main Features:**
- **Chat Interface:** Allows users to send and receive messages.
- **Language Selection:** Users can choose source and target languages.
- **Real-Time Translation:** Messages are translated and displayed instantly.
- **Session Management:** User language preferences and chat sessions are stored.
- **API Integration:** Utilizes  `Google Translate API` to handle translations  and  `Supabase API` to store chat messsage history.

You can try this app deployed on Vercel here https://chatbot-translation.vercel.app

#### **Requirements:**
- Node.js (v14 or higher)
- npm or yarn
- An API key from `Google Translate`
- An API key from `Supabase Database`

## Getting Started

1. Clone the repository:

   ```shell
   git clone https://github.com/joe-morel/chatbot-translation
   ```
2. Install dependencies:

   ```shell
   npm install
   #or
   yarn install
   ```
3. Set up environment variables:

   Create a `.env.example` file in the project root with the following parameters:

   ```shell
   NEXT_PUBLIC_GOOGLE_TRANSLATE_API_KEY=YOUR_API_KEY

   NEXT_PUBLIC_SUPABASE_URL=YOUR_PROJECT_URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_API_KEY
   ```

4. Run the development server:

   ```bash
   npm run dev
   #or
   yarn dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

#### **Usage:**
- Select the source and target languages in the interface.
- Send a message in your preferred language.
- Receive the translation in the target language in real-time.

#### **Project Architecture:**

- **Frontend:**
  - Library: React.js with Next.js
  - UI Component Library: shadcn/ui
  - State Management: useState for local component state management
  - Styling: Tailwind CSS
  - Real-Time Communication: HTTP requests to Node.js backend

- **Backend:**
  - Framework: Node.js with Next.js
  - Translation API: Google Translate API 
  - Database: Supabase for storing user sessions and chat history.

#### **System Architecture:**
- The user selects languages in the frontend.
- The message is sent to the backend, where it is translated using the translation API.
- The translated message is returned to the frontend and displayed in the interface.

#### **API Keys:**
To obtain a the APIs key:
1. [Guide to get a Google Translate API key](https://cloud.google.com/translate/docs/setup)
2. [Guide to create a Supabase project and get a Supabase API key](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)

---

### 2. **Architecture Overview**

#### **Architecture Description:**

- **Message Flow:**
  1. The user sends a message from the frontend.
  2. The frontend sends the message to the backend with the selected languages.
  3. The backend uses the translation API to translate the message.
  4. The backend returns the translation to the frontend, where it is displayed.

#### **API Details:**
- **Translation Endpoint:**
  - **URL:** `/api/translate`
  - **Method:** `POST`
  - **Request Body:**
    ```json
    {
      "text": "Hola",
      "sourceLang": "es",
      "targetLang": "en"
    }
    ```
  - **Response Body:**
    ```json
    {
      "translatedText": "Hello"
    }
    ```

#### **Session Management:**
- Sessions are stored in Supabase to preserve user chat history and language preferences.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
