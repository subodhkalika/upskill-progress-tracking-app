import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  BookOpen, 
  ArrowRight,
  Github,
  Chrome
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { Checkbox } from './ui/checkbox';

export function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      await login({ email, password });
      navigate('/');
    } catch (err) {
      setError('Invalid email or password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row">
      {/* Left Panel - Hidden on mobile */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-600 to-indigo-700 p-8 lg:p-12 flex-col justify-center text-white">
        <div className="max-w-lg">
          <div className="flex items-center space-x-3 mb-8">
            <div className="p-2 bg-white/20 rounded-lg">
              <BookOpen className="w-8 h-8" />
            </div>
            <span className="text-2xl font-semibold">LearnSpace</span>
          </div>
          
          <h1 className="text-4xl font-bold mb-6 leading-tight">
            Welcome back to your learning journey
          </h1>
          
          <p className="text-xl text-indigo-100 mb-8 leading-relaxed">
            Continue building your skills with personalized roadmaps, progress tracking, and a comprehensive resource library.
          </p>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-white/60 rounded-full"></div>
              <span className="text-indigo-100">Track your learning progress across multiple skills</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-white/60 rounded-full"></div>
              <span className="text-indigo-100">Access curated resources and learning materials</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-white/60 rounded-full"></div>
              <span className="text-indigo-100">Build structured learning roadmaps for your goals</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-4 lg:p-8">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="p-2 bg-indigo-600 rounded-lg">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-semibold text-foreground">LearnSpace</span>
            </div>
            <p className="text-muted-foreground">Welcome back to your learning journey</p>
          </div>

          <Card className="border-0 shadow-lg lg:border lg:shadow-md">
            <CardHeader className="space-y-2 text-center lg:text-left">
              <CardTitle className="text-2xl font-semibold text-foreground">
                Sign in to your account
              </CardTitle>
              <p className="text-muted-foreground">
                Enter your credentials to access your dashboard
              </p>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="alex@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember"
                      checked={rememberMe}
                      onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                    />
                    <Label htmlFor="remember" className="text-sm">Remember me</Label>
                  </div>
                  <Button variant="link" className="p-0 h-auto text-sm">
                    Forgot password?
                  </Button>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-indigo-600 hover:bg-indigo-700" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                      <span>Signing in...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <span>Sign in</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  )}
                </Button>
              </form>

              <div className="space-y-4">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="w-full">
                    <Github className="w-4 h-4 mr-2" />
                    GitHub
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Chrome className="w-4 h-4 mr-2" />
                    Google
                  </Button>
                </div>
              </div>

              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Don't have an account?{' '}
                  <Link 
                    to="/signup"
                    className="font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    Sign up now
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              By signing in, you agree to our{' '}
              <Button variant="link" className="p-0 h-auto text-xs">Terms of Service</Button>
              {' '}and{' '}
              <Button variant="link" className="p-0 h-auto text-xs">Privacy Policy</Button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}