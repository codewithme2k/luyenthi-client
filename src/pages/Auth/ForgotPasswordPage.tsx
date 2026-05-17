import { useState } from 'react'
import { Link } from 'react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { toast } from 'sonner'
import { callForgotPassword } from '@/config/api'
import { getAxiosErrorMessage } from '@/config/getAxiosErrorMessage'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { GraduationCap, Mail, ArrowLeft, Loader2, Sparkles, CheckCircle2 } from 'lucide-react'

const forgotSchema = z.object({
  email: z.string().min(1, { message: 'Email không được để trống!' }).email({ message: 'Email không hợp lệ!' })
})

type ForgotFormValues = z.infer<typeof forgotSchema>

export default function ForgotPasswordPage() {
  const [isSubmit, setIsSubmit] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [submittedEmail, setSubmittedEmail] = useState('')

  const form = useForm<ForgotFormValues>({
    resolver: zodResolver(forgotSchema),
    defaultValues: {
      email: ''
    }
  })

  const { errors } = form.formState

  const onSubmit = async (values: ForgotFormValues) => {
    const { email } = values
    setIsSubmit(true)

    try {
      const res = await callForgotPassword(email)
      if (res.data?.success) {
        setIsSuccess(true)
        setSubmittedEmail(email)
        toast.success('Đã gửi liên kết khôi phục mật khẩu!')
      } else {
        toast.error(res.data?.message || 'Có lỗi xảy ra!')
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
            <CardTitle className="text-2xl font-black font-heading tracking-tight">Khôi Phục Mật Khẩu</CardTitle>
            <CardDescription className="text-sm font-medium">
              {!isSuccess 
                ? 'Nhập email liên kết với tài khoản để nhận đường dẫn đặt lại mật khẩu' 
                : 'Chúng tôi đã gửi link hướng dẫn khôi phục mật khẩu'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!isSuccess ? (
              <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
                <FieldGroup className="space-y-4">
                  <Field>
                    <FieldLabel htmlFor="email" className="text-xs font-black text-muted-foreground uppercase tracking-wider">Địa chỉ Email của bạn</FieldLabel>
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

                  <Button
                    type="submit"
                    disabled={isSubmit}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white transition-all duration-300 font-extrabold h-11 rounded-xl shadow-md shadow-indigo-600/20 active:scale-[0.99] cursor-pointer mt-2"
                  >
                    {isSubmit ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Đang gửi yêu cầu...
                      </>
                    ) : (
                      'Gửi Link Khôi Phục'
                    )}
                  </Button>
                </FieldGroup>
              </form>
            ) : (
              <div className="text-center py-4 space-y-5 animate-scale-up">
                <div className="mx-auto w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
                  <CheckCircle2 className="w-6 h-6 animate-bounce" />
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-foreground leading-relaxed">
                    Một email khôi phục mật khẩu đã được gửi thành công đến:
                  </p>
                  <p className="text-sm font-extrabold text-indigo-600 bg-indigo-500/5 py-1.5 px-3 rounded-lg border border-indigo-500/10 inline-block font-mono">
                    {submittedEmail}
                  </p>
                  <p className="text-xs text-muted-foreground pt-1 leading-relaxed">
                    Vui lòng kiểm tra hộp thư đến (và mục Thư rác/Spam nếu không thấy) để click vào đường link đặt lại mật khẩu mới. Đường link này chỉ có hiệu lực trong vòng 15 phút.
                  </p>
                </div>
              </div>
            )}

            <div className="mt-6 pt-5 border-t border-border flex items-center justify-center">
              <Link to="/login" className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-indigo-600 transition-colors">
                <ArrowLeft className="w-3.5 h-3.5" />
                Quay lại đăng nhập
              </Link>
            </div>
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
