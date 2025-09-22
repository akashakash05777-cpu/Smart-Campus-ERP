import React, { useState } from 'react';
import { Eye, EyeOff, User, Lock, AlertCircle, School, GraduationCap, Users, UserCheck } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const { authenticateUser } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    userType: 'student'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState('');
  
  // Role-based configuration
  const roleConfig = {
    student: {
      title: 'Student Portal',
      icon: GraduationCap,
      color: 'from-green-50 to-emerald-100',
      buttonColor: 'bg-green-600 hover:bg-green-700',
      placeholder: 'Student ID or Email'
    },
    staff: {
      title: 'Staff Portal',
      icon: Users,
      color: 'from-purple-50 to-violet-100',
      buttonColor: 'bg-purple-600 hover:bg-purple-700',
      placeholder: 'Staff ID or Email'
    },
    admin: {
      title: 'Admin Portal',
      icon: UserCheck,
      color: 'from-blue-50 to-indigo-100',
      buttonColor: 'bg-blue-600 hover:bg-blue-700',
      placeholder: 'Admin ID or Email'
    }
  };

  const currentRole = roleConfig[formData.userType];

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.username.trim()) {
      newErrors.username = `${currentRole.placeholder} is required`;
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateForgotPasswordForm = () => {
    if (!forgotPasswordEmail.trim()) {
      return 'Email is required';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(forgotPasswordEmail)) {
      return 'Please enter a valid email address';
    }
    return null;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    // Clear login error when user modifies input
    if (loginError) {
      setLoginError('');
    }
  };

  const handleRoleChange = (userType) => {
    setFormData(prev => ({ ...prev, userType }));
    setErrors({});
    setLoginError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setLoginError('');

    try {
      // Use unified authentication system
      const result = await authenticateUser({
        username: formData.username,
        password: formData.password,
        userType: formData.userType
      });
      
      if (!result.success) {
        setLoginError(result.message || 'Invalid credentials. Please try again.');
      }
      // Success is handled by the AuthContext
    } catch (error) {
      console.error('Login error:', error);
      setLoginError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    
    const validationError = validateForgotPasswordForm();
    if (validationError) {
      setForgotPasswordMessage(validationError);
      return;
    }

    setIsLoading(true);
    setForgotPasswordMessage('');

    try {
      // Simulate password reset request
      await new Promise(resolve => setTimeout(resolve, 2000));
      setForgotPasswordMessage('Password reset instructions have been sent to your email.');
      setTimeout(() => {
        setShowForgotPassword(false);
        setForgotPasswordEmail('');
        setForgotPasswordMessage('');
      }, 3000);
    } catch (error) {
      setForgotPasswordMessage('Failed to send reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${currentRole.color} flex items-center justify-center p-4`}>
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className={`${currentRole.buttonColor.split(' ')[0]} p-3 rounded-full`}>
              {React.createElement(currentRole.icon, { className: "h-8 w-8 text-white" })}
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">SmartCampus</h1>
          <p className="text-gray-600">{currentRole.title}</p>
        </div>

        {/* Login Card */}
        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-semibold text-center">Welcome Back</CardTitle>
            <CardDescription className="text-center">
              Select your role and enter your credentials
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!showForgotPassword ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Role Selection */}
                <div className="space-y-2">
                  <Label>Select Your Role</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {Object.entries(roleConfig).map(([key, config]) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => handleRoleChange(key)}
                        className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                          formData.userType === key
                            ? `${config.buttonColor} text-white border-transparent`
                            : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
                        }`}
                        disabled={isLoading}
                      >
                        <div className="flex flex-col items-center space-y-1">
                          {React.createElement(config.icon, { className: "h-5 w-5" })}
                          <span className="text-xs font-medium">
                            {key.charAt(0).toUpperCase() + key.slice(1)}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              {/* Login Error Alert */}
              {loginError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{loginError}</AlertDescription>
                </Alert>
              )}

                {/* Username Field */}
                <div className="space-y-2">
                  <Label htmlFor="username">{currentRole.placeholder}</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="username"
                      type="text"
                      placeholder={`Enter your ${currentRole.placeholder}`}
                      value={formData.username}
                      onChange={(e) => handleInputChange('username', e.target.value)}
                      className={`pl-10 ${errors.username ? 'border-red-500' : ''}`}
                      disabled={isLoading}
                    />
                  </div>
                  {errors.username && (
                    <p className="text-sm text-red-500">{errors.username}</p>
                  )}
                </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className={`pl-10 pr-10 ${errors.password ? 'border-red-500' : ''}`}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password}</p>
                )}
              </div>

                {/* Forgot Password Link */}
                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-sm text-gray-600 hover:text-gray-800 underline"
                    disabled={isLoading}
                  >
                    Forgot Password?
                  </button>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className={`w-full ${currentRole.buttonColor}`}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Signing In...
                    </div>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </form>
            ) : (
              /* Forgot Password Form */
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div className="text-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Reset Password</h3>
                  <p className="text-sm text-gray-600">Enter your email to receive reset instructions</p>
                </div>

                {forgotPasswordMessage && (
                  <Alert className={forgotPasswordMessage.includes('sent') ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
                    <AlertCircle className={`h-4 w-4 ${forgotPasswordMessage.includes('sent') ? 'text-green-600' : 'text-red-600'}`} />
                    <AlertDescription className={forgotPasswordMessage.includes('sent') ? 'text-green-700' : 'text-red-700'}>
                      {forgotPasswordMessage}
                    </AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="forgotEmail">Email Address</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="forgotEmail"
                      type="email"
                      placeholder="Enter your email address"
                      value={forgotPasswordEmail}
                      onChange={(e) => setForgotPasswordEmail(e.target.value)}
                      className="pl-10"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="flex space-x-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setShowForgotPassword(false);
                      setForgotPasswordEmail('');
                      setForgotPasswordMessage('');
                    }}
                    disabled={isLoading}
                  >
                    Back to Login
                  </Button>
                  <Button
                    type="submit"
                    className={`flex-1 ${currentRole.buttonColor}`}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Sending...
                      </div>
                    ) : (
                      'Send Reset Link'
                    )}
                  </Button>
                </div>
              </form>
            )}

            {/* Demo Credentials */}
            {!showForgotPassword && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Demo Credentials:</h4>
                <div className="text-xs text-gray-600 space-y-1">
                  <p><strong>Student:</strong> STU001 / student123</p>
                  <p><strong>Staff:</strong> STAFF001 / staff123</p>
                  <p><strong>Admin:</strong> ADMIN001 / admin123</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-gray-500">
          <p>© 2024 SmartCampus. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;