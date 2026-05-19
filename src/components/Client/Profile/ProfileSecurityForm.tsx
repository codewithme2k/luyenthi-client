import type { Dispatch, FormEvent, SetStateAction } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Eye, EyeOff, Lock } from 'lucide-react'

interface Props {
  currentPassword: string
  newPassword: string
  confirmPassword: string
  showCurrentPassword: boolean
  showNewPassword: boolean
  showConfirmPassword: boolean
  setCurrentPassword: Dispatch<SetStateAction<string>>
  setNewPassword: Dispatch<SetStateAction<string>>
  setConfirmPassword: Dispatch<SetStateAction<string>>
  setShowCurrentPassword: Dispatch<SetStateAction<boolean>>
  setShowNewPassword: Dispatch<SetStateAction<boolean>>
  setShowConfirmPassword: Dispatch<SetStateAction<boolean>>
  handleChangePassword: (e: FormEvent) => Promise<void>
  isChangingPassword: boolean
}

export default function ProfileSecurityForm({
  currentPassword,
  newPassword,
  confirmPassword,
  showCurrentPassword,
  showNewPassword,
  showConfirmPassword,
  setCurrentPassword,
  setNewPassword,
  setConfirmPassword,
  setShowCurrentPassword,
  setShowNewPassword,
  setShowConfirmPassword,
  handleChangePassword,
  isChangingPassword
}: Props) {
  return (
    <div className='bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm'>
      <h2 className='text-xl font-bold mb-2 flex items-center gap-2'>
        <Lock className='text-primary w-5 h-5' /> Bảo mật & Đổi mật khẩu
      </h2>
      <p className='text-sm text-muted-foreground mb-6'>
        Đổi mật khẩu định kỳ để nâng cao bảo mật cho tài khoản ôn thi của bạn.
      </p>

      <form onSubmit={handleChangePassword} className='space-y-5 max-w-xl'>
        <div className='space-y-2'>
          <Label htmlFor='currentPassword'>Mật khẩu hiện tại</Label>
          <div className='relative'>
            <Input
              id='currentPassword'
              type={showCurrentPassword ? 'text' : 'password'}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder='Nhập mật khẩu hiện tại...'
              className='bg-muted/30 pr-10 rounded-xl'
            />
            <button
              type='button'
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className='absolute right-3 top-3 text-muted-foreground/60 hover:text-foreground transition-colors cursor-pointer'
            >
              {showCurrentPassword ? <EyeOff className='w-4 h-4' /> : <Eye className='w-4 h-4' />}
            </button>
          </div>
        </div>

        <div className='space-y-2'>
          <Label htmlFor='newPassword'>Mật khẩu mới</Label>
          <div className='relative'>
            <Input
              id='newPassword'
              type={showNewPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder='Nhập mật khẩu mới (tối thiểu 6 ký tự)...'
              className='bg-muted/30 pr-10 rounded-xl'
            />
            <button
              type='button'
              onClick={() => setShowNewPassword(!showNewPassword)}
              className='absolute right-3 top-3 text-muted-foreground/60 hover:text-foreground transition-colors cursor-pointer'
            >
              {showNewPassword ? <EyeOff className='w-4 h-4' /> : <Eye className='w-4 h-4' />}
            </button>
          </div>
        </div>

        <div className='space-y-2'>
          <Label htmlFor='confirmPassword'>Xác nhận mật khẩu mới</Label>
          <div className='relative'>
            <Input
              id='confirmPassword'
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder='Nhập lại mật khẩu mới...'
              className='bg-muted/30 pr-10 rounded-xl'
            />
            <button
              type='button'
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className='absolute right-3 top-3 text-muted-foreground/60 hover:text-foreground transition-colors cursor-pointer'
            >
              {showConfirmPassword ? <EyeOff className='w-4 h-4' /> : <Eye className='w-4 h-4' />}
            </button>
          </div>
        </div>

        <div className='pt-4 border-t border-border mt-6'>
          <Button
            type='submit'
            disabled={isChangingPassword}
            className='w-full sm:w-auto min-w-35 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer transition-all'
          >
            {isChangingPassword ? 'Đang xử lý...' : 'Cập Nhật Mật Khẩu'}
          </Button>
        </div>
      </form>
    </div>
  )
}
