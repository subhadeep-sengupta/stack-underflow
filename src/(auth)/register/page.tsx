import { useAuthStore } from "@/Store/Auth";
import React, { useState } from "react";

function RegisterPage() {
  const { createAccount } = useAuthStore();

  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {};

  return <div>RegisterPage</div>;
}

export default RegisterPage;
