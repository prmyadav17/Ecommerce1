import React from "react";
import Navbar from "../features/navbar/Navbar";
import { UserProfile } from "../features/user/components/UserProfile";

export default function UserProfilePage() {
  return (
    <Navbar>
      <UserProfile />
    </Navbar>
  );
}
