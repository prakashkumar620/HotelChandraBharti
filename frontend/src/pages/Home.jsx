import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Home() {
  const { user, isLoggedIn } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/40 rounded-xl p-12 text-center mb-8">
          <h1 className="text-5xl font-bold mb-4 text-yellow-400">
            Welcome to Hotel Chandra Bharti 🍽️
          </h1>
          {isLoggedIn && (
            <h2 className="text-2xl text-yellow-300 mb-4">
              Welcome, {user?.name} 👋
            </h2>
          )}
          <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-8">
            Experience authentic Indian cuisine with premium ambience. From tandoor specialties to South Indian delicacies, we serve the finest dishes in a family-friendly environment.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              to="/menu"
              className="bg-yellow-500 hover:bg-yellow-400 text-black px-8 py-3 rounded-lg font-bold transition"
            >
              View Menu
            </Link>
            <Link
              to="/table-booking"
              className="bg-orange-500 hover:bg-orange-400 text-white px-8 py-3 rounded-lg font-bold transition"
            >
              Book Table
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-black/50 border border-yellow-500/40 rounded-lg p-6 hover:border-yellow-500/80 transition">
            <div className="text-4xl mb-3">👨‍🍳</div>
            <h3 className="font-semibold mb-2 text-yellow-300">Chef's Specials</h3>
            <p className="text-gray-400 text-sm">
              Paneer Butter Masala, Chicken Tikka, Hyderabadi Biryani and signature desserts.
            </p>
          </div>
          <div className="bg-black/50 border border-yellow-500/40 rounded-lg p-6 hover:border-yellow-500/80 transition">
            <div className="text-4xl mb-3">👨‍👩‍👧‍👦</div>
            <h3 className="font-semibold mb-2 text-yellow-300">Family Friendly</h3>
            <p className="text-gray-400 text-sm">
              Perfect place for family dinners, parties and celebrations.
            </p>
          </div>
          <div className="bg-black/50 border border-yellow-500/40 rounded-lg p-6 hover:border-yellow-500/80 transition">
            <div className="text-4xl mb-3">📱</div>
            <h3 className="font-semibold mb-2 text-yellow-300">Easy Booking</h3>
            <p className="text-gray-400 text-sm">
              Book your table online and confirm via WhatsApp or email.
            </p>
          </div>
          <div className="bg-black/50 border border-yellow-500/40 rounded-lg p-6 hover:border-yellow-500/80 transition">
            <div className="text-4xl mb-3">✨</div>
            <h3 className="font-semibold mb-2 text-yellow-300">Premium Service</h3>
            <p className="text-gray-400 text-sm">
              Excellent service, comfortable ambience, and hygienic food preparation.
            </p>
          </div>
        </div>

        {/* About Section */}
        <div className="bg-black/70 border border-yellow-500/40 rounded-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-yellow-400 mb-4">About Hotel Chandra Bharti</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <p className="text-gray-300 mb-4 leading-relaxed">
                Hotel Chandra Bharti is a premium dining destination offering authentic Indian cuisine with a modern twist. With years of experience in hospitality, we pride ourselves on delivering exceptional food and service.
              </p>
              <h3 className="text-yellow-300 font-semibold mb-3">Our Facilities:</h3>
              <ul className="text-gray-300 space-y-2">
                <li>✓ Air-conditioned comfortable seating</li>
                <li>✓ Free Wi-Fi throughout the restaurant</li>
                <li>✓ Ample parking space</li>
                <li>✓ Private dining areas</li>
                <li>✓ Catering services available</li>
              </ul>
            </div>
            <div>
              <h3 className="text-yellow-300 font-semibold mb-3">Why Choose Us:</h3>
              <ul className="text-gray-300 space-y-2 mb-6">
                <li>✓ Fresh ingredients, authentic recipes</li>
                <li>✓ Experienced and trained staff</li>
                <li>✓ Hygienic food preparation</li>
                <li>✓ Reasonable prices</li>
                <li>✓ Fast and friendly service</li>
              </ul>
              <div className="mt-6">
                <p className="text-yellow-300 font-semibold mb-2">📍 Location</p>
                <p className="text-gray-300">
                  Jainamore Bokaro Near Water Tank "829301". Open from 10 AM to 1 AM, seven days a week.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-orange-500/20 to-yellow-500/20 border border-orange-500/40 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-yellow-300 mb-4">
            What are you waiting for?
          </h2>
          <p className="text-gray-300 mb-6">
            {isLoggedIn
              ? "Browse our delicious menu and place your order now!"
              : "Create an account to start ordering and booking tables!"}
          </p>
          {!isLoggedIn && (
            <Link
              to="/signup"
              className="bg-yellow-500 hover:bg-yellow-400 text-black px-8 py-3 rounded-lg font-bold transition inline-block"
            >
              Get Started Free
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}
