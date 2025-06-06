
import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 flex items-center justify-center">
      <div className="text-center text-white p-8">
        <h1 className="text-8xl font-bold mb-4 titan-one-light">404</h1>
        <h2 className="text-3xl font-bold mb-4 titan-one-light">Page Not Found</h2>
        <p className="text-xl mb-8 titan-one-light">The page you're looking for doesn't exist.</p>
        <Link 
          to="/"
          className="bg-white text-orange-600 px-8 py-3 rounded-2xl font-bold hover:bg-orange-100 transition-colors titan-one-light inline-block"
        >
          Go Home
        </Link>
      </div>
    </div>
  )
}
