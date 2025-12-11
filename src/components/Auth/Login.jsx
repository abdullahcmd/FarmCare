import { useState } from "react";
import InputField from "../General/input";
import CustomButton from "../General/Button";
import { Colors } from "../../constants/colors";

const LoginComponents = () => {
  const [number, setNumber] = useState("");
  const [pass, setPass] = useState("");
  const [hover, setHover] = useState(false);
  const onClick = () => {
    console.log("Number", number);
    console.log("Pass", pass);
  };
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <scroll>
        <InputField
          value={number}
          type="text"
          newStyle={{ margin: "15px", width: "50%", marginLeft: 20 }}
          onChange={(e) => {
            setNumber(e.target.value);
          }}
          label={"Phone Number"}
          placeholder={"Enter Phone Number"}
        />
        <InputField
          value={pass}
          newStyle={{ margin: "15px", width: "50%", marginLeft: 20 }}
          onChange={(e) => {
            setPass(e.target.value);
          }}
          type="password"
          label={"Password"}
          placeholder={"Enter password"}
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
            borderwidth: 0,
            backgroundColor: hover
              ? Colors.textInputBackground
              : Colors.MainHeading,
          }}
        />
      </scroll>
    </div>
  );
};

export default LoginComponents;
