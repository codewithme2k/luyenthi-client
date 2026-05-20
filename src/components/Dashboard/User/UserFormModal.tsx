import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { createUser, updateUser } from '@/redux/slice/userSlice'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import type { IUser, ICreateUser } from '@/types/backend'

export interface IUserFormProps {
  open: boolean
  setOpen: (v: boolean) => void
  dataUpdate: IUser | null
  setDataUpdate: (v: IUser | null) => void
  onSuccess: () => void
}

const UserFormModal = ({ open, setOpen, dataUpdate, setDataUpdate, onSuccess }: IUserFormProps) => {
  const { register, handleSubmit, reset } = useForm<ICreateUser>()
  const dispatch = useAppDispatch()
  const { isFetching } = useAppSelector((state) => state.user)

  useEffect(() => {
    if (dataUpdate) {
      reset({
        name: dataUpdate.name,
        email: dataUpdate.email,
        age: dataUpdate.age,
        gender: dataUpdate.gender,
        address: dataUpdate.address,
        contactNo: dataUpdate.contactNo,
        role: dataUpdate.role || 'USER'
      })
    } else {
      reset({
        name: '',
        email: '',
        password: '',
        age: 0,
        gender: '',
        address: '',
        contactNo: '',
        role: 'USER'
      })
    }
  }, [dataUpdate, reset, open])

  const onSubmit = async (data: ICreateUser) => {
    try {
      if (dataUpdate) {
        await dispatch(updateUser({ user: data as any, id: dataUpdate.id })).unwrap()
        toast.success('User updated successfully')
      } else {
        await dispatch(createUser(data)).unwrap()
        toast.success('User created successfully')
      }
      setOpen(false)
      setDataUpdate(null)
      reset()
      onSuccess()
    } catch {
      toast.error(dataUpdate ? 'Failed to update user' : 'Failed to create user')
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v)
        if (!v) setDataUpdate(null)
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{dataUpdate ? 'Update User' : 'Create New User'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4 max-h-[80vh] overflow-y-auto p-1'>
          <div className='space-y-2'>
            <Label htmlFor='name'>Name</Label>
            <Input id='name' {...register('name', { required: true })} />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='email'>Email</Label>
            <Input id='email' type='email' {...register('email', { required: true })} />
          </div>
          {!dataUpdate && (
            <div className='space-y-2'>
              <Label htmlFor='password'>Password</Label>
              <Input id='password' type='password' {...register('password', { required: true })} />
            </div>
          )}
          <div className='space-y-2'>
            <Label htmlFor='role'>Role</Label>
            <select
              id='role'
              {...register('role')}
              className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
            >
              <option value='USER'>USER</option>
              <option value='ADMIN'>ADMIN</option>
              <option value='SUPER_ADMIN'>SUPER_ADMIN</option>
            </select>
          </div>
          <div className='space-y-2'>
            <Label htmlFor='age'>Age</Label>
            <Input id='age' type='number' {...register('age', { required: true, valueAsNumber: true })} />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='gender'>Gender</Label>
            <Input id='gender' {...register('gender', { required: true })} placeholder='Male/Female' />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='address'>Address</Label>
            <Input id='address' {...register('address', { required: true })} />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='contactNo'>Contact No</Label>
            <Input id='contactNo' {...register('contactNo')} />
          </div>
          <Button type='submit' disabled={isFetching} className='w-full sticky bottom-0'>
            {isFetching ? 'Saving...' : dataUpdate ? 'Update User' : 'Create User'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default UserFormModal
