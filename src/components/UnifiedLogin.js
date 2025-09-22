import React, { useState } from 'react';
import { Eye, EyeOff, User, Lock, AlertCircle, GraduationCap, Users, ShieldCheck } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { useAuth } from '../contexts/AuthContext';

const UnifiedLogin = () => {
  const { authenticateUser } = useAuth();
  
  // User type selection
  const [currentRole, setCurrentRole] = useState({
    key: 'student',
    placeholder: 'Student ID',
    title: 'Student Login',
    description: 'Enter your credentials to access the student portal',
    bgGradient: 'from-green-50 to-emerald-100',
    iconBg: 'bg-green-600',
    icon: <GraduationCap className="h-8 w-8 text-white" />,
    buttonColor: 'bg-green-600 hover:bg-green-700 text-white'
  });

  // Role configurations
  const roleConfigs = {
    student: {
      key: 'student',
      placeholder: 'Student ID',
      title: 'Student Login',
      description: 'Enter your credentials to access the student portal',
      bgGradient: 'from-green-50 to-emerald-100',
      iconBg: 'bg-green-600',
      icon: <GraduationCap className="h-8 w-8 text-white" />,
      buttonColor: 'bg-green-600 hover:bg-green-700 text-white'
    },
    staff: {
      key: 'staff',
      placeholder: 'Staff ID',
      title: 'Staff Login',
      description: 'Enter your credentials to access the staff portal',
      bgGradient: 'from-blue-50 to-indigo-100',
      iconBg: 'bg-blue-600',
      icon: <Users className="h-8 w-8 text-white" />,
      buttonColor: 'bg-blue-600 hover:bg-blue-700 text-white'
    },
    admin: {
      key: 'admin',
      placeholder: 'Admin ID',
      title: 'Admin Login',
      description: 'Enter your credentials to access the admin portal',
      bgGradient: 'from-red-50 to-rose-100',
      iconBg: 'bg-red-600',
      icon: <ShieldCheck className="h-8 w-8 text-white" />,
      buttonColor: 'bg-red-600 hover:bg-red-700 text-white'
    }
  };

  // Form state
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  
  // Forgot password state
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState('');

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
        userType: currentRole.key
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
    
    if (!forgotPasswordEmail.trim()) {
      setForgotPasswordMessage('Please enter your email address');
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate password reset email
      await new Promise(resolve => setTimeout(resolve, 1500));
      setForgotPasswordMessage(`Password reset link sent to ${forgotPasswordEmail}. Please check your inbox.`);
    } catch (error) {
      console.error('Forgot password error:', error);
      setForgotPasswordMessage('Failed to send reset link. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleChange = (roleKey) => {
    setCurrentRole(roleConfigs[roleKey]);
    setFormData({ username: '', password: '' });
    setErrors({});
    setLoginError('');
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${currentRole.bgGradient} flex items-center justify-center p-4`}>
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className={currentRole.iconBg + " p-3 rounded-full"}>
              {currentRole.icon}
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">SmartCampus</h1>
          <p className="text-gray-600">{currentRole.title}</p>
        </div>

        {/* Login Card */}
        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-semibold text-center">Welcome</CardTitle>
            <CardDescription className="text-center">
              {currentRole.description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Role Selection */}
            <div className="mb-6">
              <div className="text-sm font-medium text-gray-700 mb-2">Select User Type:</div>
              <div className="flex space-x-2">
                {Object.entries(roleConfigs).map(([key, config]) => (
                  <button
                    key={key}
                    onClick={() => handleRoleChange(key)}
                    className={`flex-1 py-2 px-3 rounded-md flex items-center justify-center transition-colors ${currentRole.key === key ? config.buttonColor : 'bg-gray-100 hover:bg-gray-200 text-gray-800'}`}
                    disabled={isLoading}
                  >
                    <div className="flex flex-col items-center">
                      <span className={`text-xs font-medium ${currentRole.key === key ? 'text-white' : 'text-gray-700'}`}>
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {!showForgotPassword ? (
              /* Login Form */
              <form onSubmit={handleSubmit} className="space-y-4">
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

export default UnifiedLogin;