import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Index from "./pages/Index.jsx";
import VenuePage from "./pages/VenuePage.jsx";
import EventPage from "./pages/EventPage.jsx";
import EventDetailPage from "./pages/EventDetailPage.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Index />} />
        <Route path="/events" element={<EventPage />} />
        <Route path="/events/:eventId" element={<EventDetailPage />} />
        <Route path="/venues" element={<VenuePage />} />
      </Routes>
    </Router>
  );
}

export default App;