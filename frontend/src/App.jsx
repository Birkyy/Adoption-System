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
import NGOList from "./pages/NGOList";
import Map from "./pages/Map";

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
            <Route path="ngo" element={<NGOList />} />
            <Route path="map" element={<Map />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
