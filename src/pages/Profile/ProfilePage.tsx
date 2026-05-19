import { useEffect, useState, useRef } from 'react'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { useNavigate } from 'react-router'
import {
  callFetchMySessions,
  callUpdateProfile,
  callUploadFile,
  callGetSavedPosts,
  callChangePassword
} from '@/config/api'
import { updateAccount } from '@/redux/slice/accountSlice'
import type { IPost } from '@/types/backend'
import type { IExamSession, ProfileFormValues } from '@/types/profile'
import ProfileAnalytics from '@/components/Client/Profile/ProfileAnalytics'
import ProfileHistory from '@/components/Client/Profile/ProfileHistory'
import ProfileSavedPosts from '@/components/Client/Profile/ProfileSavedPosts'
import ProfileDetailsForm from '@/components/Client/Profile/ProfileDetailsForm'
import ProfileSecurityForm from '@/components/Client/Profile/ProfileSecurityForm'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { History, TrendingUp, Bookmark, User, Lock } from 'lucide-react'
import Loading from '@/components/Layout/Loading'

type AxiosErrorLike = {
  response?: {
    data?: {
      message?: string
    }
  }
}

const normalizeGender = (gender?: string): ProfileFormValues['gender'] =>
  gender === 'female' || gender === 'other' ? gender : 'male'

