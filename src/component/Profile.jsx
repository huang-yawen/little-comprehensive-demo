import { useContext } from "react";
import { useNameContext } from "../context";
function Profile() {
  const {nameVal,changeName}=useContext(useNameContext)
  return (
    <div>
      修改用户名字：
        <input
          type="text"
          value={nameVal}
          onChange={(e) => {
            changeName(e.target.value)
          }}
        />
    </div>
  );
}
export default Profile;
