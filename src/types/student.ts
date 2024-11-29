export interface Student {
  id: string;
  email: string;
  name: string;
  department: string;
  avatar: string;
}

export interface EnrolledStudent extends Student {
  enrollmentDate: string;
  attendance: number;
}