import { useState } from "react";
import { useNavigate } from "react-router-dom";
import InputField from "../General/input";
import CustomButton from "../General/Button";
import { Colors } from "../../constants/colors";
import { useAuth } from "../../context/AuthContext";

const Register = () => {
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [location, setLocation] = useState("");
  const [role, setRole] = useState("farmer");
  const [landUnit, setLandUnit] = useState("Acre");
  const [landSize, setLandSize] = useState("");
  const [education, setEducation] = useState("");
  const [experience, setExperience] = useState("");
  const [pass, setPass] = useState("");
  const [confirmpass, setConfirmpassPass] = useState("");
  const [hover, setHover] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const onClick = async () => {
    setError("");
    
    if (!name || !number || !location || !pass || !confirmpass) {
      setError("Please fill in all required fields");
      return;
    }
    
    if (pass !== confirmpass) {
      setError("Passwords do not match");
      return;
    }
    
    if (role === "farmer" && !landSize) {
      setError("Please enter land size");
      return;
    }
    
    if (role === "expert" && !education) {
      setError("Please enter education details");
      return;
    }
    
    setLoading(true);
    
    const userData = {
      name,
      number,
      password: pass,
      role: role.toLowerCase(),
      location,
    };
    
    if (role === "farmer") {
      userData.land_unit = landUnit;
      userData.land_area = parseFloat(landSize);
    } else {
      userData.education = education;
      userData.experience_years = experience ? parseInt(experience) : null;
    }
    
    const result = await register(userData);
    setLoading(false);
    
    if (result.success) {
      navigate("/dashboard");
    } else {
      setError(result.error || "Registration failed");
    }
  };

  // ✅ FIXED STYLE: Changed width to 90% so it covers the white area
  const inputStyle = { margin: "10px", width: "90%", marginLeft: 20 };

  return (
    <div
      style={{ display: "flex", flexDirection: "column", paddingBottom: 20 }}
    >
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
        value={name}
        type="text"
        newStyle={inputStyle}
        onChange={(e) => {
          setName(e.target.value);
          setError("");
        }}
        label={"Name:"}
        placeholder={"Enter Your Name"}
      />

      <InputField
        value={number}
        type="text"
        newStyle={inputStyle}
        onChange={(e) => {
          setNumber(e.target.value);
          setError("");
        }}
        label={"Phone Number:"}
        placeholder={"Enter Phone Number"}
      />

      {/* Role Selection */}
      <div style={{ marginLeft: 20, marginTop: 10, marginBottom: 10 }}>
        <label style={{ fontWeight: "bold", marginRight: 15, color: "#333" }}>
          Select Role:
        </label>
        <label style={{ marginRight: 15, cursor: "pointer", color: "#333" }}>
          <input
            type="radio"
            value="farmer"
            checked={role === "farmer"}
            onChange={() => setRole("farmer")}
            style={{ marginRight: 5 }}
          />
          Farmer
        </label>
        <label style={{ cursor: "pointer", color: "#333" }}>
          <input
            type="radio"
            value="expert"
            checked={role === "expert"}
            onChange={() => setRole("expert")}
            style={{ marginRight: 5 }}
          />
          Expert
        </label>
      </div>

      <InputField
        value={location}
        type="text"
        newStyle={inputStyle}
        onChange={(e) => setLocation(e.target.value)}
        label={"Location:"}
        placeholder={"Enter City/Area"}
      />

      {role === "farmer" && (
        <div style={{ marginLeft: 20, width: "90%" }}>
          {" "}
          {/* Adjusted Width */}
          <label
            style={{
              fontWeight: "bold",
              display: "block",
              marginBottom: 5,
              textAlign: "left",
              color: "#333",
            }}
          >
            Land Details:
          </label>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <select
              value={landUnit}
              onChange={(e) => setLandUnit(e.target.value)}
              style={{
                padding: "10px",
                color: "black",
                backgroundColor: "white", // Fixed background
                borderRadius: "5px",
                border: "1px solid #ccc",
                flex: 1,
                outline: "none",
              }}
            >
              <option value="Canal">Canal</option>
              <option value="Acre">Acre</option>
              <option value="Marla">Marla</option>
            </select>

            <div style={{ flex: 2 }}>
              {" "}
              {/* Wrapped input to handle width better */}
              <InputField
                type="number"
                placeholder="Size"
                value={landSize}
                onChange={(e) => setLandSize(e.target.value)}
                style={{ width: "100%" }} // Ensure it fills the flex space
              />
            </div>
          </div>
        </div>
      )}

      {role === "expert" && (
        <>
          <InputField
            value={education}
            newStyle={inputStyle}
            onChange={(e) => setEducation(e.target.value)}
            label={"Education:"}
            placeholder={"e.g. PhD"}
          />
          <InputField
            value={experience}
            newStyle={inputStyle}
            onChange={(e) => setExperience(e.target.value)}
            type="number"
            label={"Years of Experience:"}
            placeholder={"e.g. 5"}
          />
        </>
      )}

      <InputField
        value={pass}
        newStyle={inputStyle}
        onChange={(e) => setPass(e.target.value)}
        type="password"
        label={"Password:"}
        placeholder={"Enter password"}
      />
      <InputField
        value={confirmpass}
        newStyle={inputStyle}
        onChange={(e) => setConfirmpassPass(e.target.value)}
        type="password"
        label={"Confirm Password:"}
        placeholder={"Re-enter password"}
      />

        <CustomButton
        isHovered={hover}
        setIsHovered={setHover}
        text={loading ? "Registering..." : "Submit"}
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
          borderWidth: 0,
          backgroundColor: hover
            ? Colors.LightGreen
            : Colors.MainHeading,
          cursor: loading ? "not-allowed" : "pointer",
        }}
      />
    </div>
  );
};

export default Register;
