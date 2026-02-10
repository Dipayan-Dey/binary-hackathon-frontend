import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, ArrowLeft, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { Logo } from '../components/Logo';
import { TopographyPattern, WavePattern } from '../components/BackgroundPatterns';
import { signupUser } from '../api/authApi';

const SignupPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate passwords match
        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }
        
        setLoading(true);
        try {
            const res = await signupUser(formData);
            toast.success(res.message || 'Account created successfully!');
            navigate('/login');
        } catch (error) {
            console.error('Signup error:', error);
            const errorMessage = error?.response?.data?.message || 
                                error?.message || 
                                'Failed to create account. Please try again.';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const passwordStrength = formData.password.length > 0 ? 
        formData.password.length < 6 ? 'weak' : 
        formData.password.length < 10 ? 'medium' : 'strong' : null;

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 py-12 relative overflow-hidden">
            {/* Layered Backgrounds */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-950 via-slate-950 to-blue-950"></div>
            <TopographyPattern />
            <WavePattern />
            
            {/* Glowing Orbs */}
            <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>

            {/* Back to Home Link */}
            <Link to="/" className="absolute top-6 left-6 z-50 flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                <ArrowLeft className="w-5 h-5" />
                <span className="hidden sm:inline">Back to Home</span>
            </Link>

            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md relative z-10"
            >
                {/* Premium Card with Glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl blur-2xl opacity-20"></div>
                
                <div className="relative bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-10 border border-slate-800/50">
                    {/* Logo */}
                    <div className="flex justify-center mb-8">
                        <Link to="/">
                            <Logo className="w-16 h-16" textClassName="text-2xl" />
                        </Link>
                    </div>

                    <div className="text-center mb-8">
                        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Create Account</h1>
                        <p className="text-slate-400">Start your industry readiness journey today</p>
                    </div>

                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                                <input 
                                    type="text"
                                    name="name"
                                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-700 bg-slate-800/50 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                                    placeholder="John Doe"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                                <input 
                                    type="email"
                                    name="email"
                                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-700 bg-slate-800/50 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                                    placeholder="you@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                                <input 
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    className="w-full pl-12 pr-12 py-3.5 rounded-xl border border-slate-700 bg-slate-800/50 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                            {passwordStrength && (
                                <div className="mt-2 flex gap-1">
                                    <div className={`h-1 flex-1 rounded ${passwordStrength === 'weak' ? 'bg-red-500' : passwordStrength === 'medium' ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
                                    <div className={`h-1 flex-1 rounded ${passwordStrength === 'medium' || passwordStrength === 'strong' ? passwordStrength === 'medium' ? 'bg-yellow-500' : 'bg-green-500' : 'bg-slate-700'}`}></div>
                                    <div className={`h-1 flex-1 rounded ${passwordStrength === 'strong' ? 'bg-green-500' : 'bg-slate-700'}`}></div>
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Confirm Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                                <input 
                                    type={showConfirmPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    className="w-full pl-12 pr-12 py-3.5 rounded-xl border border-slate-700 bg-slate-800/50 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                                    placeholder="••••••••"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                                >
                                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                         <div className="p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl border border-blue-500/30">
                            <label className="flex items-start gap-3 cursor-pointer group">
                                <div className="mt-1">
                                    <input type="checkbox" defaultChecked className="rounded border-blue-500/30 bg-slate-800/50 text-blue-600 focus:ring-blue-500/20 cursor-pointer" />
                                </div>
                                <div className="text-sm">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-semibold text-blue-300">AI Career Analysis</span>
                                        <Check className="w-4 h-4 text-green-400" />
                                    </div>
                                    <p className="text-blue-400/70">Allow AI to scan your public profiles for personalized skill gap analysis and career recommendations.</p>
                                </div>
                            </label>
                        </div>

                        <button 
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        >
                            {loading ? 'Creating Account...' : 'Create Account'}
                        </button>
                    </form>

                    <p className="text-center mt-8 text-slate-400 text-sm">
                        Already have an account? <Link to="/login" className="text-blue-400 font-semibold hover:text-blue-300 transition-colors">Login here</Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default SignupPage;
