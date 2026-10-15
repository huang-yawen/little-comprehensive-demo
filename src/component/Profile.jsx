import { useState } from "react";
import { useNameContext } from "../context/index";
function Profile() {
  const [nameVal, setNameVal] = useState("");
  const changeName = (newVal) => {
    setNameVal(newVal);
  };
  return (
    <div>
      <useNameContext.Provider value={nameVal}>
        修改用户名字：
        <input
          type="text"
          value={nameVal}
          onChange={(e) => changeName(e.target.value)}
        />
      </useNameContext.Provider>
    </div>
  );
}
export default Profile;
