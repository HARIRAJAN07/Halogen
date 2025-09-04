import React from "react";
import LogoImage from "../assets/logo.png";

const Logo = () => {
  return (
    <div style={styles.logoContainer}>
      <img
        src={LogoImage}
        alt="Logo"
        style={styles.logoImage}
      />
    </div>
  );
};

const styles = {
  logoContainer: {
    position: "absolute",
    top: "10vh",   // 5% of viewport height
    left: "4vw",  // 2% of viewport width
    zIndex: 10,
  },
  logoImage: {
    width: "20vw",   // relative to viewport width
    height: "15vh",  // relative to viewport height
    objectFit: "contain",
  },
};

export default Logo;
