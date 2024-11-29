export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      admins: {
        Row: {
          id: string
          email: string
          name: string
          role: 'admin' | 'trainer'
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          role: 'admin' | 'trainer'
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          role?: 'admin' | 'trainer'
          created_at?: string
        }
      }
      trainings: {
        Row: {
          id: string
          title: string
          description: string
          start_date: string
          duration: string
          max_students: number
          created_at: string
          created_by: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          start_date: string
          duration: string
          max_students: number
          created_at?: string
          created_by: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          start_date?: string
          duration?: string
          max_students?: number
          created_at?: string
          created_by?: string
        }
      }
      lessons: {
        Row: {
          id: string
          training_id: string
          title: string
          date: string
          start_time: string
          duration: string
          zoom_link: string | null
          completion_threshold: number
          created_at: string
          created_by: string
        }
        Insert: {
          id?: string
          training_id: string
          title: string
          date: string
          start_time: string
          duration: string
          zoom_link?: string | null
          completion_threshold: number
          created_at?: string
          created_by: string
        }
        Update: {
          id?: string
          training_id?: string
          title?: string
          date?: string
          start_time?: string
          duration?: string
          zoom_link?: string | null
          completion_threshold?: number
          created_at?: string
          created_by?: string
        }
      }
      enrollments: {
        Row: {
          id: string
          training_id: string
          student_id: string
          enrollment_date: string
          created_at: string
        }
        Insert: {
          id?: string
          training_id: string
          student_id: string
          enrollment_date: string
          created_at?: string
        }
        Update: {
          id?: string
          training_id?: string
          student_id?: string
          enrollment_date?: string
          created_at?: string
        }
      }
      attendance: {
        Row: {
          id: string
          lesson_id: string
          student_id: string
          join_time: string
          leave_time: string
          created_at: string
        }
        Insert: {
          id?: string
          lesson_id: string
          student_id: string
          join_time: string
          leave_time: string
          created_at?: string
        }
        Update: {
          id?: string
          lesson_id?: string
          student_id?: string
          join_time?: string
          leave_time?: string
          created_at?: string
        }
      }
    }
  }
}