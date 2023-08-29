import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { selectUserInfo } from "../../user/userSlice";
import { selectLoggedInUser } from "../authSlice";

export default function ProtectedAdmin({ children }) {
  const user = useSelector(selectLoggedInUser);
  const userInfo = useSelector(selectUserInfo);
  console.log("userInfo", userInfo);

  if (!user) {
    return <Navigate to="/login" replace={true}></Navigate>;
  }
  if (user && userInfo.role !== "admin") {
    return <Navigate to="/" replace={true} />;
  }

  return children;
}
