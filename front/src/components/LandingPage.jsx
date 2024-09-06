import '../style/Landing.css'
import {Link} from 'react-router-dom'
function LandingPage(){
    return(
        <>
        <div className="container2">
            <h1>Gérer votre patrimoine avec plus de faciliter avec: </h1>
            <div className="possessionPres">
                <p>Une lise des possessions et leurs gestions intégrer</p>
                <Link to="/Possession" className="PossessionBtn">Possession's list</Link>

            </div>
            <div className="patrimoinePres">
                <p>des statistiques de la valeurs de vos possessions et la valeur de votre patrimoine a une date
                    donnée </p>
                <Link to="/patrimoine" className="PossessionBtn">Patrimoine</Link>
            </div>

        </div>
        </>
    )
}

export default LandingPage;