import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Eye, 
  EyeOff, 
  Lock, 
  Mail, 
  User as UserIcon, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw,
  Sparkles,
  Check,
  ShieldCheck,
  Cpu,
  Fingerprint,
  Zap
} from 'lucide-react';
import { AuthService, evaluatePasswordStrength } from '../services/auth';
import { User } from '../types';

interface AuthViewProps {
  onAuthenticated: (user: User) => void;
  initialMode?: 'login' | 'register';
  apiUrl: string;
  isBackendOnline: boolean;
}

const STORAGE_KEY_REMEMBER_EMAIL = 'trustshield_remember_email';
const STORAGE_KEY_REMEMBER_FLAG = 'trustshield_remember_flag';

export const AuthView: React.FC<AuthViewProps> = ({
  onAuthenticated,
  initialMode = 'login',
  isBackendOnline,
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Visibility toggles
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Status & Feedback
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);
  const [forgotPasswordModal, setForgotPasswordModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);

  // Load remembered email on mount
  useEffect(() => {
    try {
      const savedFlag = localStorage.getItem(STORAGE_KEY_REMEMBER_FLAG);
      const savedEmail = localStorage.getItem(STORAGE_KEY_REMEMBER_EMAIL);
      if (savedFlag === 'true' && savedEmail) {
        setRememberMe(true);
        setEmail(savedEmail);
      }
    } catch {
      // LocalStorage might be disabled in private browsing
    }
  }, []);

  // Password strength calculation
  const strength = evaluatePasswordStrength(password);

  const resetFormState = () => {
    setErrorMessage(null);
    setSuccessNotice(null);
    setPassword('');
    setConfirmPassword('');
  };

  const handleSwitchMode = (newMode: 'login' | 'register') => {
    resetFormState();
    setMode(newMode);
  };

  // Fast pre-fill for demo accounts
  const handleQuickFillDemo = (type: 'anushka' | 'demo') => {
    resetFormState();
    if (type === 'anushka') {
      setEmail('anushka@trustshield.ai');
      setPassword('Protect@2025');
    } else {
      setEmail('demo@trustshield.ai');
      setPassword('TrustShield@2025');
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessNotice(null);

    const cleanEmail = email.trim();
    if (!cleanEmail || !password) {
      setErrorMessage('Please enter both your email address and password.');
      return;
    }

    setLoading(true);
    try {
      const res = await AuthService.login({ email: cleanEmail, password });

      // Handle remember me preference
      try {
        if (rememberMe) {
          localStorage.setItem(STORAGE_KEY_REMEMBER_FLAG, 'true');
          localStorage.setItem(STORAGE_KEY_REMEMBER_EMAIL, cleanEmail);
        } else {
          localStorage.removeItem(STORAGE_KEY_REMEMBER_FLAG);
          localStorage.removeItem(STORAGE_KEY_REMEMBER_EMAIL);
        }
      } catch {
        // Ignore storage exceptions
      }

      setSuccessNotice(res.message || 'Login successful!');
      setTimeout(() => {
        onAuthenticated(res.user);
      }, 400);
    } catch (err: unknown) {
      setErrorMessage((err as Error).message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessNotice(null);

    const cleanName = name.trim();
    const cleanEmail = email.trim();

    if (!cleanName) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setErrorMessage('Please enter a valid corporate or personal email address.');
      return;
    }
    if (password.length < 8) {
      setErrorMessage('Password must contain at least 8 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please verify both entries.');
      return;
    }
    if (!agreeTerms) {
      setErrorMessage('You must acknowledge and agree to the Terms of Service & Privacy Policy.');
      return;
    }

    setLoading(true);
    try {
      const res = await AuthService.register({ name: cleanName, email: cleanEmail, password });
      setSuccessNotice('Account created and secured. Redirecting to your dashboard...');
      setTimeout(() => {
        onAuthenticated(res.user);
      }, 500);
    } catch (err: unknown) {
      setErrorMessage((err as Error).message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setForgotSuccess(true);
    setTimeout(() => {
      setForgotPasswordModal(false);
      setForgotSuccess(false);
      setForgotEmail('');
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-white text-[#242033] grid grid-cols-1 lg:grid-cols-12 select-none relative font-sans">
      
      {/* ======================================================== */}
      {/* LEFT COLUMN: AUTHENTICATION FORM (5 cols on lg)          */}
      {/* Clean, premium Light Theme: #FFFFFF, #F8F7FC, #242033    */}
      {/* ======================================================== */}
      <div className="lg:col-span-5 xl:col-span-5 flex flex-col justify-between p-6 sm:p-10 lg:p-12 xl:p-14 z-10 bg-white">
        
        {/* Brand Header */}
        <div className="flex items-center justify-between pb-6 sm:pb-8 border-b border-[#E5E1EB]/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F3E8FF] border border-[#E9D5FF] p-2 flex items-center justify-center text-[#A855F7] shadow-sm shadow-[#A855F7]/10">
              <Shield className="w-5 h-5 text-[#A855F7] fill-[#A855F7]/15" />
            </div>
            <div>
              <div className="font-extrabold text-base text-[#242033] tracking-tight leading-none flex items-center gap-1.5">
                <span>TrustShield</span>
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#F3E8FF] border border-[#E9D5FF] text-[#A855F7]">
                  AI
                </span>
              </div>
              <div className="text-[10px] font-bold text-[#716B80] mt-1 tracking-widest uppercase">
                VERIFY. TRUST. PROTECT.
              </div>
            </div>
          </div>

          {/* Backend Connection Indicator */}
          <div className="flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-full bg-[#F8F7FC] border border-[#E5E1EB] text-[#716B80]">
            <span className={`w-2 h-2 rounded-full ${isBackendOnline ? 'bg-[#16A34A]' : 'bg-[#D97706]'}`} />
            <span>{isBackendOnline ? 'FastAPI Connected' : 'Security Vault Active'}</span>
          </div>
        </div>

        {/* Center Auth Form Container */}
        <div className="max-w-md w-full mx-auto my-auto py-6">
          
          {/* Form Header Titles */}
          <div className="space-y-2 mb-6 text-left">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#A855F7] tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{mode === 'login' ? 'Account Authentication' : 'Investigator Registration'}</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#242033]">
              {mode === 'login' ? 'Welcome back.' : 'Create your account'}
            </h1>
            
            <p className="text-xs sm:text-sm text-[#716B80] leading-relaxed">
              {mode === 'login'
                ? 'Sign in to continue protecting your digital world.'
                : 'Start verifying digital media, detecting deepfakes, and protecting your online presence.'}
            </p>
          </div>

          {/* Alerts: Error & Success notifications */}
          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-xl bg-[#DC2626]/10 border border-[#DC2626]/25 text-[#DC2626] text-xs flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="leading-relaxed font-medium">{errorMessage}</div>
            </div>
          )}

          {successNotice && (
            <div className="mb-5 p-3.5 rounded-xl bg-[#16A34A]/10 border border-[#16A34A]/25 text-[#16A34A] text-xs flex items-center gap-2.5 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <div className="font-medium">{successNotice}</div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 1: LOGIN FORM                                        */}
          {/* ======================================================== */}
          {mode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              
              {/* Email Address */}
              <div>
                <label className="block text-xs font-semibold text-[#242033] mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#716B80] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@organization.com"
                    autoComplete="email"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-white border border-[#E5E1EB] text-xs text-[#242033] placeholder-[#716B80]/50 focus:outline-none focus:border-[#A855F7] focus:ring-1 focus:ring-[#A855F7] transition-all shadow-xs"
                    required
                  />
                </div>
              </div>

              {/* Password with Show/Hide toggle */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-[#242033]">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setForgotPasswordModal(true)}
                    className="text-xs font-medium text-[#A855F7] hover:text-[#7E22CE] transition-colors cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#716B80] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your security password"
                    autoComplete="current-password"
                    className="w-full pl-10 pr-11 py-2.5 rounded-xl bg-white border border-[#E5E1EB] text-xs text-[#242033] placeholder-[#716B80]/50 focus:outline-none focus:border-[#A855F7] focus:ring-1 focus:ring-[#A855F7] transition-all shadow-xs"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#716B80] hover:text-[#242033] transition-colors cursor-pointer"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember me option */}
              <div className="flex items-center gap-2 pt-0.5">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-[#E5E1EB] text-[#A855F7] focus:ring-[#A855F7] h-4 w-4 cursor-pointer accent-[#A855F7]"
                />
                <label htmlFor="rememberMe" className="text-xs text-[#716B80] hover:text-[#242033] transition-colors cursor-pointer select-none">
                  Remember me on this trusted device
                </label>
              </div>

              {/* Primary Submit Button: Signature Digital Violet #A855F7 */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#A855F7] hover:bg-[#7E22CE] disabled:opacity-50 text-white font-semibold text-xs tracking-wide transition-all shadow-sm hover:shadow-md hover:shadow-[#A855F7]/20 active:scale-[0.99] cursor-pointer"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Authenticating credentials...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Log in securely</span>
                    </>
                  )}
                </button>
              </div>

              {/* Switch to Registration Link */}
              <div className="pt-3 text-center text-xs text-[#716B80]">
                New to TrustShield AI?{' '}
                <button
                  type="button"
                  onClick={() => handleSwitchMode('register')}
                  className="font-bold text-[#A855F7] hover:text-[#7E22CE] transition-colors cursor-pointer"
                >
                  Create an account.
                </button>
              </div>

              {/* Quick Fill Demo Credentials Helper */}
              <div className="pt-5 border-t border-[#E5E1EB]/80">
                <div className="flex items-center justify-between text-[11px] text-[#716B80] mb-2 font-medium">
                  <span className="uppercase tracking-wider font-semibold text-[10px]">Instant Demo Accounts:</span>
                  <span className="text-[#16A34A] flex items-center gap-1 font-mono text-[10px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" />
                    Ready to pre-fill
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => handleQuickFillDemo('anushka')}
                    className="p-2.5 rounded-xl bg-[#F8F7FC] border border-[#E5E1EB] hover:border-[#A855F7] hover:bg-[#F3E8FF]/30 text-left transition-all group cursor-pointer shadow-xs"
                  >
                    <div className="text-xs font-bold text-[#242033] group-hover:text-[#A855F7] flex items-center justify-between">
                      <span>Anushka</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#716B80] group-hover:text-[#A855F7] group-hover:translate-x-0.5 transition-transform" />
                    </div>
                    <div className="text-[10px] text-[#716B80] font-mono mt-0.5 truncate">
                      anushka@trustshield.ai
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickFillDemo('demo')}
                    className="p-2.5 rounded-xl bg-[#F8F7FC] border border-[#E5E1EB] hover:border-[#A855F7] hover:bg-[#F3E8FF]/30 text-left transition-all group cursor-pointer shadow-xs"
                  >
                    <div className="text-xs font-bold text-[#242033] group-hover:text-[#A855F7] flex items-center justify-between">
                      <span>Demo User</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#716B80] group-hover:text-[#A855F7] group-hover:translate-x-0.5 transition-transform" />
                    </div>
                    <div className="text-[10px] text-[#716B80] font-mono mt-0.5 truncate">
                      demo@trustshield.ai
                    </div>
                  </button>
                </div>
              </div>

            </form>
          )}

          {/* ======================================================== */}
          {/* TAB 2: REGISTRATION FORM                                 */}
          {/* ======================================================== */}
          {mode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-[#242033] mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-[#716B80] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Anushka Choudhari"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-white border border-[#E5E1EB] text-xs text-[#242033] placeholder-[#716B80]/50 focus:outline-none focus:border-[#A855F7] focus:ring-1 focus:ring-[#A855F7] transition-all shadow-xs"
                    required
                  />
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-semibold text-[#242033] mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#716B80] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@organization.com"
                    autoComplete="email"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-white border border-[#E5E1EB] text-xs text-[#242033] placeholder-[#716B80]/50 focus:outline-none focus:border-[#A855F7] focus:ring-1 focus:ring-[#A855F7] transition-all shadow-xs font-sans"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-[#242033] mb-1">
                  Create Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#716B80] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min. 8 characters with numbers & symbols"
                    className="w-full pl-10 pr-11 py-2.5 rounded-xl bg-white border border-[#E5E1EB] text-xs text-[#242033] placeholder-[#716B80]/50 focus:outline-none focus:border-[#A855F7] focus:ring-1 focus:ring-[#A855F7] transition-all shadow-xs font-sans"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#716B80] hover:text-[#242033] transition-colors cursor-pointer"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Real-time Password Strength Guidance */}
                {password.length > 0 && (
                  <div className="mt-2 space-y-1.5 p-2.5 rounded-xl bg-[#F8F7FC] border border-[#E5E1EB] text-[11px]">
                    <div className="flex items-center justify-between">
                      <span className="text-[#716B80] font-medium">Password Strength:</span>
                      <span className="font-bold text-xs" style={{ color: strength.color }}>
                        {strength.label}
                      </span>
                    </div>

                    <div className="w-full h-1.5 bg-[#E5E1EB] rounded-full overflow-hidden">
                      <div 
                        className="h-full transition-all duration-300 rounded-full"
                        style={{ 
                          width: `${strength.percent}%`,
                          backgroundColor: strength.color 
                        }}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-1 pt-1 text-[10px] text-[#716B80]">
                      <span className={strength.hasMinLength ? 'text-[#16A34A] font-medium flex items-center gap-1' : 'flex items-center gap-1'}>
                        {strength.hasMinLength ? '✓' : '•'} 8+ Characters
                      </span>
                      <span className={(strength.hasUpper && strength.hasLower) ? 'text-[#16A34A] font-medium flex items-center gap-1' : 'flex items-center gap-1'}>
                        {(strength.hasUpper && strength.hasLower) ? '✓' : '•'} Upper & lowercase
                      </span>
                      <span className={strength.hasNumber ? 'text-[#16A34A] font-medium flex items-center gap-1' : 'flex items-center gap-1'}>
                        {strength.hasNumber ? '✓' : '•'} Numbers
                      </span>
                      <span className={strength.hasSpecial ? 'text-[#16A34A] font-medium flex items-center gap-1' : 'flex items-center gap-1'}>
                        {strength.hasSpecial ? '✓' : '•'} Special symbols
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-semibold text-[#242033] mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#716B80] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter your password"
                    className="w-full pl-10 pr-11 py-2.5 rounded-xl bg-white border border-[#E5E1EB] text-xs text-[#242033] placeholder-[#716B80]/50 focus:outline-none focus:border-[#A855F7] focus:ring-1 focus:ring-[#A855F7] transition-all shadow-xs font-sans"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#716B80] hover:text-[#242033] transition-colors cursor-pointer"
                    title={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Terms and Privacy Acknowledgement */}
              <div className="flex items-start gap-2.5 pt-1">
                <input
                  type="checkbox"
                  id="agreeTerms"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 rounded border-[#E5E1EB] text-[#A855F7] focus:ring-[#A855F7] h-4 w-4 cursor-pointer accent-[#A855F7]"
                  required
                />
                <label htmlFor="agreeTerms" className="text-[11px] text-[#716B80] leading-relaxed cursor-pointer select-none">
                  I agree to the TrustShield AI <span className="text-[#A855F7] font-semibold underline hover:text-[#7E22CE]">Terms of Service</span> and acknowledge the <span className="text-[#A855F7] font-semibold underline hover:text-[#7E22CE]">Privacy Policy</span>.
                </label>
              </div>

              {/* Submit Registration Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#A855F7] hover:bg-[#7E22CE] disabled:opacity-50 text-white font-semibold text-xs tracking-wide transition-all shadow-sm hover:shadow-md hover:shadow-[#A855F7]/20 active:scale-[0.99] cursor-pointer"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Creating secure account...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Create account</span>
                    </>
                  )}
                </button>
              </div>

              {/* Switch back to Login */}
              <div className="pt-2 text-center text-xs text-[#716B80]">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => handleSwitchMode('login')}
                  className="font-bold text-[#A855F7] hover:text-[#7E22CE] transition-colors cursor-pointer"
                >
                  Log in here
                </button>
              </div>

            </form>
          )}

        </div>

        {/* Footer info */}
        <div className="pt-6 border-t border-[#E5E1EB]/60 flex items-center justify-between text-[11px] text-[#716B80]">
          <span className="flex items-center gap-1.5 font-medium">
            <Lock className="w-3.5 h-3.5 text-[#A855F7]" />
            Enterprise Zero-Knowledge Encryption
          </span>
          <span className="font-mono text-[10px] bg-[#F8F7FC] px-2 py-0.5 rounded border border-[#E5E1EB]">
            v2.4.0
          </span>
        </div>

      </div>

      {/* ======================================================== */}
      {/* RIGHT COLUMN: HERO ARTWORK PANEL (7 cols on lg)          */}
      {/* Light Theme: #F8F7FC background, soft lavender glow,      */}
      {/* framing the Futuristic Deepfake Detection artwork         */}
      {/* ======================================================== */}
      <div className="lg:col-span-7 xl:col-span-7 relative hidden lg:flex flex-col items-center justify-center p-8 xl:p-12 bg-[#F8F7FC] border-l border-[#E5E1EB] overflow-hidden">
        
        {/* Soft Lavender ambient glows */}
        <div className="absolute top-1/4 right-1/4 w-[450px] h-[450px] bg-[#F3E8FF] rounded-full blur-3xl pointer-events-none opacity-80" />
        <div className="absolute bottom-10 left-10 w-[350px] h-[350px] bg-[#E9D5FF]/50 rounded-full blur-3xl pointer-events-none" />

        {/* Hero Artwork Container Card */}
        <div className="relative z-10 w-full max-w-3xl rounded-3xl p-3 sm:p-4 bg-white border border-[#E9D5FF] shadow-xl shadow-purple-900/5">
          
          <div className="relative rounded-2xl overflow-hidden bg-black/90">
            <img
              src="/assets/aistudio/Futuristic_AI_Deepfake_Detection_Interface__1__2b8cc96a.png"
              alt="TrustShield AI Deepfake Detection & Threat Forensics Artwork"
              className="w-full h-auto object-cover object-center max-h-[78vh] select-none"
              loading="eager"
            />

            {/* Subtle bottom edge gradient vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
            
            {/* Top Right Floating Badge */}
            <div className="absolute top-4 right-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-[#E9D5FF] text-[11px] text-[#242033] shadow-md shadow-purple-950/10">
              <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
              <span className="font-semibold">Deepfake Engine Active</span>
            </div>

            {/* Bottom Left Floating Mini Card */}
            <div className="absolute bottom-4 left-4 z-20 flex items-center gap-3 px-3.5 py-2 rounded-2xl bg-white/95 backdrop-blur-md border border-[#E9D5FF] shadow-lg shadow-purple-950/10 max-w-xs">
              <div className="w-8 h-8 rounded-xl bg-[#F3E8FF] flex items-center justify-center text-[#A855F7] shrink-0">
                <Fingerprint className="w-4 h-4 text-[#A855F7]" />
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-[#242033]">Neural Media Forensics</div>
                <div className="text-[10px] text-[#716B80]">Facial landmark & frequency analysis</div>
              </div>
            </div>
          </div>

          {/* Under-Card Feature Badges */}
          <div className="grid grid-cols-3 gap-2.5 pt-3.5">
            <div className="flex items-center gap-2 p-2 rounded-xl bg-[#F8F7FC] border border-[#E5E1EB] text-left">
              <Cpu className="w-4 h-4 text-[#A855F7] shrink-0" />
              <div className="truncate">
                <div className="text-[11px] font-bold text-[#242033] truncate">Multi-Modal AI</div>
                <div className="text-[9px] text-[#716B80]">Audio, Video & Text</div>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2 rounded-xl bg-[#F8F7FC] border border-[#E5E1EB] text-left">
              <ShieldCheck className="w-4 h-4 text-[#16A34A] shrink-0" />
              <div className="truncate">
                <div className="text-[11px] font-bold text-[#242033] truncate">Zero-Trust Engine</div>
                <div className="text-[9px] text-[#716B80]">Enterprise Guard</div>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2 rounded-xl bg-[#F8F7FC] border border-[#E5E1EB] text-left">
              <Zap className="w-4 h-4 text-[#A855F7] shrink-0" />
              <div className="truncate">
                <div className="text-[11px] font-bold text-[#242033] truncate">FastAPI Sync</div>
                <div className="text-[9px] text-[#716B80]">Real-Time Forensics</div>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* ======================================================== */}
      {/* MOBILE HERO PREVIEW STRIP (for screens < lg)             */}
      {/* ======================================================== */}
      <div className="lg:hidden col-span-1 border-t border-[#E5E1EB] p-4 bg-[#F8F7FC]">
        <div className="rounded-2xl overflow-hidden border border-[#E9D5FF] bg-white p-2 shadow-sm">
          <div className="relative rounded-xl overflow-hidden">
            <img
              src="/assets/aistudio/Futuristic_AI_Deepfake_Detection_Interface__1__2b8cc96a.png"
              alt="TrustShield AI Hero"
              className="w-full h-44 object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-3">
              <span className="text-xs text-white font-bold flex items-center gap-1.5 drop-shadow-sm">
                <Shield className="w-4 h-4 text-[#C084FC]" />
                AI Deepfake & Cybersecurity Defense
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* FORGOT PASSWORD MODAL (Light SaaS Theme)                 */}
      {/* ======================================================== */}
      {forgotPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
          <div className="rounded-2xl border border-[#E5E1EB] bg-white w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E1EB]">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-[#F3E8FF] text-[#A855F7]">
                  <Lock className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-[#242033]">
                  Reset Security Password
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setForgotPasswordModal(false)}
                className="text-[#716B80] hover:text-[#242033] p-1 cursor-pointer font-semibold"
              >
                ✕
              </button>
            </div>

            {forgotSuccess ? (
              <div className="p-4 rounded-xl bg-[#16A34A]/10 border border-[#16A34A]/25 text-[#16A34A] text-xs space-y-2">
                <div className="flex items-center gap-2 font-bold">
                  <Check className="w-4 h-4" />
                  <span>Password Recovery Link Dispatched</span>
                </div>
                <p className="text-[11px] text-[#716B80] leading-relaxed">
                  If an account exists for <strong className="text-[#242033]">{forgotEmail}</strong>, instructions to establish new cryptographic credentials have been routed.
                </p>
              </div>
            ) : (
              <form onSubmit={handleForgotPasswordSubmit} className="space-y-3.5 text-xs">
                <p className="text-[#716B80] leading-relaxed">
                  Enter your registered email address and we will issue a secure verification link to reset your credentials.
                </p>

                <div>
                  <label className="block text-xs font-semibold text-[#242033] mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="name@organization.com"
                    className="w-full px-3 py-2.5 rounded-xl bg-white border border-[#E5E1EB] text-xs text-[#242033] placeholder-[#716B80]/50 focus:outline-none focus:border-[#A855F7] focus:ring-1 focus:ring-[#A855F7]"
                    required
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setForgotPasswordModal(false)}
                    className="px-3.5 py-2 rounded-xl bg-[#F8F7FC] hover:bg-[#E5E1EB] text-[#716B80] hover:text-[#242033] font-medium cursor-pointer transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-[#A855F7] hover:bg-[#7E22CE] text-white font-semibold cursor-pointer shadow-sm transition-all"
                  >
                    Send Recovery Link
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
