import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Lesson } from '../../types/training';
import { EnrolledStudent } from '../../types/student';

const attendanceEntrySchema = z.object({
  joinTime: z.string(),
  leaveTime: z.string()
});

const studentAttendanceSchema = z.object({
  studentId: z.string(),
  entries: z.array(attendanceEntrySchema)
});

const attendanceFormSchema = z.object({
  completionThreshold: z.number().min(0).max(100),
  records: z.array(studentAttendanceSchema)
});

type AttendanceFormData = z.infer<typeof attendanceFormSchema>;

interface AttendanceFormProps {
  lesson: Lesson;
  enrolledStudents: EnrolledStudent[];
  onSubmit: (data: AttendanceFormData) => void;
  onCancel: () => void;
}

export function AttendanceForm({
  lesson,
  enrolledStudents,
  onSubmit,
  onCancel
}: AttendanceFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm<AttendanceFormData>({
    resolver: zodResolver(attendanceFormSchema),
    defaultValues: {
      completionThreshold: lesson.completionThreshold || 80,
      records: enrolledStudents.map(student => ({
        studentId: student.id,
        entries: [{ joinTime: '', leaveTime: '' }]
      }))
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Completion Threshold (%)
        </label>
        <input
          type="number"
          {...register('completionThreshold', { valueAsNumber: true })}
          className="mt-1 block w-full rounded-md border-gray-300 p-2.5 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          min="0"
          max="100"
        />
        {errors.completionThreshold && (
          <p className="mt-1 text-sm text-red-600">{errors.completionThreshold.message}</p>
        )}
      </div>

      <div className="space-y-4">
        {enrolledStudents.map((student, studentIndex) => (
          <div key={student.id} className="border rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3">{student.name}</h4>
            <div className="space-y-3">
              {/* Attendance entries */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Join Time</label>
                  <input
                    type="time"
                    {...register(`records.${studentIndex}.entries.0.joinTime`)}
                    className="mt-1 block w-full rounded-md border-gray-300 p-2.5 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Leave Time</label>
                  <input
                    type="time"
                    {...register(`records.${studentIndex}.entries.0.leaveTime`)}
                    className="mt-1 block w-full rounded-md border-gray-300 p-2.5 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Save Attendance
        </button>
      </div>
    </form>
  );
}