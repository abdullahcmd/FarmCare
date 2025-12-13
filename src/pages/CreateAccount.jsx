import React, { useState } from "react";
import myImage from "../assets/image1.png";
import TextHeading from "../components/General/Heading";
import { Colors } from "../constants/colors";
import LoginComponents from "../components/Auth/Login";
import Register from "../components/Auth/Register";

const CreateAccount = () => {
  const [AccountState, setAccountState] = useState("Login");
  return (
    <div
      style={{
        display: "flex",
        width: "100vw",
        height: "100vh",
        position: "fixed",
        top: 0,
        left: 0,
        margin: 0,
        padding: 0,
        overflow: "hidden",
      }}
      className="MainCompo"
    >
      <div
        style={{
          flex: 1.3,
          backgroundColor: "red",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%", // Ensure it fills height
        }}
      >
        <img
          className="Image"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
          src={myImage}
        />
      </div>

      {/* --- RIGHT SIDE (FORM) --- */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#f5f5f5",
          height: "100%", // Force it to stay within screen height
          overflowY: "auto", // ✅ ENABLES SCROLLING HERE
        }}
      >
        <div
          style={{ display: "flex", flexDirection: "column", paddingTop: 20 }}
        >
          <TextHeading text={"Farm-Care"} />
          <TextHeading
            newStyle={{
              fontStyle: "italic",
              marginTop: -20,
              fontSize: 20,
              fontWeight: "lighter",
            }}
            text={" A new way to operate Farming."}
          />
        </div>

        <TextHeading
          newStyle={{
            textAlign: "left",
            margin: 20,
            fontSize: 35,
            color: Colors.MainHeading,
          }}
          text={AccountState}
        />

        {/* Content Render */}
        {AccountState === "Login" ? <LoginComponents /> : <Register />}

        {/* Footer Link */}
        <div
          style={{
            display: "flex",
            fontSize: "12px",
            gap: "4px",
            marginTop: "20px",
            marginBottom: "30px", // Added margin bottom so it's not stuck to edge when scrolling
            marginLeft: "20px",
            color: Colors.MainHeading,
          }}
        >
          {AccountState === "Login"
            ? "Don't have an Account?"
            : "Already have an Account"}
          <div
            onClick={() => {
              setAccountState(AccountState === "Login" ? "Register" : "Login");
            }}
            style={{
              fontSize: "12px",
              fontWeight: "bold",
              color: Colors.DarkGreen,
              cursor: "pointer",
            }}
          >
            {AccountState === "Login" ? "Register Here" : "Login"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateAccount;
