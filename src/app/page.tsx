import { Button } from "@/components/ui/button";
import AuthScreen from "@/features/auth/components/AuthScreen";
import UserButton from "@/features/auth/components/UserButton";
import { useAuthActions } from "@convex-dev/auth/react";
import Image from "next/image";
export default function Home() {
  // const {signOut} = useAuthActions();
  return (
    <div >
      <UserButton />
    </div>
  );
}
