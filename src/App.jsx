import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import PokemonInfo from "./pages/PokemonInfo/PokemonInfo";
import PokemonMove from "./pages/PokemonMove/PokemonMove";
import "./index.css";

function App() {
    return (
        <Router>
            <Routes>
                <Route exact path="/" element={<Home />} />
                <Route path="/pokemon/:id" element={<PokemonInfo />} />
                <Route path="/pokemon/:id/:move" element={<PokemonMove />} />
            </Routes>
        </Router>
    );
}

export default App;
