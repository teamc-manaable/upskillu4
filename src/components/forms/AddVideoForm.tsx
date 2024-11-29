import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const videoSchema = z.object({
  videoUrl: z.string().url('Please enter a valid URL'),
  videoProvider: z.enum(['youtube', 'vimeo'], {
    required_error: 'Please select a video provider'
  }),
  videoTitle: z.string().min(3, 'Title must be at least 3 characters')
});

type VideoFormData = z.infer<typeof videoSchema>;

interface AddVideoFormProps {
  onSubmit: (data: VideoFormData) => void;
  onCancel: () => void;
}

export function AddVideoForm({ onSubmit, onCancel }: AddVideoFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<VideoFormData>({
    resolver: zodResolver(videoSchema)
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="videoTitle" className="block text-sm font-medium text-gray-700">
          Video Title
        </label>
        <input
          type="text"
          id="videoTitle"
          {...register('videoTitle')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        {errors.videoTitle && (
          <p className="mt-1 text-sm text-red-600">{errors.videoTitle.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="videoProvider" className="block text-sm font-medium text-gray-700">
          Video Provider
        </label>
        <select
          id="videoProvider"
          {...register('videoProvider')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="">Select a provider</option>
          <option value="youtube">YouTube</option>
          <option value="vimeo">Vimeo</option>
        </select>
        {errors.videoProvider && (
          <p className="mt-1 text-sm text-red-600">{errors.videoProvider.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="videoUrl" className="block text-sm font-medium text-gray-700">
          Video URL
        </label>
        <input
          type="url"
          id="videoUrl"
          {...register('videoUrl')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="https://youtube.com/watch?v=..."
        />
        {errors.videoUrl && (
          <p className="mt-1 text-sm text-red-600">{errors.videoUrl.message}</p>
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
          {isSubmitting ? 'Adding...' : 'Add Video'}
        </button>
      </div>
    </form>
  );
}