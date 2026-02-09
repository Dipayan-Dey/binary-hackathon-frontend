import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, Github, Linkedin, AlertCircle, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { Logo } from '../components/Logo';
import { HexagonPattern, DotPattern } from '../components/BackgroundPatterns';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('Invalid credentials (This is a mock)');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 relative overflow-hidden">
            {/* Layered Backgrounds */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-slate-950 to-purple-950"></div>
            <HexagonPattern />
            <DotPattern />
            
            {/* Glowing Orbs */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>

            {/* Back to Home Link */}
            <Link to="/" className="absolute top-6 left-6 z-50 flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                <ArrowLeft className="w-5 h-5" />
                <span className="hidden sm:inline">Back to Home</span>
            </Link>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md relative z-10"
            >
                {/* Premium Card with Glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur-2xl opacity-20"></div>
                
                <div className="relative bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-10 border border-slate-800/50">
                    {/* Logo */}
                    <div className="flex justify-center mb-8">
                        <Link to="/">
                            <Logo className="w-16 h-16" textClassName="text-2xl" />
                        </Link>
                    </div>

                    <div className="text-center mb-8">
                        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Welcome Back</h1>
                        <p className="text-slate-400">Login to continue your career journey</p>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-6 bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-xl flex items-center gap-2 text-sm"
                        >
                            <AlertCircle size={16} />
                            {error}
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                                <input 
                                    type="email" 
                                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-700 bg-slate-800/50 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
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
                                    className="w-full pl-12 pr-12 py-3.5 rounded-xl border border-slate-700 bg-slate-800/50 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
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
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input type="checkbox" className="rounded border-slate-600 bg-slate-800/50 text-blue-600 focus:ring-blue-500/20 cursor-pointer" />
                                <span className="text-slate-400 group-hover:text-slate-300 transition-colors">Remember me</span>
                            </label>
                            <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors font-medium">Forgot password?</a>
                        </div>

                        <button className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-[1.02]">
                            Login to Dashboard
                        </button>
                    </form>

                    <div className="my-6 flex items-center text-slate-500 text-sm">
                        <div className="flex-1 border-t border-slate-800"></div>
                        <span className="px-4">Or continue with</span>
                        <div className="flex-1 border-t border-slate-800"></div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <button className="flex items-center justify-center gap-2 py-3 border border-slate-700 bg-slate-800/30 rounded-xl hover:bg-slate-800/50 transition-all text-slate-300 font-medium group">
                            <Github size={20} className="group-hover:scale-110 transition-transform" /> GitHub
                        </button>
                        <button className="flex items-center justify-center gap-2 py-3 border border-slate-700 bg-slate-800/30 rounded-xl hover:bg-slate-800/50 transition-all text-blue-400 font-medium group">
                            <Linkedin size={20} className="group-hover:scale-110 transition-transform" /> LinkedIn
                        </button>
                    </div>

                    <p className="text-center mt-8 text-slate-400 text-sm">
                        Don't have an account? <Link to="/signup" className="text-blue-400 font-semibold hover:text-blue-300 transition-colors">Sign up for free</Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default LoginPage;
