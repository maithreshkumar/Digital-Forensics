import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Eye, EyeOff, ArrowRight, Lock, Mail, Zap, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';

// Particle system
function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: { x: number; y: number; vx: number; vy: number; r: number; opacity: number }[] = [];
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        r: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.1,
      });
    }

    let animId: number;
    function draw() {
      ctx.clearRect(0, 0, canvas!.width, canvas!.height);
      particles.forEach((p, i) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > canvas!.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas!.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(99,102,241,${p.opacity})`;
        ctx.fill();

        particles.slice(i + 1).forEach(p2 => {
          const dx = p.x - p2.x, dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(99,102,241,${0.15 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });
      animId = requestAnimationFrame(draw);
    }
    draw();

    const handleResize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    window.addEventListener('resize', handleResize);
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', handleResize); };
  }, []);
  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />;
}

// Floating forensic node
function ForensicNode({ x, y, delay, label }: { x: string; y: string; delay: number; label: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: [0, 0.7, 0.5], scale: [0, 1, 0.9] }}
      transition={{ delay, duration: 2, repeat: Infinity, repeatType: 'reverse', repeatDelay: Math.random() * 3 }}
      className="absolute pointer-events-none"
      style={{ left: x, top: y }}
    >
      <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-3 py-1.5">
        <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" />
        <span className="text-white/70 text-xs font-mono">{label}</span>
      </div>
    </motion.div>
  );
}

export default function LoginPage() {
  const [isSignup, setIsSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(true);
  const [email, setEmail] = useState('investigator@dfir.gov');
  const [password, setPassword] = useState('DFIRAdmin@2026');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const { login } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: (e.clientX / window.innerWidth - 0.5) * 20, y: (e.clientY / window.innerHeight - 0.5) * 20 });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const ok = await login(email, password);
    if (ok) navigate('/');
    else { setError('Invalid credentials. Please try again.'); setLoading(false); }
  };

  const forensicNodes = [
    { x: '5%', y: '15%', delay: 0.3, label: 'SHA256: a3f9b2...' },
    { x: '75%', y: '10%', delay: 0.8, label: 'Memory Dump Active' },
    { x: '85%', y: '35%', delay: 1.2, label: 'Chain of Custody' },
    { x: '8%', y: '70%', delay: 0.5, label: 'Evidence Hash OK' },
    { x: '80%', y: '75%', delay: 1.5, label: 'Agent: Malware-01' },
    { x: '15%', y: '45%', delay: 2.0, label: 'Trust Score: 98%' },
    { x: '60%', y: '85%', delay: 0.9, label: 'Timeline: 2,847 events' },
  ];

  return (
    <div className="min-h-screen overflow-hidden relative flex items-center justify-center"
      style={{ background: 'linear-gradient(135deg, #0f0c29 0%, #1a1a4e 40%, #0d1b3e 70%, #0a0a2e 100%)' }}
    >
      <ParticleCanvas />

      {/* Animated grid background */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-10"
        style={{
          backgroundImage: 'linear-gradient(rgba(99,102,241,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.3) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Floating forensic nodes */}
      {forensicNodes.map((node, i) => <ForensicNode key={i} {...node} />)}

      {/* 3D Holographic cube */}
      <motion.div
        className="fixed top-12 right-16 pointer-events-none z-10"
        animate={{ rotateY: [0, 360], rotateX: [0, 20, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        style={{ transformStyle: 'preserve-3d', perspective: 400 }}
      >
        <div className="w-16 h-16 relative" style={{ transformStyle: 'preserve-3d' }}>
          {[0, 1, 2, 3, 4, 5].map((face) => (
            <div key={face} className="absolute inset-0 border border-cyan-400/30 bg-cyan-400/5 rounded-sm"
              style={{ transform: [`rotateY(0deg) translateZ(32px)`, `rotateY(180deg) translateZ(32px)`, `rotateX(90deg) translateZ(32px)`, `rotateX(-90deg) translateZ(32px)`, `rotateY(-90deg) translateZ(32px)`, `rotateY(90deg) translateZ(32px)`][face] }}
            />
          ))}
        </div>
      </motion.div>

      {/* Binary rain (decorative) */}
      <div className="fixed top-0 left-0 right-0 pointer-events-none z-0 overflow-hidden h-full opacity-5">
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.div key={i}
            className="absolute text-green-400 font-mono text-xs leading-tight"
            style={{ left: `${i * 8.5}%` }}
            animate={{ y: ['-100%', '100%'] }}
            transition={{ duration: 8 + i * 0.5, repeat: Infinity, ease: 'linear', delay: i * 0.7 }}
          >
            {Array.from({ length: 40 }).map(() => Math.round(Math.random())).join('\n')}
          </motion.div>
        ))}
      </div>

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        style={{ rotateX: mousePos.y * 0.05, rotateY: mousePos.x * 0.05 }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        <div className="glass rounded-3xl p-8 border border-white/20"
          style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(30px)', boxShadow: '0 25px 80px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.15)' }}
        >
          {/* Logo Area */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, type: 'spring', stiffness: 200 }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 relative"
              style={{ background: 'linear-gradient(135deg, #2563eb, #6366f1)' }}
            >
              <Shield className="w-8 h-8 text-white" />
              <motion.div
                className="absolute inset-0 rounded-2xl"
                animate={{ boxShadow: ['0 0 20px rgba(99,102,241,0.5)', '0 0 40px rgba(99,102,241,0.8)', '0 0 20px rgba(99,102,241,0.5)'] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl font-bold text-white mb-1"
            >
              DFIR<span className="text-cyan-400"> Platform</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-white/50 text-sm"
            >
              AI-Powered Digital Forensics & Incident Response
            </motion.p>
          </div>

          {/* Tab Toggle */}
          <div className="flex p-1 bg-white/5 rounded-xl mb-6 border border-white/10">
            {['Sign In', 'Create Account'].map((tab, i) => (
              <button
                key={tab}
                onClick={() => setIsSignup(i === 1)}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  isSignup === (i === 1) ? 'bg-white/15 text-white' : 'text-white/40 hover:text-white/70'
                }`}
              >{tab}</button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignup && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                <label className="block text-white/60 text-xs font-medium mb-1.5">Full Name</label>
                <input
                  type="text"
                  placeholder="Dr. Jane Mitchell"
                  className="w-full px-4 py-3 rounded-xl text-sm bg-white/10 border border-white/15 text-white placeholder-white/30 focus:outline-none focus:border-cyan-400/50 focus:bg-white/15 transition-all"
                />
              </motion.div>
            )}

            <div>
              <label className="block text-white/60 text-xs font-medium mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="investigator@agency.gov"
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-sm bg-white/10 border border-white/15 text-white placeholder-white/30 focus:outline-none focus:border-cyan-400/50 focus:bg-white/15 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-white/60 text-xs font-medium mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-12 py-3 rounded-xl text-sm bg-white/10 border border-white/15 text-white placeholder-white/30 focus:outline-none focus:border-cyan-400/50 focus:bg-white/15 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors bg-white/10 hover:bg-white/20 rounded-lg p-1.5"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[10px] text-white/35 mt-1.5 ml-1">
                Demo credentials are pre-filled — click the eye icon to toggle visibility
              </p>
            </div>

            {!isSignup && (
              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 text-white/50 cursor-pointer">
                  <input type="checkbox" className="rounded" defaultChecked /> Remember me
                </label>
                <button type="button" className="text-cyan-400 hover:text-cyan-300">Forgot password?</button>
              </div>
            )}

            <AnimatePresence>
              {error && (
                <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="flex items-center gap-2 p-3 bg-red-500/15 border border-red-500/30 rounded-xl text-red-300 text-xs"
                >
                  <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 rounded-xl font-semibold text-sm text-white flex items-center justify-center gap-2 relative overflow-hidden disabled:opacity-70"
              style={{ background: 'linear-gradient(135deg, #2563eb, #6366f1)' }}
            >
              <motion.div className="absolute inset-0 bg-white/10"
                animate={{ x: loading ? ['100%', '-100%'] : '100%' }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              />
              {loading ? (
                <>
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                  />
                  Authenticating...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  {isSignup ? 'Create Account' : 'Access Platform'}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </form>

          {/* MFA Notice */}
          <div className="mt-4 flex items-center gap-2 p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-xl">
            <Shield className="w-4 h-4 text-cyan-400 flex-shrink-0" />
            <p className="text-xs text-cyan-300/80">
              Multi-Factor Authentication enabled. MFA prompt will appear after password verification.
            </p>
          </div>

          {/* Footer */}
          <p className="text-center text-white/25 text-xs mt-6">
            Authorized Personnel Only • SOC 2 Type II Certified • CJIS Compliant
          </p>
        </div>

        {/* Floating badges */}
        <div className="flex justify-center gap-3 mt-4">
          {['ISO 27001', 'FedRAMP', 'NIST'].map((badge) => (
            <div key={badge} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-white/40 text-xs font-mono">
              {badge}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
