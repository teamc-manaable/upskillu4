import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const lessonSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  date: z.string().min(1, 'Date is required'),
  startTime: z.string().min(1, 'Start time is required'),
  duration: z.string().min(1, 'Duration is required'),
  completionThreshold: z.number().min(0).max(100, 'Threshold must be between 0 and 100'),
  zoomLink: z.string().url('Must be a valid URL').optional().or(z.literal(''))
});

type LessonFormData = z.infer<typeof lessonSchema>;

interface CreateLessonFormProps {
  onSubmit: (data: LessonFormData) => void;
  onCancel: () => void;
  lessonNumber: number;
}

export function CreateLessonForm({ onSubmit, onCancel, lessonNumber }: CreateLessonFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LessonFormData>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      completionThreshold: 80
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900">Lesson #{lessonNumber}</h3>
      </div>

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Lesson Title
        </label>
        <input
          type="text"
          id="title"
          {...register('title')}
          className="mt-1 block w-full rounded-md border-gray-300 p-2.5 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          disabled={isSubmitting}
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="date" className="block text-sm font-medium text-gray-700">
          Date
        </label>
        <input
          type="date"
          id="date"
          {...register('date')}
          className="mt-1 block w-full rounded-md border-gray-300 p-2.5 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          disabled={isSubmitting}
        />
        {errors.date && (
          <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">
          Start Time
        </label>
        <input
          type="time"
          id="startTime"
          {...register('startTime')}
          className="mt-1 block w-full rounded-md border-gray-300 p-2.5 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          disabled={isSubmitting}
        />
        {errors.startTime && (
          <p className="mt-1 text-sm text-red-600">{errors.startTime.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
          Duration
        </label>
        <select
          id="duration"
          {...register('duration')}
          className="mt-1 block w-full rounded-md border-gray-300 p-2.5 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          disabled={isSubmitting}
        >
          <option value="1 hour">1 hour</option>
          <option value="1.5 hours">1.5 hours</option>
          <option value="2 hours">2 hours</option>
          <option value="3 hours">3 hours</option>
        </select>
        {errors.duration && (
          <p className="mt-1 text-sm text-red-600">{errors.duration.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="completionThreshold" className="block text-sm font-medium text-gray-700">
          Completion Threshold (%)
        </label>
        <input
          type="number"
          id="completionThreshold"
          {...register('completionThreshold', { valueAsNumber: true })}
          className="mt-1 block w-full rounded-md border-gray-300 p-2.5 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          min="0"
          max="100"
          disabled={isSubmitting}
        />
        {errors.completionThreshold && (
          <p className="mt-1 text-sm text-red-600">{errors.completionThreshold.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="zoomLink" className="block text-sm font-medium text-gray-700">
          Zoom Link (Optional)
        </label>
        <input
          type="url"
          id="zoomLink"
          {...register('zoomLink')}
          className="mt-1 block w-full rounded-md border-gray-300 p-2.5 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="https://zoom.us/j/..."
          disabled={isSubmitting}
        />
        {errors.zoomLink && (
          <p className="mt-1 text-sm text-red-600">{errors.zoomLink.message}</p>
        )}
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-indigo-400"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating...' : 'Create Lesson'}
        </button>
      </div>
    </form>
  );
}