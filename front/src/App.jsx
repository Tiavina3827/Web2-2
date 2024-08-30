
import {useEffect, useState} from "react";
import NavBar from "./components/NavBar.jsx";
import {BrowserRouter,Routes,Route} from "react-router-dom";
import Patrimoine from "./components/Patrimoine.jsx";
import Possessions from "./components/Possessions.jsx";
function App() {
    return(
        <>
            <BrowserRouter>
                <NavBar/>
                <Routes>
                    <Route path="/patrimoine" element={<Patrimoine/>}/>
                    <Route path="/possession" element={<Possessions/>}/>
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App
