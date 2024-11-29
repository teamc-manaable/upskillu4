import { Training } from '../types/training';

export const mockTrainings: Training[] = [
  {
    id: '1',
    title: "React Advanced Concepts",
    description: "Deep dive into React hooks, context, and performance optimization techniques.",
    startDate: "2024-03-15",
    duration: "8 weeks",
    maxStudents: 20,
    enrolledStudents: [
      {
        id: '1',
        email: 'john.doe@manaable.com',
        name: 'John Doe',
        department: 'Engineering',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
        enrollmentDate: '2024-03-01',
        attendance: 85
      },
      {
        id: '2',
        email: 'jane.smith@manaable.com',
        name: 'Jane Smith',
        department: 'Design',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=32&h=32&fit=crop&crop=face',
        enrollmentDate: '2024-03-02',
        attendance: 90
      }
    ],
    lessons: [
      {
        id: '1-1',
        title: "Introduction to Advanced Hooks",
        date: "2024-03-15",
        startTime: "10:00",
        duration: "2 hours",
        zoomLink: "https://zoom.us/j/123456789",
        completionThreshold: 80,
        attendance: {
          lessonId: '1-1',
          completionThreshold: 80,
          studentAttendance: [
            {
              studentId: '1',
              entries: [
                { joinTime: "10:00", leaveTime: "10:45" },
                { joinTime: "11:00", leaveTime: "12:00" }
              ],
              attendancePercentage: 85,
              status: 'Completed'
            },
            {
              studentId: '2',
              entries: [
                { joinTime: "10:00", leaveTime: "11:30" },
                { joinTime: "11:40", leaveTime: "12:00" }
              ],
              attendancePercentage: 95,
              status: 'Completed'
            }
          ]
        }
      }
    ]
  }
];