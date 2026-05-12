import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

export default function UnderConstruction() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-t-4 border-t-amber-500 shadow-xl">
        <CardHeader className="text-center pb-2">
          {/* Under Construction Badge */}
          <div className="mx-auto w-fit px-3 py-1 mb-4 text-xs font-semibold uppercase tracking-wider text-amber-700 bg-amber-100 rounded-full border border-amber-200">
            🚧 Under Construction
          </div>
          
          <CardTitle className="text-4xl font-extrabold text-gray-900 tracking-tight">
            L'Agora Portal
          </CardTitle>
          <CardDescription className="text-lg text-gray-600 mt-2">
            Our digital space is being remodeled.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-2">
            <p className="text-center text-gray-700 leading-relaxed">
              We are currently building out new features to enhance your community experience. 
              The portal will be fully functional again shortly.
            </p>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-gray-500 font-medium">
              <span>System Rebuild</span>
              <span>85%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-amber-500 h-2 rounded-full w-[85%] transition-all duration-1000"></div>
            </div>
          </div>

          <div className="flex flex-col space-y-3 pt-2">
            <Link to="/login">
              <Button className="w-full h-11 bg-gray-900 hover:bg-black transition-colors">
                Login to Portal
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="outline" className="w-full h-11 border-gray-200 hover:bg-gray-50">
                Register for Access
              </Button>
            </Link>
          </div>
          
          <p className="text-center text-[10px] text-gray-400 uppercase tracking-widest">
            © 2026 Agora Project
          </p>
        </CardContent>
      </Card>
    </div>
  );
}