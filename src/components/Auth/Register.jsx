import { useState } from "react";
import InputField from "../General/input";
import CustomButton from "../General/Button";
import { Colors } from "../../constants/colors";

const Register = () => {
  const [number, setNumber] = useState("");
  const [location, setLocation] = useState("");
  const [role, setRole] = useState("Farmer");
  const [landUnit, setLandUnit] = useState("Acre");
  const [landSize, setLandSize] = useState("");
  const [education, setEducation] = useState("");
  const [experience, setExperience] = useState("");
  const [pass, setPass] = useState("");
  const [confirmpass, setConfirmpassPass] = useState("");
  const [hover, setHover] = useState(false);

  const onClick = () => {
    // ... logic
  };

  // ✅ FIXED STYLE: Changed width to 90% so it covers the white area
  const inputStyle = { margin: "10px", width: "90%", marginLeft: 20 };

  return (
    <div
      style={{ display: "flex", flexDirection: "column", paddingBottom: 20 }}
    >
      {/* ❌ REMOVED <scroll> tag. It is invalid. */}

      <InputField
        value={number}
        type="text"
        newStyle={inputStyle}
        onChange={(e) => setNumber(e.target.value)}
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
            value="Farmer"
            checked={role === "Farmer"}
            onChange={() => setRole("Farmer")}
            style={{ marginRight: 5 }}
          />
          Farmer
        </label>
        <label style={{ cursor: "pointer", color: "#333" }}>
          <input
            type="radio"
            value="Expert"
            checked={role === "Expert"}
            onChange={() => setRole("Expert")}
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

      {role === "Farmer" && (
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

      {role === "Expert" && (
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
        text={"Submit"}
        onClick={onClick}
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
            ? Colors.textInputBackground
            : Colors.MainHeading,
        }}
      />
    </div>
  );
};

export default Register;
