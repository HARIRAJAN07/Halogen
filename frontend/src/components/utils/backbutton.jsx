import React from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";

const BackButton = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(-1);
  };

  return (
    <div style={styles.container}>
      <button onClick={handleClick} style={styles.button}>
        <IoArrowBack style={{ ...styles.icon, fontSize: "3vh" }} />
      </button>
    </div>
  );
};

const styles = {
  container: {
    position: "absolute",
    bottom: "3vh",
    left: "2vw",
    zIndex: 10,
  },
  button: {
    width: "6vh",
    height: "6vh",
    borderRadius: "50%",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    boxShadow: "0 0.4vh 0.6vh rgba(0, 0, 0, 0.2)",
    border: "none",
    cursor: "pointer",
  },
  icon: {
    color: "#8E7FD9",
  },
};

export default BackButton;
