import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => (
  <div className="min-h-screen flex flex-col items-center justify-start bg-gradient-to-b from-blue-500 to-blue-200 pb-20">
    
    {/* Top Hero Section */}
    <div className="w-full max-w-6xl mt-20 p-12 rounded-3xl bg-gradient-to-br from-blue-600 to-blue-400 text-white shadow-2xl text-center">
      <h1 className="text-4xl font-extrabold mb-4 leading-tight">Discover Trusted Local Professionals</h1>
      <p className="text-2xl mb-6">Easily connect with top-rated service providers in your neighborhood</p>
    </div>

    {/* Search Section */}
    <div className="w-full max-w-6xl mt-16 bg-white rounded-3xl shadow-xl p-10 flex flex-col items-center min-h-[250px]">
      <div className="font-bold text-3xl text-gray-800 mb-8 text-center">
        Search <span className="font-extrabold text-blue-700">Find Your Provider</span>
      </div>

      <form className="flex flex-wrap gap-6 w-full items-center justify-center">
        <select className="border border-gray-300 rounded-xl px-4 h-12 text-lg focus:outline-none w-[220px]">
          <option value="">All Professions</option>
          <option value="plumber">Plumber</option>
          <option value="electrician">Electrician</option>
          <option value="cleaner">Cleaner</option>
        </select>

        <input
          type="text"
          placeholder="Enter your city"
          className="border border-gray-300 rounded-xl px-4 h-12 text-lg focus:outline-none w-[220px]"
        />

        <select className="border border-gray-300 rounded-xl px-4 h-12 text-lg focus:outline-none w-[220px]">
          <option value="">Any Rating</option>
          <option value="5">5 Stars</option>
          <option value="4">4+ Stars</option>
          <option value="3">3+ Stars</option>
        </select>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 h-12 rounded-xl text-lg font-semibold shadow min-w-[180px] whitespace-nowrap"
        >
          Search Providers
        </button>
      </form>
    </div>
  </div>
);

export default Landing;
