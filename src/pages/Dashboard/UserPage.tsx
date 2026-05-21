import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { fetchUser, deleteUser } from '@/redux/slice/userSlice'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination'
import { Input } from '@/components/ui/input'


import { toast } from 'sonner'
import Loading from '@/components/Layout/Loading'
import type { IUser } from '@/types/backend'
import { Edit, Trash2, Plus, Search, Activity } from 'lucide-react'

import UserFormModal from '@/components/Dashboard/User/UserFormModal'
import UserProgressModal from '@/components/Dashboard/User/UserProgressModal'

export default function UserPage() {
  const dispatch = useAppDispatch()
  const { data: users, isFetching, meta } = useAppSelector((state) => state.user)
  const [page, setPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const limit = 10
  const totalPages = Math.ceil((meta?.total || 0) / limit)

  const [openModal, setOpenModal] = useState(false)
  const [progressModalOpen, setProgressModalOpen] = useState(false)
  const [dataUpdate, setDataUpdate] = useState<IUser | null>(null)
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null)

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      dispatch(fetchUser({ query: `page=${page}&limit=${limit}&searchTerm=${searchTerm}` }))
    }, 500)

    return () => clearTimeout(delayDebounceFn)
  }, [dispatch, page, searchTerm])

  const loadUsers = () => {
    dispatch(fetchUser({ query: `page=${page}&limit=${limit}&searchTerm=${searchTerm}` }))
  }

  const handleDelete = async (id: string) => {
    try {
      await dispatch(deleteUser({ id })).unwrap()
      toast.success('User deleted successfully')
      loadUsers()
    } catch {
      toast.error('Failed to delete user')
    }
  }

  return (
    <div className='p-6 space-y-6 relative w-full max-w-7xl mx-auto page-bg animate-fade-in'>
      {isFetching && !openModal && <Loading />}

      <UserFormModal
        open={openModal}
        setOpen={setOpenModal}
        dataUpdate={dataUpdate}
        setDataUpdate={setDataUpdate}
        onSuccess={loadUsers}
      />

      <UserProgressModal
        open={progressModalOpen}
        setOpen={setProgressModalOpen}
        user={selectedUser}
      />

      <div className='flex justify-between items-center'>
        <h1 className='text-2xl font-bold'>User Management</h1>
        <div className='flex gap-4'>
          <div className='relative w-64'>
            <Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
            <Input
              placeholder='Search users...'
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setPage(1)
              }}
              className='pl-8'
            />
          </div>
          <Button
            onClick={() => {
              setDataUpdate(null)
              setOpenModal(true)
            }}
          >
            <Plus className='w-4 h-4 mr-2' /> Create User
          </Button>
        </div>
      </div>

      <div className='border rounded-md bg-card'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Age</TableHead>
              <TableHead className='text-right'>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 && !isFetching ? (
              <TableRow>
                <TableCell colSpan={5} className='text-center py-8 text-muted-foreground'>
                  No users found.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className='font-medium'>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role || 'USER'}</TableCell>
                  <TableCell>{user.age}</TableCell>
                  <TableCell className='text-right'>
                    <div className='flex justify-end gap-2'>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => {
                          setSelectedUser(user)
                          setProgressModalOpen(true)
                        }}
                        title='Tiến độ học tập'
                      >
                        <Activity className='w-4 h-4 text-primary' />
                      </Button>

                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => {
                          setDataUpdate(user)
                          setOpenModal(true)
                        }}
                      >
                        <Edit className='w-4 h-4' />
                      </Button>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant='destructive' size='sm'>
                            <Trash2 className='w-4 h-4' />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the user account.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(user.id)}>Continue</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className='mt-4'>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href='#'
                  onClick={(e) => {
                    e.preventDefault()
                    if (page > 1) setPage(page - 1)
                  }}
                  className={page === 1 ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>

              {Array.from({ length: totalPages }).map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    href='#'
                    isActive={page === i + 1}
                    onClick={(e) => {
                      e.preventDefault()
                      setPage(i + 1)
                    }}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  href='#'
                  onClick={(e) => {
                    e.preventDefault()
                    if (page < totalPages) setPage(page + 1)
                  }}
                  className={page >= totalPages ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  )
}
