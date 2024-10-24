import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./components/pages/Home";
import PokemonInfo from "./components/pages/PokemonInfo";

function App() {
    return (
        <Router>
            <Routes>
                <Route exact path="/" element={<Home />} />
                <Route path="/pokemoninfo/:id" element={<PokemonInfo />} />
            </Routes>
        </Router>
    )
}

export default App;
