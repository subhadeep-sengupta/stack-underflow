"use client";

import { useAuthStore } from "@/Store/Auth";
import React, { useState } from "react";

function RegisterPage() {
  const { createAccount, login } = useAuthStore();

  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formdata = new FormData(e.currentTarget);
    const firstName = formdata.get("firstName");
    const lastName = formdata.get("lastName");
    const email = formdata.get("email");
    const password = formdata.get("password");

    if (!firstName || !lastName || !email || !password) {
      setError(() => "Please fil out the form fields");
      return;
    }
    setError("");
    setLoading(true);
    const response = await createAccount(
      `${firstName} ${lastName}`,
      email?.toString(),
      password?.toString()
    );

    if (!response.error) {
      setError(() => response.error!.message);
    } else {
      const loginResponse = await login(email.toString(), password.toString());
      if (loginResponse.error) {
        setError(() => response.error!.message);
      }
    }
  };

  return (
    <div>
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit}></form>
    </div>
  );
}

export default RegisterPage;
