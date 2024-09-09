"use client";

import { useAuthStore } from "@/Store/Auth";
import React, { useState } from "react";

function LoginPage() {
  const { login } = useAuthStore();
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    //collect data
    const formdata = new FormData(e.currentTarget);
    const email = formdata.get("email");
    const password = formdata.get("password");

    //validate data

    if (!email || !password) {
      setError(() => "Please fill out the fields");
      return;
    }

    setLoading(true);
    setError("");

    // call the store to login

    const response = await login(email.toString(), password.toString());

    if (response.error) {
      setError(() => response.error!.message);
    }
    setLoading(() => false);
  };

  return (
    <div>
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit}></form>
    </div>
  );
}

export default LoginPage;
