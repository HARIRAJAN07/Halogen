import React from "react";
import { IoArrowBack } from "react-icons/io5"; // Ionicons web version

const BackButton = ({ onPress, style = {}, iconStyle = {}, size = "3vh" }) => {
  return (
    <div style={{ ...styles.container }}>
      <button
        onClick={onPress}
        style={{ ...styles.button, ...style }}
      >
        <IoArrowBack style={{ ...styles.icon, fontSize: size, ...iconStyle }} />
      </button>
    </div>
  );
};

const styles = {
  container: {
    position: "absolute",
    bottom: "3vh",  // instead of px
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
