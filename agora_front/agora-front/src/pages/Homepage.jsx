import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import {
  Field,
  FieldGroup,
  FieldLabel,
} from '../components/ui/field';
import agoraImage from '../assets/register_img.png';

export default function Homepage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className={cn("flex flex-col gap-6 w-full max-w-2xl")}>
        <Card className="overflow-hidden p-0">
          <CardContent className="grid p-0 md:grid-cols-2">
            <img
              src={agoraImage}
              alt="L'Agora Portal"
              className="hidden md:block object-cover"
            />
            <div className="p-6 md:p-8 flex flex-col justify-center">
              <FieldGroup>
                <div className="flex flex-col items-center gap-2 text-center mb-6">
                  <h1 className="text-3xl font-bold text-gray-900">Welcome to L'Agora</h1>
                  <p className="text-sm text-balance text-muted-foreground">
                    Your gateway to community discussions and connections
                  </p>
                </div>

                <Field>
                  <p className="text-center text-gray-700 text-sm leading-relaxed">
                    Join our platform to share ideas, engage in meaningful conversations, and connect with like-minded individuals in our thriving community.
                  </p>
                </Field>

                <div className="flex flex-col gap-3 pt-4">
                  <Link to="/login" className="w-full">
                    <Button className="w-full">Login</Button>
                  </Link>
                  <Link to="/register" className="w-full">
                    <Button variant="outline" className="w-full">Create Account</Button>
                  </Link>
                </div>
              </FieldGroup>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}