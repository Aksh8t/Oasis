import React from "react";
import { LeafIcon, FlameIcon, BookIcon, TimerIcon } from "./Icons.jsx";

const AboutPage = () => {
  return (
<div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 transition-colors duration-500">
      <div className="container mx-auto max-w-6xl px-6 text-center">
        {/* 🌿 Hero Section */}
        <h1 className="text-5xl font-extrabold text-brand-dark mb-4 animate-slide-up">
          About <span className="text-brand-primary">Oasis</span>
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto animate-slide-up-delay-1">
          <strong>Oasis</strong> is a mindful digital wellness platform built by
          a passionate team of creators who believe that technology should help
          you live better — not distract you from what matters.
        </p>

        {/* 🌸 Mission Section */}
        <section className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-10 text-left">
          <div className="bg-white rounded-2xl p-8 shadow-md border border-emerald-100 hover:shadow-lg transition-all duration-300">
            <div className="bg-brand-primary text-white w-12 h-12 flex items-center justify-center rounded-lg mb-5">
              <FlameIcon />
            </div>
            <h3 className="text-2xl font-semibold text-brand-dark mb-3">
              Our Mission
            </h3>
            <p className="text-gray-600">
              To empower individuals to take control of their digital habits,
              reduce screen fatigue, and find balance between focus and fun.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-md border border-emerald-100 hover:shadow-lg transition-all duration-300">
            <div className="bg-brand-primary text-white w-12 h-12 flex items-center justify-center rounded-lg mb-5">
              <BookIcon />
            </div>
            <h3 className="text-2xl font-semibold text-brand-dark mb-3">
              Our Vision
            </h3>
            <p className="text-gray-600">
              We envision a world where mindful technology use leads to
              meaningful connections, creativity, and happiness.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-md border border-emerald-100 hover:shadow-lg transition-all duration-300">
            <div className="bg-brand-primary text-white w-12 h-12 flex items-center justify-center rounded-lg mb-5">
              <TimerIcon />
            </div>
            <h3 className="text-2xl font-semibold text-brand-dark mb-3">
              Our Approach
            </h3>
            <p className="text-gray-600">
              By blending design, psychology, and technology, Oasis promotes
              mindful living — one small, positive habit at a time.
            </p>
          </div>
        </section>

        {/* 🌿 Story Section */}
        <section className="mt-24 max-w-4xl mx-auto text-left">
          <h2 className="text-3xl font-bold text-brand-dark mb-6">
            Our Story
          </h2>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Oasis was founded by a group of four students who shared one goal —
            to create a calm digital space in a noisy world. After noticing how
            overwhelming technology had become, we decided to build something
            that helps people pause, reflect, and take back control of their
            time.
          </p>
          <p className="text-gray-600 leading-relaxed">
            What started as a small idea evolved into a full platform designed
            to promote focus, mindfulness, and balance in the digital age.
          </p>
        </section>

        {/* 🌱 Team Section */}
        <section className="mt-24">
          <h2 className="text-3xl font-bold text-brand-dark mb-10">
            Meet the Team
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {[
              {
                name: "Tanmay Dixit",
                role: "Developer",
                gender: "male",
                img: "https://cdn-icons-png.flaticon.com/512/921/921071.png",
              },
              {
                name: "Akshat Tiwari",
                role: "AI Engineer",
                gender: "male",
                img: "https://cdn-icons-png.flaticon.com/512/4333/4333609.png",
              },
              {
                name: "Ameya Balange",
                role: "Backend Engineer",
                gender: "male",
                img: "https://cdn-icons-png.flaticon.com/512/4140/4140048.png",
              },
              {
                name: "Ishawari Kapse",
                role: "UI/UX Designer",
                gender: "female",
                img: "https://cdn-icons-png.flaticon.com/512/4140/4140051.png",
              },
            ].map((member, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl shadow-md border border-emerald-100 hover:shadow-xl transition-all duration-300 p-6 flex flex-col items-center"
              >
                <img
                  src={member.img}
                  alt={member.name}
                  className="w-24 h-24 rounded-full object-cover mb-4 border-2 border-brand-primary bg-gray-100 p-1"
                />
                <h3 className="text-xl font-semibold text-brand-dark">
                  {member.name}
                </h3>
                <p className="text-sm text-gray-500">{member.role}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 🌾 Final Quote */}
        <section className="mt-24 bg-brand-dark text-white rounded-3xl py-16 px-6 shadow-xl">
          <h2 className="text-3xl md:text-4xl font-semibold mb-6">
            “Technology is powerful — but peace is priceless.”
          </h2>
          <p className="text-lg text-brand-light">
            Oasis reminds you to pause, breathe, and live intentionally in a connected world.
          </p>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;
