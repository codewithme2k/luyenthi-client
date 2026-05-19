import type { FieldErrors, UseFormHandleSubmit, UseFormRegister } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Camera, Save, User } from 'lucide-react'
import type { ProfileFormValues, ProfileUser } from '@/types/profile'
import type { RefObject } from 'react'

interface Props {
  user: ProfileUser
  profileImg: string | null
  getImageUrl: (url: string | null | undefined) => string
  fileInputRef: RefObject<HTMLInputElement | null>
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>
  register: UseFormRegister<ProfileFormValues>
  handleSubmit: UseFormHandleSubmit<ProfileFormValues>
  errors: FieldErrors<ProfileFormValues>
  onSubmit: (data: ProfileFormValues) => Promise<void>
  isUpdating: boolean
  genderValue: ProfileFormValues['gender']
  onGenderChange: (value: ProfileFormValues['gender']) => void
}

export default function ProfileDetailsForm({
  user,
  profileImg,
  getImageUrl,
  fileInputRef,
  handleFileChange,
  register,
  handleSubmit,
  errors,
  onSubmit,
  isUpdating,
  genderValue,
  onGenderChange
}: Props) {
  return (
    <div className='bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm'>
      <h2 className='text-xl font-bold mb-6 flex items-center gap-2'>
        <User className='text-primary w-5 h-5' /> Cập nhật thông tin
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-5 max-w-2xl'>
        <div className='flex flex-col items-center sm:items-start gap-4 mb-6 pb-6 border-b border-border'>
          <Label className='text-sm font-semibold text-muted-foreground'>Ảnh Đại Diện</Label>
          <div className='relative group cursor-pointer' onClick={() => fileInputRef.current?.click()}>
            <div className='w-24 h-24 rounded-full overflow-hidden border-2 border-border group-hover:border-primary transition-all flex items-center justify-center bg-muted relative'>
              {(profileImg ?? user.profileImg) ? (
                <img
                  src={getImageUrl(profileImg ?? user.profileImg)}
                  alt='Avatar'
                  className='w-full h-full object-cover'
                />
              ) : (
                <div className='text-2xl font-bold text-muted-foreground uppercase'>{user.name.charAt(0) || 'U'}</div>
              )}
              <div className='absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[10px] font-bold'>
                <Camera className='w-5 h-5 mb-0.5' />
                <span>Thay ảnh</span>
              </div>
            </div>
          </div>
          <input type='file' ref={fileInputRef} onChange={handleFileChange} accept='image/*' className='hidden' />
          <p className='text-xs text-muted-foreground'>Chấp nhận JPG, PNG, GIF. Kích thước tối đa 5MB.</p>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 gap-5'>
          <div className='space-y-2'>
            <Label htmlFor='name'>Họ và Tên</Label>
            <Input id='name' {...register('name', { required: 'Vui lòng nhập tên' })} className='bg-muted/30' />
            {errors.name && <p className='text-sm text-destructive'>{errors.name.message as string}</p>}
          </div>
          <div className='space-y-2'>
            <Label htmlFor='email'>Email (Không thể thay đổi)</Label>
            <Input id='email' value={user.email} disabled className='bg-muted opacity-60' />
          </div>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 gap-5'>
          <div className='space-y-2'>
            <Label htmlFor='contactNo'>Số điện thoại</Label>
            <Input id='contactNo' {...register('contactNo')} className='bg-muted/30' />
          </div>
          <div className='space-y-2'>
            <Label>Giới tính</Label>
            <Select
              onValueChange={(val) => onGenderChange(val as ProfileFormValues['gender'])}
              defaultValue={genderValue}
            >
              <SelectTrigger className='bg-muted/30'>
                <SelectValue placeholder='Chọn giới tính' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='male'>Nam</SelectItem>
                <SelectItem value='female'>Nữ</SelectItem>
                <SelectItem value='other'>Khác</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className='space-y-2'>
          <Label htmlFor='address'>Địa chỉ</Label>
          <Input id='address' {...register('address')} className='bg-muted/30' />
        </div>

        <div className='pt-4 border-t border-border'>
          <Button type='submit' disabled={isUpdating} className='w-full sm:w-auto min-w-35 rounded-xl font-bold'>
            {isUpdating ? (
              'Đang lưu...'
            ) : (
              <>
                <Save className='w-4 h-4 mr-2' /> Lưu Thay Đổi
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
