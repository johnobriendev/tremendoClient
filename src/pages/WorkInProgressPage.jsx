import {Link} from 'react-router-dom'
import { AlertCircle } from 'lucide-react'

const WorkInProgress = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-300">
      <div className="max-w-md w-full space-y-8 p-8 bg-white shadow-lg rounded-lg">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-yellow-400" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Work in Progress</h2>
          <p className="mt-2 text-sm text-gray-600">
            We're sorry, but this page is still under construction. Our team is working hard to bring you great content soon!
          </p>
        </div>
        <div className="mt-8">
          <Link
            to="/"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  )
}

export default WorkInProgress