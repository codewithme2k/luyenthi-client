export interface ILesson {
  id: string
  title: string
  content: string | null
  videoUrl: string | null
  googleDocUrl?: string | null
  order: number
  isFree: boolean
}

export interface IChapter {
  id: string
  title: string
  order: number
  lessons: ILesson[]
}

export interface ICourseDetails {
  id: string
  title: string
  description: string | null
  slug: string
  thumbnail: string | null
  isPremium: boolean
  chapters: IChapter[]
  category?: { name: string; slug: string } | null
}
