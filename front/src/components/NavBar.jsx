import '../root.css'
import {Link} from "react-router-dom";

function NavBar(){
    return(
      <nav>
          <Link to="/" className="logo">Money.</Link>
          <Link to="/" className="navLinks">Home</Link>
          <Link to="/patrimoine" className="navLinks">Patrimoine' stats</Link>
          <Link to="/Possession" className="navLinks">Possession's list</Link>
      </nav>
    );
}
export default NavBar;