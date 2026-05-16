import { Button } from '@/components/ui/button'
import React from 'react'
import { Link } from 'react-router'

const HomePage: React.FC = () => {
  return (
    <>
      <div className='w-full'>
        <section className='space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32'>
          <div className='container flex max-w-5xl flex-col items-center gap-4 text-center mx-auto'>
            <h1 className='font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight'>
              Find your next dream job <br className='hidden sm:inline' />
              with <span className='text-blue-600'>Confidence</span>.
            </h1>
            <p className='leading-normal text-slate-500 sm:text-xl sm:leading-8'>
              The best companies are hiring. Create a profile and get discovered by top employers.
            </p>
            <div className='space-x-4'>
              <Link to='/jobs'>
                <Button size='lg'>Browse Jobs</Button>
              </Link>
              <Link to='/auth/register'>
                <Button variant='outline' size='lg'>
                  Create Account
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className='container mx-auto py-12 px-4'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            <div className='p-6 bg-white rounded-lg shadow-sm border border-slate-100'>
              <h3 className='font-bold text-xl mb-2'>For Candidates</h3>
              <p className='text-slate-600'>
                Build your profile, upload your CV, and apply to thousands of jobs with a single click.
              </p>
            </div>
            <div className='p-6 bg-white rounded-lg shadow-sm border border-slate-100'>
              <h3 className='font-bold text-xl mb-2'>For Employers</h3>
              <p className='text-slate-600'>
                Post jobs, manage applications, and find the perfect candidate using our advanced filters.
              </p>
            </div>
            <div className='p-6 bg-white rounded-lg shadow-sm border border-slate-100'>
              <h3 className='font-bold text-xl mb-2'>Analytics</h3>
              <p className='text-slate-600'>
                Track your application status and see market trends to negotiate better salaries.
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

export default HomePage
