import { Suspense } from "react";
import ResetPasswordForm from "../components/ResetPasswordForm";

export default function RestPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}