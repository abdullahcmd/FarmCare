import { useState } from "react";
import { useNavigate } from "react-router-dom";
import InputField from "../General/input";
import CustomButton from "../General/Button";
import { Colors } from "../../constants/colors";
import { useAuth } from "../../context/AuthContext";

const LoginComponents = () => {
  const [number, setNumber] = useState("");
  const [pass, setPass] = useState("");
  const [hover, setHover] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const onClick = async () => {
    if (!number || !pass) {
      setError("Please fill in all fields");
      return;
    }
    setError("");
    setLoading(true);
    
    const result = await login(number, pass);
    setLoading(false);
    
    if (result.success) {
      navigate("/dashboard");
    } else {
      setError(result.error || "Login failed");
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {error && (
        <div
          style={{
            margin: "10px 20px",
            padding: "10px",
            backgroundColor: "#ffebee",
            color: "#c62828",
            borderRadius: "5px",
            fontSize: "14px",
          }}
        >
          {error}
        </div>
      )}
      <InputField
        value={number}
        type="text"
        newStyle={{ margin: "15px", width: "50%", marginLeft: 20 }}
        onChange={(e) => {
          setNumber(e.target.value);
          setError("");
        }}
        label={"Phone Number"}
        placeholder={"Enter Phone Number"}
        error={error && !number ? "Required" : ""}
      />
      <InputField
        value={pass}
        newStyle={{ margin: "15px", width: "50%", marginLeft: 20 }}
        onChange={(e) => {
          setPass(e.target.value);
          setError("");
        }}
        type="password"
        label={"Password"}
        placeholder={"Enter password"}
        error={error && !pass ? "Required" : ""}
      />
      <CustomButton
        isHovered={hover}
        setIsHovered={setHover}
        text={loading ? "Logging in..." : "Submit"}
        onClick={onClick}
        disabled={loading}
        style={{
          marginTop: 30,
          marginLeft: 20,
          alignSelf: "flex-start",
          color: hover ? Colors.MainHeading : "white",
          width: "30%",
          borderColor: "white",
          textAlign: "center",
          borderwidth: 0,
          backgroundColor: hover
            ? Colors.LightGreen
            : Colors.MainHeading,
          cursor: loading ? "not-allowed" : "pointer",
        }}
      />
    </div>
  );
};

export default LoginComponents;
