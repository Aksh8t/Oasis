// src/components/LandingPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChartIcon, TimerIcon, BookIcon, FlameIcon, ChevronRightIcon } from './Icons.jsx';

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <ChartIcon />,
      title: "Track Your Screen Time",
      description: "Gain insights into your digital habits and understand where your time goes."
    },
    {
      icon: <TimerIcon />,
      title: "Digital Detox Timer",
      description: "Schedule and start focused sessions to disconnect from your devices."
    },
    {
      icon: <BookIcon />,
      title: "Mindful Journaling",
      description: "Reflect on your day, set intentions, and cultivate a positive mindset."
    },
    {
      icon: <FlameIcon />,
      title: "Build Healthy Streaks",
      description: "Stay motivated by tracking your consistency with new wellness habits."
    }
  ];

  return (
    <div className="animate-fade-in">
      {/* 1. Hero Section */}
      <section className="min-h-screen flex items-center justify-center pt-24 pb-12 bg-gradient-to-b from-brand-light via-white to-white">
        <div className="container mx-auto max-w-6xl px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold text-brand-dark mb-6 animate-slide-up">
            Find Your <span className="text-brand-primary">Digital</span> Balance.
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-10 animate-slide-up-delay-1">
            Oasis helps you disconnect from the noise and reconnect with yourself. Build mindful habits, reduce screen time, and discover a healthier digital life.
          </p>

          {/* 🔹 Replaced setPage() with navigate() */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 animate-slide-up-delay-2">
            <button
              onClick={() => navigate("/signin")}
              className="bg-brand-primary text-white font-bold py-4 px-10 text-lg rounded-lg shadow-xl hover:bg-brand-dark transition-all duration-300 transform hover:-translate-y-1"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="bg-white border-2 border-brand-primary text-brand-primary font-bold py-4 px-10 text-lg rounded-lg shadow-xl hover:bg-brand-primary hover:text-white transition-all duration-300 transform hover:-translate-y-1"
            >
              Sign Up
            </button>
          </div>
        </div>
      </section>

      {/* 2. Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto max-w-6xl px-4">
          <h2 className="text-4xl font-bold text-center text-brand-dark mb-4">Everything you need to thrive.</h2>
          <p className="text-lg text-gray-600 text-center max-w-xl mx-auto mb-16">
            All your digital wellness tools in one simple, beautiful dashboard.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-brand-light p-8 rounded-2xl shadow-lg border border-emerald-100 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 opacity-0 animate-slide-up"
              >
                <div className="bg-brand-primary text-white w-14 h-14 rounded-full flex items-center justify-center mb-5 shadow-lg">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-brand-dark mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Quote Section */}
      <section className="py-24 bg-brand-dark text-white">
        <div className="container mx-auto max-w-3xl px-4 text-center">
          <blockquote className="text-3xl md:text-4xl font-medium italic relative">
            <span className="absolute -top-8 -left-8 text-8xl text-brand-primary/30 font-serif opacity-50">&ldquo;</span>
            Technology is a useful servant but a dangerous master.
            <span className="absolute -bottom-8 -right-8 text-8xl text-brand-primary/30 font-serif opacity-50">&rdquo;</span>
          </blockquote>
          <p className="text-xl text-brand-primary mt-8">&mdash; Christian Lous Lange</p>
        </div>
      </section>

      {/* 4. Final CTA Section */}
      <section className="py-24 bg-white text-center">
        <div className="container mx-auto max-w-3xl px-4">
          <h2 className="text-4xl font-bold text-brand-dark mb-6">Ready to find your focus?</h2>
          <p className="text-lg text-gray-600 max-w-xl mx-auto mb-10">
            Start tracking your habits and building a better relationship with technology today. It's free to get started.
          </p>
          <button
            onClick={() => navigate("/signup")}
            className="bg-brand-primary text-white font-bold py-4 px-10 text-lg rounded-lg shadow-xl hover:bg-brand-dark transition-all duration-300 transform hover:-translate-y-1"
          >
            Get Started
            <ChevronRightIcon className="inline-block ml-2" />
          </button>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
