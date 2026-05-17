import React, { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { fetchQuestion } from '@/redux/slice/questionSlice'
import { callFetchExamBySlug, callSubmitExam } from '@/config/api'
import { toast } from 'sonner'
import type { IExam } from '@/types/backend'

import { ExamHeader } from './ExamHeader'
import { ExamSidebar } from './ExamSidebar'
import { QuestionItem } from './QuestionItem'
import { ExamResult } from './ExamResult'
import { Skeleton } from '@/components/ui/skeleton'

export const ExamTestPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const [exam, setExam] = useState<IExam | null>(null)
  const [isFetchingExam, setIsFetchingExam] = useState(true)

  const { data: questions, isFetching: isFetchingQuestions } = useAppSelector((state) => state.question)

  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [flags, setFlags] = useState<Record<string, boolean>>({})
  const [currentIndex, setCurrentIndex] = useState(0)

  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submittedSessionId, setSubmittedSessionId] = useState<string | undefined>(undefined)

  const [timeLeft, setTimeLeft] = useState(0)
  const [timeSpent, setTimeSpent] = useState(0)

  // Fetch Exam
  useEffect(() => {
    const loadExam = async () => {
      if (!slug) return
      setIsFetchingExam(true)
      try {
        const res = await callFetchExamBySlug(slug)
        if (res.data?.success && res.data?.data) {
          const examData = res.data.data
          setExam(examData)
          setTimeLeft(examData.duration * 60) // duration is in minutes
          // Fetch questions for this exam
          dispatch(fetchQuestion({ query: `examId=${examData.id}&limit=1000` }))
        } else {
          toast.error('Không tìm thấy đề thi!')
          navigate('/exams')
        }
      } catch (error) {
        toast.error('Lỗi khi tải đề thi!')
        navigate('/exams')
      } finally {
        setIsFetchingExam(false)
      }
    }
    loadExam()
  }, [slug, dispatch, navigate])

  // Timer
  useEffect(() => {
    if (!exam || isSubmitted || isFetchingQuestions || isFetchingExam) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          handleSubmit() // Auto submit when time is up
          return 0
        }
        return prev - 1
      })
      setTimeSpent((prev) => prev + 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [exam, isSubmitted, isFetchingQuestions, isFetchingExam]) // Removed handleSubmit from dependencies to avoid recreation loop

  const handleAnswerChange = useCallback(
    (answer: any) => {
      if (questions.length === 0) return
      const qId = questions[currentIndex].id
      setAnswers((prev) => ({
        ...prev,
        [qId]: answer
      }))
    },
    [currentIndex, questions]
  )

  const toggleFlag = useCallback(() => {
    if (questions.length === 0) return
    const qId = questions[currentIndex].id
    setFlags((prev) => ({
      ...prev,
      [qId]: !prev[qId]
    }))
  }, [currentIndex, questions])

  const handleNavigate = useCallback(
    (index: number) => {
      if (index >= 0 && index < questions.length) {
        setCurrentIndex(index)
      }
    },
    [questions.length]
  )

  const handleSubmit = useCallback(async () => {
    if (!exam) return
    setIsSubmitting(true)
    try {
      const payload = {
        answers,
        timeSpent
      }
      const res = await callSubmitExam(exam.id, payload)
      if (res.data?.success) {
        setSubmittedSessionId(res.data.data?.sessionId)
        setIsSubmitted(true)
        toast.success('Nộp bài thành công! Điểm số đã được lưu lại.')
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else {
        toast.error(res.data?.message || 'Lỗi khi nộp bài!')
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Lỗi hệ thống khi kết nối tới máy chủ.')
    } finally {
      setIsSubmitting(false)
    }
  }, [exam, answers, timeSpent])

  const handleConfirmSubmit = () => {
    const answeredCount = Object.keys(answers).filter((k) => {
      const val = answers[k]
      if (Array.isArray(val)) return val.length > 0
      return val !== undefined && val !== null && val !== ''
    }).length

    if (answeredCount < questions.length) {
      if (window.confirm(`Bạn còn ${questions.length - answeredCount} câu chưa làm. Bạn có chắc chắn muốn nộp bài?`)) {
        handleSubmit()
      }
    } else {
      if (window.confirm('Bạn có chắc chắn muốn nộp bài?')) {
        handleSubmit()
      }
    }
  }

  // Loading State
  if (isFetchingExam || isFetchingQuestions) {
    return (
      <div className='min-h-screen bg-background page-bg pt-20 px-6 text-center'>
        <Skeleton className='h-10 w-64 mx-auto mb-8 rounded-xl' />
        <div className='grid grid-cols-1 lg:grid-cols-4 gap-8 container mx-auto max-w-[1400px]'>
          <div className='lg:col-span-3'>
            <Skeleton className='h-96 w-full rounded-2xl' />
          </div>
          <div className='lg:col-span-1'>
            <Skeleton className='h-[400px] w-full rounded-2xl' />
          </div>
        </div>
      </div>
    )
  }

  // Not Found State
  if (!exam) {
    return null // Handled in useEffect redirect
  }

  // Result State
  if (isSubmitted) {
    return (
      <div className='min-h-screen bg-background page-bg'>
        <ExamResult
          exam={exam}
          questions={questions}
          answers={answers}
          timeSpent={timeSpent}
          sessionId={submittedSessionId}
          onBackToExams={() => navigate('/exams')}
        />
      </div>
    )
  }

  const currentQuestion = questions[currentIndex]

  return (
    <div className='min-h-screen bg-background page-bg flex flex-col'>
      <ExamHeader title={exam.title} timeLeft={timeLeft} onSubmit={handleConfirmSubmit} isSubmitting={isSubmitting} />

      <main className='flex-1 container mx-auto px-4 pt-6 pb-28 max-w-[1400px]'>
        {questions.length === 0 ? (
          <div className='glass p-12 rounded-2xl text-center'>Đề thi này chưa có câu hỏi nào.</div>
        ) : (
          <div className='grid grid-cols-1 lg:grid-cols-4 gap-6 relative'>
            {/* Left: Question Content */}
            <div className='lg:col-span-3 flex flex-col gap-6 relative'>
              <QuestionItem
                question={currentQuestion}
                index={currentIndex}
                answer={answers[currentQuestion.id]}
                onAnswerChange={handleAnswerChange}
                isFlagged={!!flags[currentQuestion.id]}
                onToggleFlag={toggleFlag}
              />

              {/* Fixed Bottom Navigation Buttons */}
              <div className='fixed bottom-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-t border-border shadow-[0_-10px_30px_rgba(0,0,0,0.05)]'>
                <div className='container mx-auto max-w-[1400px] px-4 py-4 flex justify-between items-center lg:pr-[calc(25%+2rem)] xl:pr-[calc(20%+2rem)]'>
                  <button
                    onClick={() => handleNavigate(currentIndex - 1)}
                    disabled={currentIndex === 0}
                    className='px-6 py-2.5 rounded-xl font-bold border-2 border-border bg-background hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
                  >
                    &larr; Câu trước
                  </button>
                  <button
                    onClick={() => handleNavigate(currentIndex + 1)}
                    disabled={currentIndex === questions.length - 1}
                    className='px-8 py-2.5 rounded-xl font-bold bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5'
                  >
                    Câu tiếp theo &rarr;
                  </button>
                </div>
              </div>
            </div>

            {/* Right: Sidebar Minimap */}
            <div className='lg:col-span-1 lg:sticky lg:top-24 h-fit'>
              <ExamSidebar
                questions={questions}
                answers={answers}
                flags={flags}
                currentIndex={currentIndex}
                onNavigate={handleNavigate}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default ExamTestPage
