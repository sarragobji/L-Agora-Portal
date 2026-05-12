import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

export default function Homepage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-gray-900">Welcome to L'Agora Portal</CardTitle>
          <CardDescription className="text-lg text-gray-600">
            Your gateway to community discussions and connections
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-gray-700">
            Join our platform to share ideas, engage in meaningful conversations, and connect with like-minded individuals.
          </p>
          <div className="flex flex-col space-y-2">
            <Link to="/login">
              <Button className="w-full">Login</Button>
            </Link>
            <Link to="/register">
              <Button variant="outline" className="w-full">Sign Up</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}