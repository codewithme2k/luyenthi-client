import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { toast } from 'sonner'
import { callResetPassword } from '@/config/api'
import { getAxiosErrorMessage } from '@/config/getAxiosErrorMessage'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { GraduationCap, Lock, Eye, EyeOff, Loader2, Sparkles, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react'

const resetSchema = z.object({
  password: z
    .string()
    .min(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự!' })
    .max(30, { message: 'Mật khẩu không được quá 30 ký tự!' }),
  confirmPassword: z.string().min(1, { message: 'Vui lòng xác nhận mật khẩu!' })
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Xác nhận mật khẩu không khớp!',
  path: ['confirmPassword']
})

type ResetFormValues = z.infer<typeof resetSchema>

export default function ResetPasswordPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const params = new URLSearchParams(location.search)
  const token = params.get('token')

  const [isSubmit, setIsSubmit] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const form = useForm<ResetFormValues>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      password: '',
      confirmPassword: ''
    }
  })

  const { errors } = form.formState

  const onSubmit = async (values: ResetFormValues) => {
    if (!token) {
      toast.error('Token khôi phục không tồn tại hoặc đã hết hạn!')
      return
    }

    setIsSubmit(true)

    try {
      const res = await callResetPassword(token, values.password)
      if (res.data?.success) {
        setIsSuccess(true)
        toast.success('Đặt lại mật khẩu thành công!')
        setTimeout(() => {
          navigate('/login', { replace: true })
        }, 3000)
      } else {
        toast.error(res.data?.message || 'Đặt lại mật khẩu thất bại!')
      }
    } catch (error) {
      toast.error(getAxiosErrorMessage(error))
    } finally {
      setIsSubmit(false)
    }
  }

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
        </Link>

        <Card className="w-full shadow-lg border border-border/80 bg-card/60 backdrop-blur-md rounded-2xl overflow-hidden">
          <CardHeader className="space-y-1.5 pb-6 text-center">
            <CardTitle className="text-2xl font-black font-heading tracking-tight">Đặt Lại Mật Khẩu</CardTitle>
            <CardDescription className="text-sm font-medium">
              {!token 
                ? 'Đường dẫn khôi phục không hợp lệ' 
                : isSuccess 
                ? 'Thiết lập mật khẩu mới hoàn thành' 
                : 'Thiết lập mật khẩu mới cực kỳ bảo mật cho tài khoản của bạn'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!token ? (
              <div className="text-center py-4 space-y-4 animate-scale-up">
                <div className="mx-auto w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500">
                  <AlertTriangle className="w-6 h-6 animate-pulse" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-foreground">Thiếu liên kết khôi phục mật khẩu!</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Liên kết bạn vừa truy cập không chứa token bảo mật hợp lệ hoặc đã hết hạn sử dụng. Vui lòng thực hiện lại luồng yêu cầu quên mật khẩu.
                  </p>
                </div>
                <Button asChild className="w-full mt-2 font-bold cursor-pointer rounded-xl" variant="outline">
                  <Link to="/forgot-password">Yêu cầu liên kết mới</Link>
                </Button>
              </div>
            ) : !isSuccess ? (
              <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
                <FieldGroup className="space-y-4">
                  
                  {/* Mật khẩu mới */}
                  <Field>
                    <FieldLabel htmlFor="password" className="text-xs font-black text-muted-foreground uppercase tracking-wider">Mật khẩu mới</FieldLabel>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground/60" />
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Mật khẩu mới tối thiểu 6 ký tự..."
                        className="pl-10 pr-10 rounded-xl h-10 border border-border/80 bg-background/50 font-medium text-sm focus-visible:ring-primary"
                        {...form.register('password')}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3.5 text-muted-foreground/60 hover:text-foreground transition-colors cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {errors.password && <p className="mt-1 text-xs font-bold text-rose-500">{errors.password.message}</p>}
                  </Field>

                  {/* Xác nhận mật khẩu mới */}
                  <Field>
                    <FieldLabel htmlFor="confirmPassword" className="text-xs font-black text-muted-foreground uppercase tracking-wider">Xác nhận mật khẩu mới</FieldLabel>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground/60" />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Nhập lại mật khẩu mới..."
                        className="pl-10 pr-10 rounded-xl h-10 border border-border/80 bg-background/50 font-medium text-sm focus-visible:ring-primary"
                        {...form.register('confirmPassword')}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-3.5 text-muted-foreground/60 hover:text-foreground transition-colors cursor-pointer"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {errors.confirmPassword && <p className="mt-1 text-xs font-bold text-rose-500">{errors.confirmPassword.message}</p>}
                  </Field>

                  <Button
                    type="submit"
                    disabled={isSubmit}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white transition-all duration-300 font-extrabold h-11 rounded-xl shadow-md shadow-indigo-600/20 active:scale-[0.99] cursor-pointer mt-2"
                  >
                    {isSubmit ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Đang đặt lại mật khẩu...
                      </>
                    ) : (
                      'Thiết Lập Mật Khẩu Mới'
                    )}
                  </Button>
                </FieldGroup>
              </form>
            ) : (
              <div className="text-center py-4 space-y-4 animate-scale-up">
                <div className="mx-auto w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
                  <CheckCircle2 className="w-6 h-6 animate-bounce" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-foreground">Đặt lại mật khẩu thành công!</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Mật khẩu của bạn đã được thay đổi an toàn. Hệ thống tự động chuyển hướng về trang đăng nhập sau 3 giây...
                  </p>
                </div>
                <Button onClick={() => navigate('/login')} className="w-full mt-2 font-extrabold cursor-pointer rounded-xl flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20">
                  Đăng Nhập Ngay
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-xs text-muted-foreground font-semibold flex items-center justify-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          <span>Bảo Mật Tài Khoản • Luyện Thi Pro</span>
        </div>
      </div>
    </div>
  )
}
