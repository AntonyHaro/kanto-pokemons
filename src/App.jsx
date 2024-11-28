import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import PokemonInfo from "./pages/PokemonInfo/PokemonInfo";
import PokemonMove from "./pages/PokemonMove/PokemonMove";
import Favorites from "./pages/Favorites/Favorites";
import Teams from "./pages/Teams/Teams";
import Moves from "./pages/Moves/Moves";
import Berries from "./pages/Berries/Berries";
import "./index.css";

function App() {
    return (
        <Router>
            <Routes>
                <Route exact path="/" element={<Home />} />
                <Route path="/pokemon/:id" element={<PokemonInfo />} />
                <Route path="/pokemon/:id/:move" element={<PokemonMove />} />
                <Route path="/favorites" element={<Favorites />} />
                <Route path="/moves" element={<Moves />} />
                <Route path="/berries" element={<Berries />} />
            </Routes>
        </Router>
    );
}

export default App;
