import React, { useState } from "react";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.message) {
      setError("Please fill all fields.");
      return;
    }
    setError("");

    const subject = encodeURIComponent(`Contact from ${form.name}`);
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\n\nMessage:\n${form.message}`
    );

    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=spsinghrathore1807@gmail.com&su=${subject}&body=${body}`;
    window.open(gmailUrl, "_blank");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center px-6 py-16">
      <h1 className="text-5xl font-extrabold text-center mb-12 tracking-tight">
        Resume
        <span
          style={{
            background:
              "linear-gradient(90deg, #0046f3, #0066ff, #003399)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            display: "inline-block",
            marginLeft: 8,
          }}
        >
          AI
        </span>
      </h1>

      <form
        onSubmit={handleSubmit}
        className="max-w-xl mx-auto flex flex-col space-y-6"
        noValidate
      >
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          required
          value={form.name}
          onChange={handleChange}
          className="border border-gray-300 rounded-md px-4 py-3 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="email"
          name="email"
          placeholder="Your Email"
          required
          value={form.email}
          onChange={handleChange}
          className="border border-gray-300 rounded-md px-4 py-3 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <textarea
          name="message"
          rows={5}
          placeholder="Your Message"
          required
          value={form.message}
          onChange={handleChange}
          className="border border-gray-300 rounded-md px-4 py-3 text-black resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {error && (
          <p className="text-red-600 text-sm text-center font-medium">{error}</p>
        )}

        <button
          type="submit"
          className="bg-black text-white font-semibold py-3 rounded-md hover:bg-gray-900 transition"
        >
          Send Message
        </button>
      </form>
    </div>
  );
}
