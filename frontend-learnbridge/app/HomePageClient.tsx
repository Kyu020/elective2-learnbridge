// app/HomePageClient.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export function HomePageClient() {
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      title: "Peer-to-Peer Tutoring",
      description: "Connect with student tutors who excel in subjects you're struggling with across all disciplines",
      icon: "👥"
    },
    {
      title: "Academic Resource Hub",
      description: "Access and share study materials, notes, textbooks, and resources with students from all programs",
      icon: "📚"
    },
    {
      title: "Cross-Disciplinary Learning",
      description: "Bridge educational gaps through collaborative learning and knowledge sharing across different fields",
      icon: "🌉"
    }
  ];

  const popularSubjects = [
    "Mathematics & Statistics", "Programming & CS", "Natural Sciences", "Business & Economics", 
    "Engineering", "Social Sciences", "Humanities", "Languages"
  ];

  const programs = [
    { name: "Computer Studies", focus: "Programming, IT, and Digital Solutions", icon: "💻" },
    { name: "Engineering", focus: "Technical and Applied Sciences", icon: "⚙️" },
    { name: "Business", focus: "Management and Commerce", icon: "📊" },
    { name: "Arts & Sciences", focus: "Liberal Arts and Natural Sciences", icon: "🎓" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50" role="navigation" aria-label="Main navigation">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">LB</span>
              </div>
              <span className="text-xl font-bold text-gray-900">LearnBridge</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/login" className="text-gray-700 hover:text-gray-900 font-medium">
                Sign In
              </Link>
              <Link 
                href="/signup" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
          Bridge Your Learning Journey
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Connect with expert tutors, access quality resources, and accelerate your academic success
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/signup" 
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold text-lg hover:opacity-90 transition-opacity"
          >
            Start Learning
          </Link>
          <Link 
            href="/tutors" 
            className="bg-white text-gray-900 px-8 py-3 rounded-lg font-semibold text-lg border-2 border-gray-300 hover:border-gray-400 transition-colors"
          >
            Browse Tutors
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16" aria-labelledby="features-heading">
        <h2 id="features-heading" className="text-3xl font-bold text-center text-gray-900 mb-12">
          Why Choose LearnBridge?
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <article
              key={index}
              className={`p-6 bg-white rounded-xl shadow-lg cursor-pointer transition-transform hover:scale-105 ${
                activeFeature === index ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => setActiveFeature(index)}
              role="button"
              tabIndex={0}
              aria-label={`Feature: ${feature.title}`}
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Popular Subjects */}
      <section className="bg-white py-16" aria-labelledby="subjects-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 id="subjects-heading" className="text-3xl font-bold text-center text-gray-900 mb-12">
            Popular Subjects
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {popularSubjects.map((subject, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
              >
                {subject}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16" aria-labelledby="programs-heading">
        <h2 id="programs-heading" className="text-3xl font-bold text-center text-gray-900 mb-12">
          Programs We Support
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {programs.map((program, index) => (
            <article key={index} className="p-6 bg-white rounded-xl shadow-lg text-center">
              <div className="text-4xl mb-4">{program.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{program.name}</h3>
              <p className="text-gray-600 text-sm">{program.focus}</p>
            </article>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16" aria-labelledby="cta-heading">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 id="cta-heading" className="text-3xl font-bold mb-4">
            Ready to Start Learning?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of students already using LearnBridge
          </p>
          <Link 
            href="/signup" 
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-colors inline-block"
          >
            Create Your Account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12" role="contentinfo">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">LearnBridge</h3>
              <p className="text-gray-400 text-sm">
                Your platform for connecting with tutors and accessing quality learning resources.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/tutors" className="hover:text-white">Browse Tutors</Link></li>
                <li><Link href="/resources" className="hover:text-white">Resources</Link></li>
                <li><Link href="/about" className="hover:text-white">About Us</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/help" className="hover:text-white">Help Center</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact Us</Link></li>
                <li><Link href="/faq" className="hover:text-white">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; {new Date().getFullYear()} LearnBridge. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

