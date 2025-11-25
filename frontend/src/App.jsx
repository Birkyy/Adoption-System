import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import PetList from "./pages/PetList";
import SignIn from "./pages/SignIn";
import Register from "./pages/Register";
import Surrender from "./pages/Surrender";
import Article from "./pages/Article";
import Event from "./pages/Event";
import Volunteer from "./pages/Volunteer";
import Map from "./pages/Map";
import PetDetail from "./pages/PetDetail";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import Partner from "./pages/Partner";
import NGODashboard from "./pages/NGODashboard";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="adopt" element={<PetList />} />
            <Route path="signin" element={<SignIn />} />
            <Route path="register" element={<Register />} />
            <Route path="surrender" element={<Surrender />} />
            <Route path="article" element={<Article />} />
            <Route path="event" element={<Event />} />
            <Route path="volunteer" element={<Volunteer />} />
            <Route path="map" element={<Map />} />
            <Route path="petdetail" element={<PetDetail />}></Route>
            <Route path="profile" element={<Profile />}></Route>
            <Route path="admin" element={<AdminDashboard />} />
            <Route path="partner" element={<Partner />} />
            <Route path="ngo" element={<NGODashboard />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
