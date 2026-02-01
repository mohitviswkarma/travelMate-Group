import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import AuthPage from "./pages/AuthPage"
import ProfileSetupPage from "./pages/ProfileSetupPage"
import HomePage from "./pages/HomePage"
import FeedPage from "./pages/FeedPage"
import ChatPage from "./pages/ChatPage"
import DestinationsPage from "./pages/Destinations"
import CommunitiesPage from "./pages/communities"
import StoriesPage from "./pages/stories"

          
function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background font-sans antialiased">
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/feed" element={<FeedPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/destinations" element={<DestinationsPage />} />
          <Route path="/communities" element={<CommunitiesPage />} />
          <Route path="/stories" element={<StoriesPage />} />
          <Route path="/profile-setup" element={<ProfileSetupPage />} />
          <Route path="*" element={<Navigate to="/auth" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
