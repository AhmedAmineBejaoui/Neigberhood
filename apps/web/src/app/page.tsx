import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Welcome to Neighborhood Hub
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Connect with your neighbors, share updates, and build a stronger community together.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/login" 
              className="btn-primary text-lg px-8 py-3"
            >
              Sign In
            </Link>
            <Link 
              href="/join" 
              className="btn-secondary text-lg px-8 py-3"
            >
              Join Community
            </Link>
          </div>
        </div>

        <div className="mt-20 grid md:grid-cols-3 gap-8">
          <div className="card text-center">
            <div className="text-4xl mb-4">🏘️</div>
            <h3 className="text-xl font-semibold mb-2">Community</h3>
            <p className="text-gray-600">
              Join your neighborhood community and stay connected with neighbors.
            </p>
          </div>
          
          <div className="card text-center">
            <div className="text-4xl mb-4">📢</div>
            <h3 className="text-xl font-semibold mb-2">Updates</h3>
            <p className="text-gray-600">
              Share announcements, events, and important information with your community.
            </p>
          </div>
          
          <div className="card text-center">
            <div className="text-4xl mb-4">🤝</div>
            <h3 className="text-xl font-semibold mb-2">Services</h3>
            <p className="text-gray-600">
              Offer and request services, trade items, and help each other out.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
