import { useEffect, useState, useRef } from 'react'
import { useNavigate, Link } from 'react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { toast } from 'sonner'
import { callRegister } from '@/config/api'
import { getAxiosErrorMessage } from '@/config/getAxiosErrorMessage'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldLabel, FieldGroup, FieldDescription } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Loader2, RefreshCw, User, Mail, Lock, Phone, MapPin, Eye, EyeOff } from 'lucide-react'

// Character set for CAPTCHA (excluding ambiguous letters like O, I, 0, 1)
const CAPTCHA_CHARS = '23456789abcdefghkmnpqrstuvwxyzABCDEFGHKMNPQRSTUVWXYZ'

const generateRandomCode = () => {
  let result = ''
  for (let i = 0; i < 5; i++) {
    result += CAPTCHA_CHARS.charAt(Math.floor(Math.random() * CAPTCHA_CHARS.length))
  }
  return result
}

const formSchema = z
  .object({
    name: z.string().min(1, { message: 'Họ và tên không được để trống!' }),
    email: z.string().min(1, { message: 'Email không được để trống!' }).email({ message: 'Email không hợp lệ!' }),
    password: z
      .string()
      .min(6, { message: 'Mật khẩu phải từ 6 ký tự trở lên!' })
      .max(30, { message: 'Mật khẩu không được quá 30 ký tự!' }),
    confirmPassword: z.string().min(1, { message: 'Vui lòng xác nhận mật khẩu!' }),
    contact: z
      .string()
      .min(1, { message: 'Số điện thoại không được để trống!' })
      .regex(/^[0-9+]{9,12}$/, { message: 'Số điện thoại không hợp lệ (9-12 số)!' }),
    gender: z.enum(['male', 'female', 'others'], { message: 'Vui lòng chọn giới tính!' }),
    address: z.string().min(1, { message: 'Địa chỉ không được để trống!' }),
    captcha: z.string().min(1, { message: 'Vui lòng nhập mã kiểm tra!' })
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp!',
    path: ['confirmPassword']
  })

type RegisterFormValues = z.infer<typeof formSchema>

