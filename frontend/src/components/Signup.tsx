import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User, 
  BookOpen, 
  ArrowRight,
  Github,
  Chrome,
  Check
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { Checkbox } from './ui/checkbox';
import { apiClient } from '../utils/api';

export function Signup() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(formData.password);
  const passwordsMatch = formData.password === formData.confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedToTerms) return;
    
    setIsLoading(true);
    setError(null);

    try {
      await apiClient.post('/api/auth/signup', {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        password: formData.password,
      });
      // After successful signup, log the user in
      const response = await apiClient.post('/api/auth/login', {
        email: formData.email,
        password: formData.password,
      });
      if (response.accessToken) {
        localStorage.setItem('accessToken', response.accessToken);
        login();
        navigate('/');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred during signup.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row">
      {/* Left Panel - Hidden on mobile */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-600 to-emerald-700 p-8 lg:p-12 flex-col justify-center text-white">
        <div className="max-w-lg">
          <div className="flex items-center space-x-3 mb-8">
            <div className="p-2 bg-white/20 rounded-lg">
              <BookOpen className="w-8 h-8" />
            </div>
            <span className="text-2xl font-semibold">LearnSpace</span>
          </div>
          
          <h1 className="text-4xl font-bold mb-6 leading-tight">
            Start your learning journey today
          </h1>
          
          <p className="text-xl text-green-100 mb-8 leading-relaxed">
            Join thousands of learners who are advancing their careers with structured, personalized learning paths.
          </p>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="p-1 bg-white/20 rounded-full">
                <Check className="w-4 h-4" />
              </div>
              <span className="text-green-100">Create personalized learning roadmaps</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="p-1 bg-white/20 rounded-full">
                <Check className="w-4 h-4" />
              </div>
              <span className="text-green-100">Track progress with detailed analytics</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="p-1 bg-white/20 rounded-full">
                <Check className="w-4 h-4" />
              </div>
              <span className="text-green-100">Access a comprehensive resource library</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="p-1 bg-white/20 rounded-full">
                <Check className="w-4 h-4" />
              </div>
              <span className="text-green-100">Organize tasks and set learning goals</span>
            </div>
          </div>

          <div className="mt-8 p-4 bg-white/10 rounded-lg">
            <p className="text-sm text-green-100">
              <strong>Free forever.</strong> Start with all core features included. 
              Upgrade anytime for advanced analytics and unlimited roadmaps.
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel - Signup Form */}
      <div className="flex-1 flex items-center justify-center p-4 lg:p-8">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="p-2 bg-green-600 rounded-lg">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-semibold text-foreground">LearnSpace</span>
            </div>
            <p className="text-muted-foreground">Start your learning journey today</p>
          </div>

          <Card className="border-0 shadow-lg lg:border lg:shadow-md">
            <CardHeader className="space-y-2 text-center lg:text-left">
              <CardTitle className="text-2xl font-semibold text-foreground">
                Create your account
              </CardTitle>
              <p className="text-muted-foreground">
                Get started with your personalized learning experience
              </p>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {error && <p className="text-red-500 text-sm text-center">{error}</p>}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        id="firstName"
                        type="text"
                        placeholder="Alex"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last name</Label>
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="Johnson"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="alex@example.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
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
                      placeholder="Create a strong password"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
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
                  
                  {formData.password && (
                    <div className="space-y-2">
                      <div className="flex space-x-1">
                        {[1, 2, 3, 4, 5].map((level) => (
                          <div
                            key={level}
                            className={`h-1 flex-1 rounded-full ${
                              level <= passwordStrength
                                ? passwordStrength <= 2
                                  ? 'bg-red-500'
                                  : passwordStrength <= 4
                                  ? 'bg-yellow-500'
                                  : 'bg-green-500'
                                : 'bg-muted'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {passwordStrength <= 2 && 'Weak password'}
                        {passwordStrength === 3 && 'Medium password'}
                        {passwordStrength === 4 && 'Strong password'}
                        {passwordStrength === 5 && 'Very strong password'}
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      className="pl-10 pr-10"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                  {formData.confirmPassword && !passwordsMatch && (
                    <p className="text-xs text-red-600">Passwords don't match</p>
                  )}
                  {formData.confirmPassword && passwordsMatch && formData.password.length > 0 && (
                    <p className="text-xs text-green-600">Passwords match</p>
                  )}
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="terms"
                    checked={agreedToTerms}
                    onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                    className="mt-1"
                  />
                  <div className="text-sm text-muted-foreground">
                    <Label htmlFor="terms" className="font-normal">
                      I agree to the{' '}
                      <Button variant="link" className="p-0 h-auto text-sm">Terms of Service</Button>
                      {' '}and{' '}
                      <Button variant="link" className="p-0 h-auto text-sm">Privacy Policy</Button>
                    </Label>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-green-600 hover:bg-green-700" 
                  disabled={isLoading || !agreedToTerms || !passwordsMatch || passwordStrength < 3}
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                      <span>Creating account...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <span>Create account</span>
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
                    <span className="bg-background px-2 text-muted-foreground">Or sign up with</span>
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
                  Already have an account?{' '}
                  <Link 
                    to="/login"
                    className="font-medium text-green-600 hover:text-green-500"
                  >
                    Sign in now
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Security Note */}
          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              🔒 Your data is encrypted and secure. We never share your information with third parties.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
