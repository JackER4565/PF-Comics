import { Link, useLocation } from "react-router-dom";
import styles from "./Navbar.module.css";
import logoOficial from "../../assets/logo-navbar.png";
import Searchbar from "../../components/searchbar/Searchbar";
import { useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className={styles.container}>
      <div className={styles.imgContainer}>
        <Link to="/home" className={styles.link}>
          <img src={logoOficial} alt="Logo de KapowVerse" />
        </Link>
      </div>
      <Searchbar />
      <div className={styles.menuButtonContainer}>
        <button onClick={toggleMenu}>
          <MenuIcon fontSize="large" className={styles.menuButton}/>
        </button>
      </div>
      <div className={menuOpen ? styles.linksMobile : styles.linkContainer}>
        {menuOpen && (
          <button onClick={() => setMenuOpen(false)} >
            <CloseIcon className={styles.closeButton} fontSize="large"/>
          </button>
        )}
        <Link to="/home" className={styles.link}>
          Home
        </Link>
        <Link to="/comics" className={styles.link}>
          Comics
        </Link>
        <Link to="/mangas" className={styles.link}>
          Mangas
        </Link>
        <Link to="/create" className={styles.link}>
          Create
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