const RegisterForm = () => {
  const navigate = useNavigate()
  const [isSubmit, setIsSubmit] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // CAPTCHA State
  const [captchaCode, setCaptchaCode] = useState('')
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      contact: '',
      gender: 'male',
      address: '',
      captcha: ''
    }
  })

  const { errors } = form.formState

  // Generate and draw CAPTCHA
  const refreshCaptcha = () => {
    const newCode = generateRandomCode()
    setCaptchaCode(newCode)
    form.setValue('captcha', '')
  }

  useEffect(() => {
    refreshCaptcha()
  }, [])

  useEffect(() => {
    if (!captchaCode) return

    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext('2d')
      if (ctx) {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        // Draw background gradient
        const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
        grad.addColorStop(0, '#0f172a') // dark slate 900
        grad.addColorStop(1, '#1e293b') // dark slate 800
        ctx.fillStyle = grad
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        // Draw grid lines for noise
        ctx.strokeStyle = 'rgba(99, 102, 241, 0.12)'
        ctx.lineWidth = 1
        for (let i = 0; i < canvas.width; i += 15) {
          ctx.beginPath()
          ctx.moveTo(i, 0)
          ctx.lineTo(i, canvas.height)
          ctx.stroke()
        }
        for (let j = 0; j < canvas.height; j += 15) {
          ctx.beginPath()
          ctx.moveTo(0, j)
          ctx.lineTo(canvas.width, j)
          ctx.stroke()
        }

        // Draw some random noise dots
        for (let i = 0; i < 30; i++) {
          ctx.fillStyle = `rgba(${Math.random() * 255}, ${Math.random() * 255}, 255, ${0.1 + Math.random() * 0.2})`
          ctx.beginPath()
          ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, 1 + Math.random() * 1.5, 0, Math.PI * 2)
          ctx.fill()
        }

        // Draw some random noise lines
        for (let i = 0; i < 3; i++) {
          ctx.strokeStyle = `rgba(${Math.random() * 255}, 130, 255, 0.25)`
          ctx.lineWidth = 1.5
          ctx.beginPath()
          ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height)
          ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height)
          ctx.stroke()
        }

        // Draw CAPTCHA characters
        ctx.textBaseline = 'middle'
        const fontFamilies = ['Arial', 'Verdana', 'Georgia', 'Courier New', 'Impact']

        for (let i = 0; i < captchaCode.length; i++) {
          const char = captchaCode[i]
          const fontSize = 24 + Math.random() * 6
          const fontFamily = fontFamilies[Math.floor(Math.random() * fontFamilies.length)]
          ctx.font = `bold ${fontSize}px ${fontFamily}`

          // Vibrant aesthetic colors that stand out in dark background
          const colors = ['#38bdf8', '#818cf8', '#fb7185', '#34d399', '#f472b6', '#fbbf24']
          ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)]

          const x = 18 + i * 26 + Math.random() * 4
          const y = canvas.height / 2 + (Math.random() * 8 - 4)
          const angle = ((Math.random() * 24 - 12) * Math.PI) / 180

          ctx.save()
          ctx.translate(x, y)
          ctx.rotate(angle)
          ctx.fillText(char, -10, 0)
          ctx.restore()
        }
      }
    }
  }, [captchaCode])

  const onSubmit = async (values: RegisterFormValues) => {
    // 1. Verify CAPTCHA first
    if (values.captcha.toLowerCase() !== captchaCode.toLowerCase()) {
      form.setError('captcha', { type: 'manual', message: 'Mã kiểm tra không chính xác!' })
      toast.error('Mã kiểm tra không chính xác!')
      refreshCaptcha()
      return
    }

    const { name, email, password, gender, address, contact } = values
    setIsSubmit(true)

    try {
      const res = await callRegister(name, email, password, gender, address, contact)
      const backendRes = res.data

      if (backendRes.success) {
        toast.success('Đăng ký tài khoản thành công!')
        navigate('/login')
      } else {
        toast.error(backendRes.message || 'Đăng ký thất bại!')
        refreshCaptcha()
      }
    } catch (error) {
      toast.error(getAxiosErrorMessage(error))
      refreshCaptcha()
    } finally {
      setIsSubmit(false)
    }
  }

  return (
    <Card className='w-full shadow-lg border border-border/80 bg-card/60 backdrop-blur-md rounded-2xl overflow-hidden'>
      <CardHeader className='space-y-1.5 pb-6 text-center'>
        <CardTitle className='text-2xl font-black font-heading tracking-tight'>Tạo Tài Khoản</CardTitle>
        <CardDescription className='text-sm font-medium'>
          Nhập thông tin cá nhân của bạn bên dưới để đăng ký
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
          <FieldGroup className='space-y-4'>
            {/* Họ và tên */}
            <Field>
              <FieldLabel htmlFor='name' className='text-xs font-black text-muted-foreground uppercase tracking-wider'>
                Họ và tên
              </FieldLabel>
              <div className='relative'>
                <User className='absolute left-3.5 top-3 h-4 w-4 text-muted-foreground/60' />
                <Input
                  id='name'
                  type='text'
                  placeholder='Nguyễn Văn A'
                  className='pl-10 rounded-xl h-10 border-border/80 bg-background/50 font-medium text-sm focus-visible:ring-primary'
                  {...form.register('name')}
                />
              </div>
              {errors.name && <p className='mt-1 text-xs font-bold text-rose-500'>{errors.name.message}</p>}
            </Field>

            {/* Email */}
            <Field>
              <FieldLabel htmlFor='email' className='text-xs font-black text-muted-foreground uppercase tracking-wider'>
                Email
              </FieldLabel>
              <div className='relative'>
                <Mail className='absolute left-3.5 top-3 h-4 w-4 text-muted-foreground/60' />
                <Input
                  id='email'
                  type='email'
                  placeholder='ten_cua_ban@example.com'
                  className='pl-10 rounded-xl h-10 border-border/80 bg-background/50 font-medium text-sm focus-visible:ring-primary'
                  {...form.register('email')}
                />
              </div>
              {errors.email && <p className='mt-1 text-xs font-bold text-rose-500'>{errors.email.message}</p>}
            </Field>

            {/* Hai cột: Số điện thoại & Giới tính */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {/* Số điện thoại */}
              <Field>
                <FieldLabel
                  htmlFor='contact'
                  className='text-xs font-black text-muted-foreground uppercase tracking-wider'
                >
                  Số điện thoại
                </FieldLabel>
                <div className='relative'>
                  <Phone className='absolute left-3.5 top-3 h-4 w-4 text-muted-foreground/60' />
                  <Input
                    id='contact'
                    type='tel'
                    placeholder='0987654321'
                    className='pl-10 rounded-xl h-10 border-border/80 bg-background/50 font-medium text-sm focus-visible:ring-primary'
                    {...form.register('contact')}
                  />
                </div>
                {errors.contact && <p className='mt-1 text-xs font-bold text-rose-500'>{errors.contact.message}</p>}
              </Field>

              {/* Giới tính */}
              <Field>
                <FieldLabel
                  htmlFor='gender'
                  className='text-xs font-black text-muted-foreground uppercase tracking-wider'
                >
                  Giới tính
                </FieldLabel>
                <select
                  id='gender'
                  className='w-full px-3 rounded-xl h-10 border border-border/80 bg-background/50 text-sm font-semibold outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all dark:bg-slate-900 cursor-pointer'
                  {...form.register('gender')}
                >
                  <option value='male'>Nam (Male)</option>
                  <option value='female'>Nữ (Female)</option>
                  <option value='others'>Khác (Others)</option>
                </select>
                {errors.gender && <p className='mt-1 text-xs font-bold text-rose-500'>{errors.gender.message}</p>}
              </Field>
            </div>

            {/* Địa chỉ */}
            <Field>
              <FieldLabel
                htmlFor='address'
                className='text-xs font-black text-muted-foreground uppercase tracking-wider'
              >
                Địa chỉ cư trú
              </FieldLabel>
              <div className='relative'>
                <MapPin className='absolute left-3.5 top-3 h-4 w-4 text-muted-foreground/60' />
                <Input
                  id='address'
                  type='text'
                  placeholder='Quận 1, TP. Hồ Chí Minh'
                  className='pl-10 rounded-xl h-10 border-border/80 bg-background/50 font-medium text-sm focus-visible:ring-primary'
                  {...form.register('address')}
                />
              </div>
              {errors.address && <p className='mt-1 text-xs font-bold text-rose-500'>{errors.address.message}</p>}
            </Field>

            {/* Hai cột: Mật khẩu & Xác nhận mật khẩu */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {/* Mật khẩu */}
              <Field>
                <FieldLabel
                  htmlFor='password'
                  className='text-xs font-black text-muted-foreground uppercase tracking-wider'
                >
                  Mật khẩu
                </FieldLabel>
                <div className='relative'>
                  <Lock className='absolute left-3.5 top-3 h-4 w-4 text-muted-foreground/60' />
                  <Input
                    id='password'
                    type={showPassword ? 'text' : 'password'}
                    placeholder='••••••'
                    className='pl-10 pr-10 rounded-xl h-10 border-border/80 bg-background/50 font-medium text-sm focus-visible:ring-primary'
                    {...form.register('password')}
                  />
                  <button
                    type='button'
                    onClick={() => setShowPassword(!showPassword)}
                    className='absolute right-3 top-3.5 text-muted-foreground/60 hover:text-foreground transition-colors cursor-pointer'
                  >
                    {showPassword ? <EyeOff className='h-4 w-4' /> : <Eye className='h-4 w-4' />}
                  </button>
                </div>
                {errors.password && <p className='mt-1 text-xs font-bold text-rose-500'>{errors.password.message}</p>}
              </Field>

              {/* Xác nhận mật khẩu */}
              <Field>
                <FieldLabel
                  htmlFor='confirmPassword'
                  className='text-xs font-black text-muted-foreground uppercase tracking-wider'
                >
                  Xác nhận mật khẩu
                </FieldLabel>
                <div className='relative'>
                  <Lock className='absolute left-3.5 top-3 h-4 w-4 text-muted-foreground/60' />
                  <Input
                    id='confirmPassword'
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder='••••••'
                    className='pl-10 pr-10 rounded-xl h-10 border-border/80 bg-background/50 font-medium text-sm focus-visible:ring-primary'
                    {...form.register('confirmPassword')}
                  />
                  <button
                    type='button'
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className='absolute right-3 top-3.5 text-muted-foreground/60 hover:text-foreground transition-colors cursor-pointer'
                  >
                    {showConfirmPassword ? <EyeOff className='h-4 w-4' /> : <Eye className='h-4 w-4' />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className='mt-1 text-xs font-bold text-rose-500'>{errors.confirmPassword.message}</p>
                )}
              </Field>
            </div>

            {/* Captcha chống Spam cao cấp */}
            <Field className='pt-2 border-t border-border/50'>
              <FieldLabel className='text-xs font-black text-indigo-500 dark:text-indigo-400 uppercase tracking-widest flex items-center gap-1.5 mb-2'>
                🛡️ Xác minh bảo mật (Anti-Spam CAPTCHA)
              </FieldLabel>
              <div className='flex flex-col sm:flex-row gap-3 items-stretch sm:items-center'>
                {/* Visual Canvas Block with external refresh button */}
                <div className='flex items-center gap-2 shrink-0'>
                  <div className='border border-border/80 rounded-xl overflow-hidden bg-slate-900 select-none shadow-inner h-10'>
                    <canvas ref={canvasRef} width={160} height={40} className='block h-full' />
                  </div>
                  <Button
                    type='button'
                    variant='outline'
                    size='icon'
                    onClick={refreshCaptcha}
                    className='h-10 w-10 rounded-xl border border-border/80 bg-background/50 hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer active:scale-95 transition-all shrink-0'
                    title='Đổi mã bảo mật khác'
                  >
                    <RefreshCw className='h-4.5 w-4.5' />
                  </Button>
                </div>

                {/* Input block */}
                <Input
                  id='captcha'
                  type='text'
                  placeholder='Nhập 5 ký tự bảo mật...'
                  className='rounded-xl h-10 border border-border/80 bg-background/50 font-mono text-sm tracking-widest text-center focus-visible:ring-indigo-500 font-bold flex-1'
                  autoComplete='off'
                  {...form.register('captcha')}
                />
              </div>
              <p className='text-[10px] text-muted-foreground font-semibold mt-1.5 italic'>
                * Nhập chính xác các ký tự trên nền tối (có phân biệt chữ hoa, chữ thường) để tiếp tục.
              </p>
              {errors.captcha && <p className='mt-1 text-xs font-bold text-rose-500'>{errors.captcha.message}</p>}
            </Field>

            {/* Nút Đăng ký và Trở lại Đăng nhập */}
            <Field className='pt-4'>
              <Button
                type='submit'
                disabled={isSubmit}
                className='w-full bg-indigo-600 hover:bg-indigo-700 text-white transition-all duration-300 font-extrabold h-11 rounded-xl shadow-md shadow-indigo-600/20 active:scale-[0.99] cursor-pointer'
              >
                {isSubmit ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Đang xử lý đăng ký...
                  </>
                ) : (
                  'Đăng Ký Thành Viên'
                )}
              </Button>

              <FieldDescription className='text-center mt-5 text-sm font-medium'>
                Đã có tài khoản ôn luyện?{' '}
                <Link to='/login' className='text-indigo-600 font-bold hover:underline'>
                  Đăng nhập ngay
                </Link>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}

export default RegisterForm
