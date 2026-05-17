import LoginForm from '@/components/Auth/login-form'
import { GraduationCap, Sparkles } from 'lucide-react'
import { Link } from 'react-router'

export default function LoginPage() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-muted p-6 md:p-10 overflow-hidden select-none">
      
      {/* Premium Glassmorphic Glow Backdrops */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-violet-600/5 dark:bg-violet-600/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="flex w-full max-w-md flex-col gap-6 relative z-10 animate-fade-in">
        
        {/* Brand Logo & Name */}
        <Link to="/" className="flex items-center gap-2.5 self-center group transition-transform duration-300 hover:scale-102">
          <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-600/25 ring-2 ring-indigo-500/20">
            <GraduationCap className="size-5" />
          </div>
          <span className="font-heading font-black text-xl tracking-tight bg-gradient-to-r from-foreground via-indigo-600 to-violet-600 bg-clip-text text-transparent">
            Luyện Thi Pro
          </span>
          <div className="px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-600 border border-indigo-500/20 text-[9px] font-black uppercase tracking-wider">
            Premium
          </div>
        </Link>

        {/* Dynamic Login Form */}
        <LoginForm />

        {/* Footer */}
        <div className="text-center text-xs text-muted-foreground font-semibold flex items-center justify-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          <span>Ôn Luyện Thông Minh © Nền Tảng Luyện Thi Pro</span>
        </div>
      </div>
    </div>
  )
}
