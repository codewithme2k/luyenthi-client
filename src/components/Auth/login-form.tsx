import { useEffect, useState } from 'react'
import { useLocation, useNavigate, Link } from 'react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { toast } from 'sonner'
import { callLogin } from '@/config/api'
import { useAppSelector, useAppDispatch } from '@/redux/hooks'
import { fetchAccount } from '@/redux/slice/accountSlice'
import { getAxiosErrorMessage } from '@/config/getAxiosErrorMessage'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldSeparator } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Loader2, Mail, Lock, Eye, EyeOff, Sparkles } from 'lucide-react'

const formSchema = z.object({
  email: z.string().min(1, { message: 'Email không được để trống!' }).email({ message: 'Email không hợp lệ!' }),
  password: z
    .string()
    .min(1, { message: 'Mật khẩu không được để trống!' })
    .max(30, { message: 'Mật khẩu không được quá 30 ký tự!' })
})

type LoginFormValues = z.infer<typeof formSchema>

const LoginForm = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const isAuthenticated = useAppSelector((state) => state.account.isAuthenticated)
  const [isSubmit, setIsSubmit] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const location = useLocation()
  const params = new URLSearchParams(location.search)
  const callback = params?.get('callback')

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const { errors } = form.formState

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true })
    }
  }, [isAuthenticated, navigate])

  const onSubmit = async (values: LoginFormValues) => {
    const { email, password } = values
    setIsSubmit(true)

    try {
      const res = await callLogin(email, password)
      const backendRes = res.data

      if (backendRes.success && backendRes.data) {
        const { accessToken } = backendRes.data

        localStorage.setItem('accessToken', accessToken)
        
        // Fetch real user info from profile API now that we have the token
        await dispatch(fetchAccount())

        toast.success('Đăng nhập thành công!')

        const redirectUrl = callback ? callback : '/'
        navigate(redirectUrl, { replace: true })
      } else {
        toast.error(backendRes.message || 'Đăng nhập thất bại')
      }
    } catch (error) {
      toast.error(getAxiosErrorMessage(error))
    } finally {
      setIsSubmit(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <Card className="w-full shadow-lg border border-border/80 bg-card/60 backdrop-blur-md rounded-2xl overflow-hidden">
        <CardHeader className="space-y-1.5 pb-6 text-center">
          <CardTitle className="text-2xl font-black font-heading tracking-tight">Chào Mừng Trở Lại</CardTitle>
          <CardDescription className="text-sm font-medium">Đăng nhập tài khoản của bạn để tiếp tục học tập</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
            <FieldGroup className="space-y-4">
              
              {/* Nhóm nút liên kết OAuth */}
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" type="button" className="w-full h-10 rounded-xl border-border/80 hover:bg-muted font-bold text-xs active:scale-98 transition-all cursor-pointer">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="mr-2 h-4.5 w-4.5 text-foreground">
                    <path
                      d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
                      fill="currentColor"
                    />
                  </svg>
                  Apple
                </Button>
                <Button variant="outline" type="button" className="w-full h-10 rounded-xl border-border/80 hover:bg-muted font-bold text-xs active:scale-98 transition-all cursor-pointer">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="mr-2 h-4.5 w-4.5 text-foreground">
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>
                  Google
                </Button>
              </div>

              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card text-xs font-bold text-muted-foreground uppercase tracking-widest my-2">
                Hoặc đăng nhập với
              </FieldSeparator>

              {/* Email */}
              <Field>
                <FieldLabel htmlFor="email" className="text-xs font-black text-muted-foreground uppercase tracking-wider">Địa chỉ Email</FieldLabel>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground/60" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="ten_cua_ban@example.com"
                    className="pl-10 rounded-xl h-10 border border-border/80 bg-background/50 font-medium text-sm focus-visible:ring-primary"
                    {...form.register('email')}
                  />
                </div>
                {errors.email && <p className="mt-1 text-xs font-bold text-rose-500">{errors.email.message}</p>}
              </Field>

              {/* Mật khẩu */}
              <Field>
                <div className="flex items-center justify-between mb-1">
                  <FieldLabel htmlFor="password" className="text-xs font-black text-muted-foreground uppercase tracking-wider">Mật khẩu</FieldLabel>
                  <Link
                    to="/forgot-password"
                    className="text-xs font-bold text-indigo-600 hover:underline underline-offset-4"
                  >
                    Quên mật khẩu?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground/60" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••"
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

              {/* Nút đăng nhập */}
              <Field className="pt-2">
                <Button
                  type="submit"
                  disabled={isSubmit}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white transition-all duration-300 font-extrabold h-11 rounded-xl shadow-md shadow-indigo-600/20 active:scale-[0.99] cursor-pointer"
                >
                  {isSubmit ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Đang xử lý đăng nhập...
                    </>
                  ) : (
                    'Đăng Nhập Ngay'
                  )}
                </Button>

                <FieldDescription className="text-center mt-5 text-sm font-medium">
                  Chưa có tài khoản ôn luyện?{' '}
                  <Link to="/register" className="text-indigo-600 font-bold hover:underline">
                    Đăng ký miễn phí
                  </Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>

      <FieldDescription className="px-6 text-center text-xs text-muted-foreground font-semibold leading-relaxed">
        Bằng việc nhấp Đăng nhập, bạn đồng ý với{' '}
        <Link to="/terms" className="hover:underline text-foreground">
          Điều khoản Dịch vụ
        </Link>{' '}
        và{' '}
        <Link to="/privacy" className="hover:underline text-foreground">
          Chính sách Bảo mật
        </Link>
        .
      </FieldDescription>
    </div>
  )
}

export default LoginForm