export default function ProfilePage() {
  const user = useAppSelector((state) => state.account.user)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const [sessions, setSessions] = useState<IExamSession[]>([])
  const [isLoadingHistory, setIsLoadingHistory] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [profileImg, setProfileImg] = useState<string | null>(user?.profileImg || null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const [savedPosts, setSavedPosts] = useState<IPost[]>([])
  const [isLoadingSaved, setIsLoadingSaved] = useState(false)

  // States for Change Password Form
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('Vui lòng điền đầy đủ tất cả các trường!')
      return
    }
    if (newPassword.length < 6) {
      toast.error('Mật khẩu mới phải có độ dài từ 6 ký tự trở lên!')
      return
    }
    if (newPassword === currentPassword) {
      toast.error('Mật khẩu mới không được trùng với mật khẩu hiện tại!')
      return
    }
    if (newPassword !== confirmPassword) {
      toast.error('Mật khẩu mới và xác nhận mật khẩu không trùng khớp!')
      return
    }

    setIsChangingPassword(true)
    const toastId = toast.loading('Đang cập nhật mật khẩu...')
    try {
      const res = await callChangePassword(currentPassword, newPassword)
      if (res.data?.success) {
        toast.success('Đổi mật khẩu thành công!', { id: toastId })
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
      } else {
        toast.error(res.data?.message || 'Đổi mật khẩu thất bại!', { id: toastId })
      }
    } catch (error) {
      const errorMsg =
        error &&
        typeof error === 'object' &&
        'response' in error &&
        typeof (error as AxiosErrorLike).response?.data?.message === 'string'
          ? (error as AxiosErrorLike).response?.data?.message
          : 'Mật khẩu hiện tại không chính xác!'
      toast.error(errorMsg, { id: toastId })
    } finally {
      setIsChangingPassword(false)
    }
  }

  const getImageUrl = (url: string | null | undefined) => {
    if (!url) return ''
    if (url.startsWith('http')) return url
    const backendUrl = (import.meta.env.VITE_BACKEND_URL as string) || ''
    const cleanBackendUrl = backendUrl.endsWith('/') ? backendUrl.slice(0, -1) : backendUrl
    const cleanUrl = url.startsWith('/') ? url : `/${url}`
    return `${cleanBackendUrl}${cleanUrl}`
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Ảnh quá nặng! Vui lòng chọn ảnh dưới 5MB.')
      return
    }

    const formData = new FormData()
    formData.append('file', file)

    const toastId = toast.loading('Đang tải ảnh đại diện lên...')
    try {
      const res = await callUploadFile(formData)
      if (res.data?.success) {
        const imageUrl = res.data.data.url
        setProfileImg(imageUrl)
        toast.success('Tải ảnh lên thành công!', { id: toastId })
      } else {
        toast.error('Tải ảnh thất bại!', { id: toastId })
      }
    } catch (error) {
      console.error(error)
      toast.error('Lỗi khi kết nối với máy chủ upload!', { id: toastId })
    }
  }

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<ProfileFormValues>({
    defaultValues: {
      name: user?.name || '',
      contactNo: user?.contactNo || '',
      address: user?.address || '',
      gender: normalizeGender(user?.gender)
    }
  })

  useEffect(() => {
    const loadProfileData = async () => {
      setIsLoadingHistory(true)
      setIsLoadingSaved(true)

      try {
        const sessionsRes = await callFetchMySessions()
        if (sessionsRes.data?.success) {
          setSessions(sessionsRes.data.data)
        }
      } catch {
        toast.error('Lỗi khi lấy danh sách lịch sử thi.')
      }

      try {
        const savedRes = await callGetSavedPosts()
        if (savedRes.data?.success) {
          setSavedPosts(savedRes.data.data)
        }
      } catch (error) {
        console.error('Lỗi khi lấy danh sách bài viết đã lưu:', error)
      } finally {
        setIsLoadingHistory(false)
        setIsLoadingSaved(false)
      }
    }

    loadProfileData()

    if (user) {
      setValue('name', user.name || '')
      setValue('contactNo', user.contactNo || '')
      setValue('address', user.address || '')
      setValue('gender', normalizeGender(user.gender))
    }
  }, [user, setValue])

  const onSubmit = async (data: ProfileFormValues) => {
    setIsUpdating(true)
    const payload = { ...data, profileImg: profileImg ?? user?.profileImg }
    try {
      const res = await callUpdateProfile(payload)
      if (res.data?.success) {
        toast.success('Cập nhật thông tin thành công!')
        // Update local Redux state
        dispatch(updateAccount({ user: { ...user, ...payload } }))
      }
    } catch {
      toast.error('Đã có lỗi xảy ra khi cập nhật!')
    } finally {
      setIsUpdating(false)
    }
  }

  if (!user || !user.id) {
    return <Loading />
  }

  return (
    <div className='container max-w-7xl mx-auto py-10 px-4 sm:px-6'>
      <div className='mb-8'>
        <h1 className='text-3xl font-heading font-bold text-foreground'>Hồ Sơ Cá Nhân</h1>
        <p className='text-muted-foreground mt-2'>
          Quản lý thông tin tài khoản và xem lịch sử các bài thi bạn đã hoàn thành.
        </p>
      </div>

      <Tabs defaultValue='history' className='space-y-6'>
        <TabsList className='bg-muted/50 p-1 rounded-xl flex flex-wrap gap-1'>
          <TabsTrigger
            value='history'
            className='rounded-lg border border-transparent px-6 py-2.5 flex items-center gap-2 data-[state=active]:border-primary data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-sm cursor-pointer'
          >
            <History className='w-4 h-4' /> Lịch sử thi
          </TabsTrigger>
          <TabsTrigger
            value='analytics'
            className='rounded-lg border border-transparent px-6 py-2.5 flex items-center gap-2 data-[state=active]:border-primary data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-sm cursor-pointer'
          >
            <TrendingUp className='w-4 h-4' /> Báo cáo năng lực
          </TabsTrigger>
          <TabsTrigger
            value='saved'
            className='rounded-lg border border-transparent px-6 py-2.5 flex items-center gap-2 data-[state=active]:border-primary data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-sm cursor-pointer'
          >
            <Bookmark className='w-4 h-4' /> Bài viết đã lưu
          </TabsTrigger>
          <TabsTrigger
            value='profile'
            className='rounded-lg border border-transparent px-6 py-2.5 flex items-center gap-2 data-[state=active]:border-primary data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-sm cursor-pointer'
          >
            <User className='w-4 h-4' /> Thông tin cá nhân
          </TabsTrigger>
          <TabsTrigger
            value='security'
            className='rounded-lg border border-transparent px-6 py-2.5 flex items-center gap-2 data-[state=active]:border-primary data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-sm cursor-pointer'
          >
            <Lock className='w-4 h-4' /> Bảo mật & Mật khẩu
          </TabsTrigger>
        </TabsList>

        <TabsContent value='analytics' className='animate-fade-in outline-none space-y-6'>
          <ProfileAnalytics sessions={sessions} navigate={navigate} />
        </TabsContent>

        <TabsContent value='history' className='animate-fade-in outline-none'>
          <ProfileHistory sessions={sessions} isLoading={isLoadingHistory} navigate={navigate} />
        </TabsContent>

        <TabsContent value='saved' className='animate-fade-in outline-none'>
          <ProfileSavedPosts savedPosts={savedPosts} isLoading={isLoadingSaved} />
        </TabsContent>

        <TabsContent value='profile' className='animate-fade-in outline-none'>
          <ProfileDetailsForm
            user={user}
            profileImg={profileImg}
            getImageUrl={getImageUrl}
            fileInputRef={fileInputRef}
            handleFileChange={handleFileChange}
            register={register}
            handleSubmit={handleSubmit}
            errors={errors}
            onSubmit={onSubmit}
            isUpdating={isUpdating}
            genderValue={normalizeGender(user?.gender)}
            onGenderChange={(value) => setValue('gender', value)}
          />
        </TabsContent>

        <TabsContent value='security' className='animate-fade-in outline-none'>
          <ProfileSecurityForm
            currentPassword={currentPassword}
            newPassword={newPassword}
            confirmPassword={confirmPassword}
            showCurrentPassword={showCurrentPassword}
            showNewPassword={showNewPassword}
            showConfirmPassword={showConfirmPassword}
            setCurrentPassword={setCurrentPassword}
            setNewPassword={setNewPassword}
            setConfirmPassword={setConfirmPassword}
            setShowCurrentPassword={setShowCurrentPassword}
            setShowNewPassword={setShowNewPassword}
            setShowConfirmPassword={setShowConfirmPassword}
            isChangingPassword={isChangingPassword}
            handleChangePassword={handleChangePassword}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
