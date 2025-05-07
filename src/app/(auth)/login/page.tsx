import SignInForm from "@/components/auth/SignInForm";
import { generateMetadata } from "@/utils/metadata";
import { Metadata } from "next";

export const metadata = generateMetadata({
  title: "Login In",
  description: "Autherntication to your Bizcotap account.",
});
export default function  login() {
  
  return <SignInForm />;
}
