import { createBrowserRouter } from "react-router";
import { Providers } from "./Providers.jsx";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import { LandingPage } from "./pages/public/LandingPage.jsx";
import { SelectRole } from "./pages/public/Login.jsx";
import { AdminLogin } from "./pages/public/AdminLogin.jsx";
import { AdminSignup } from "./pages/public/AdminSignup.jsx";
import { TeacherLogin } from "./pages/public/TeacherLogin.jsx";
import { StudentLogin } from "./pages/public/StudentLogin.jsx";
import { ParentLogin } from "./pages/public/ParentLogin.jsx";
import { AdminDashboard } from "./pages/admin/Dashboard.jsx";
import { AdminStudents } from "./pages/admin/Students.jsx";
import { AdminTeachers } from "./pages/admin/Teachers.jsx";
import { AdminParents } from "./pages/admin/Parents.jsx";
import { AdminClasses } from "./pages/admin/Classes.jsx";
import { AdminSubjects } from "./pages/admin/Subjects.jsx";
import { AdminTimetable } from "./pages/admin/Timetable.jsx";
import { EditTimetable } from "./pages/admin/EditTimetable.jsx";
import { AdminAttendance } from "./pages/admin/Attendance.jsx";
import { AdminExams } from "./pages/admin/Exams.jsx";
import { AdminExamResults } from "./pages/admin/ExamResults.jsx";
import { AdminAnnouncements } from "./pages/admin/Announcements.jsx";
import { AddAnnouncement } from "./pages/admin/AddAnnouncement.jsx";
import { AdminNotifications } from "./pages/admin/Notifications.jsx";
import { AdminMessages } from "./pages/admin/Messages.jsx";
import { NewMessage } from "./pages/admin/NewMessage.jsx";
import { AdminReports } from "./pages/admin/Reports.jsx";
import { StudentsSummaryReport } from "./pages/admin/StudentsSummaryReport.jsx";
import { GradesReport } from "./pages/admin/GradesReport.jsx";
import { AdminSettings } from "./pages/admin/Settings.jsx";
import { AdminProfile } from "./pages/admin/Profile.jsx";
import { SchoolInformation } from "./pages/admin/SchoolInformation.jsx";
import { AddStudent } from "./pages/admin/AddStudent.jsx";
import { AddTeacher } from "./pages/admin/AddTeacher.jsx";
import { AddParent } from "./pages/admin/AddParent.jsx";
import { AddClass } from "./pages/admin/AddClass.jsx";
import { AddSubject } from "./pages/admin/AddSubject.jsx";
import { ClassDetails } from "./pages/admin/ClassDetails.jsx";
import { EditClass } from "./pages/admin/EditClass.jsx";
import { EditSubject } from "./pages/admin/EditSubject.jsx";
import { RecentActivity } from "./pages/admin/RecentActivity.jsx";
import { AIAnalytics } from "./pages/admin/AIAnalytics.jsx";
import { MonthlyAttendance } from "./pages/admin/MonthlyAttendance.jsx";
import { SentMessages } from "./pages/admin/SentMessages.jsx";
import { TimetableByTeacher } from "./pages/admin/TimetableByTeacher.jsx";
import { TeacherDashboard, StudentDashboard, ParentDashboard } from "./pages/role-dashboards.jsx";
import { TeacherClasses } from "./pages/teacher/Classes.jsx";
import { TeacherHomework } from "./pages/teacher/Homework.jsx";
import { TeacherAttendance } from "./pages/teacher/Attendance.jsx";
import { TeacherExams } from "./pages/teacher/Exams.jsx";
import { TeacherMessages } from "./pages/teacher/Messages.jsx";
import { TeacherSupport } from "./pages/teacher/Support.jsx";
import { TeacherProfile } from "./pages/teacher/Profile.jsx";
import { TeacherSettings } from "./pages/teacher/Settings.jsx";
import { TeacherLessons } from "./pages/teacher/Lessons.jsx";
import { AddLesson } from "./pages/teacher/AddLesson.jsx";
import { AddHomework } from "./pages/teacher/AddHomework.jsx";
import { AddExam } from "./pages/teacher/AddExam.jsx";
import { ClassDetails as TeacherClassDetails } from "./pages/teacher/ClassDetails.jsx";
import { HomeworkDetails } from "./pages/teacher/HomeworkDetails.jsx";
import { HomeworkSubmissions } from "./pages/teacher/HomeworkSubmissions.jsx";
import { HomeworkGrades } from "./pages/teacher/HomeworkGrades.jsx";
import { ExamDetails } from "./pages/teacher/ExamDetails.jsx";
import { ExamSubmissions } from "./pages/teacher/ExamSubmissions.jsx";
import { ExamGrades } from "./pages/teacher/ExamGrades.jsx";
import { LessonDetails } from "./pages/teacher/LessonDetails.jsx";
import { HomeworkDetailsPage } from "./pages/teacher/HomeworkDetailsPage.jsx";
import { TeacherNotifications } from "./pages/teacher/Notifications.jsx";
import { AttendanceMethodSelection } from "./pages/teacher/AttendanceMethodSelection.jsx";
import { ManualAttendance } from "./pages/teacher/ManualAttendance.jsx";
import { QRAttendance } from "./pages/teacher/QRAttendance.jsx";
import { CodeAttendance } from "./pages/teacher/CodeAttendance.jsx";
import { StudentSchedule } from "./pages/student/Schedule.jsx";
import { StudentSubjects } from "./pages/student/Subjects.jsx";
import { StudentSubjectDetails } from "./pages/student/SubjectDetails.jsx";
import { StudentSubjectMaterials } from "./pages/student/SubjectMaterials.jsx";
import { StudentDocumentViewer } from "./pages/student/DocumentViewer.jsx";
import { StudentHomework } from "./pages/student/Homework.jsx";
import { StudentHomeworkDetails } from "./pages/student/HomeworkDetails.jsx";
import { StudentGrades } from "./pages/student/Grades.jsx";
import { StudentMessages } from "./pages/student/Messages.jsx";
import { StudentSupport } from "./pages/student/Support.jsx";
import { StudentProfile } from "./pages/student/Profile.jsx";
import { StudentSettings } from "./pages/student/Settings.jsx";
import { StudentNotifications } from "./pages/student/Notifications.jsx";
import { ParentChildren } from "./pages/parent/Children.jsx";
import { ParentAttendance } from "./pages/parent/Attendance.jsx";
import { ParentGrades } from "./pages/parent/Grades.jsx";
import { ParentHomework } from "./pages/parent/Homework.jsx";
import { ParentMessages } from "./pages/parent/Messages.jsx";
import { ParentPayments } from "./pages/parent/Payments.jsx";
import { ParentSupport } from "./pages/parent/Support.jsx";
import { ParentNotifications } from "./pages/parent/Notifications.jsx";
import { ParentProfile } from "./pages/parent/Profile.jsx";
import { ParentSettings } from "./pages/parent/Settings.jsx";
import { ParentCalendar } from "./pages/parent/Calendar.jsx";
import { ParentSchedule } from "./pages/parent/Schedule.jsx";
import { ParentReceipts } from "./pages/parent/Receipts.jsx";
import { AIChat } from "./pages/shared/AIChat.jsx";
import { ChangePassword } from "./pages/shared/ChangePassword.jsx";
import { ForgotPassword } from "./pages/shared/ForgotPassword.jsx";
import { VerifyCode } from "./pages/shared/VerifyCode.jsx";
import { NewPassword } from "./pages/shared/NewPassword.jsx";
import { PasswordResetSuccess } from "./pages/shared/PasswordResetSuccess.jsx";
import { ResetPassword } from "./pages/shared/ResetPassword.jsx";
import { PlaceholderPage } from "./components/PlaceholderPage";
import {StudentDetails} from "./pages/admin/StudentDetails.jsx";
import {EditStudent} from "./pages/admin/EditStudent.jsx";
import {TeacherDetails} from "./pages/admin/TeacherDetails.jsx";
import {EditTeacher} from "./pages/admin/EditTeacher.jsx";
import {EditParent} from "./pages/admin/EditParent.jsx";


export const router = createBrowserRouter([
  {
    element: <Providers />,
    children: [
      {
        path: "/",
        Component: LandingPage,
      },
      {
        path: "/login",
        Component: SelectRole,
      },
      {
        path: "/admin-login",
        Component: AdminLogin,
      },
      {
        path: "/admin-signup",
        Component: AdminSignup,
      },
      {
        path: "/teacher-login",
        Component: TeacherLogin,
      },
      {
        path: "/student-login",
        Component: StudentLogin,
      },
      {
        path: "/parent-login",
        Component: ParentLogin,
      },
      {
        path: "/forgot-password",
        Component: ForgotPassword,
      },
      {
        path: "/verify-code",
        Component: VerifyCode,
      },
      {
        path: "/new-password",
        Component: NewPassword,
      },
      {
        path: "/password-reset-success",
        Component: PasswordResetSuccess,
      },
      {
        path: "/reset-password",
        Component: ResetPassword,
      },
      {
        path: "/change-password",
        Component: ChangePassword,
      },
      {
        Component: DashboardLayout,
        children: [
      // Admin Routes
      { path: "admin/dashboard", Component: AdminDashboard },
      { path: "admin/dashboard/activity", Component: RecentActivity },
      { path: "admin/dashboard/ai-analytics", Component: AIAnalytics },
      
      { path: "admin/students", Component: AdminStudents },
      { path: "admin/students/add", Component: AddStudent },
      {path : "admin/students/:id" , Component : StudentDetails},
      {path : "admin/students/edit/:id" , Component : EditStudent},


      
      { path: "admin/teachers", Component: AdminTeachers },
      { path: "admin/teachers/add", Component: AddTeacher },
      { path: "admin/teachers/:id", Component: TeacherDetails },
      { path: "admin/teachers/edit/:id", Component: EditTeacher },



      
      { path: "admin/parents", Component: AdminParents },
      { path: "admin/parents/add", Component: AddParent },
      {  path: "admin/parents/edit/:id", Component: EditParent },

      
      { path: "admin/classes", Component: AdminClasses },
      { path: "admin/classes/add", Component: AddClass },
      { path: "admin/classes/edit/:id", Component: EditClass },
      { path: "admin/classes/:id", Component: ClassDetails },
      
      { path: "admin/subjects", Component: AdminSubjects },
      { path: "admin/subjects/add", Component: AddSubject },
      { path: "admin/subjects/edit/:id", Component: EditSubject },
      
      { path: "admin/timetable", Component: AdminTimetable },
      { path: "admin/timetable/edit", Component: EditTimetable },
      { path: "admin/timetable/by-teacher", Component: TimetableByTeacher },
      
      { path: "admin/attendance", Component: AdminAttendance },
      { path: "admin/attendance/monthly", Component: MonthlyAttendance },
      
      { path: "admin/exams", Component: AdminExams },
      { path: "admin/exams/results", Component: AdminExamResults },
      
      { path: "admin/announcements", Component: AdminAnnouncements },
      { path: "admin/announcements/add", Component: AddAnnouncement },
      
      { path: "admin/notifications", Component: AdminNotifications },
      
      { path: "admin/messages", Component: AdminMessages },
      { path: "admin/messages/new", Component: NewMessage },
      { path: "admin/messages/sent", Component: SentMessages },
      
      { path: "admin/reports", Component: AdminReports },
      { path: "admin/reports/students", Component: StudentsSummaryReport },
      { path: "admin/reports/grades", Component: GradesReport },
      
      { path: "admin/settings", Component: AdminSettings },
      { path: "admin/settings/school-info", Component: SchoolInformation },
      
      { path: "admin/profile", Component: AdminProfile },

      // Teacher Routes
      { path: "teacher/dashboard", Component: TeacherDashboard },
      { path: "teacher/classes", Component: TeacherClasses },
      { path: "teacher/class-details", Component: TeacherClassDetails },
      { path: "teacher/attendance", Component: TeacherAttendance },
      { path: "teacher/homework", Component: TeacherHomework },
      { path: "teacher/exams", Component: TeacherExams },
      { path: "teacher/messages", Component: TeacherMessages },
      { path: "teacher/ai", Component: AIChat },
      { path: "teacher/support", Component: TeacherSupport },
      { path: "teacher/profile", Component: TeacherProfile },
      { path: "teacher/settings", Component: TeacherSettings },
      { path: "teacher/lessons", Component: TeacherLessons },
      { path: "teacher/lessons/add", Component: AddLesson },
      { path: "teacher/lessons/edit/:id", Component: AddLesson },
      { path: "teacher/lessons/:id", Component: LessonDetails },
      { path: "teacher/add-lesson", Component: AddLesson },
      { path: "teacher/homework/add", Component: AddHomework },
      { path: "teacher/exam/add", Component: AddExam },
      { path: "teacher/homework/:id", Component: HomeworkDetails },
      { path: "teacher/homework/:id/submissions", Component: HomeworkSubmissions },
      { path: "teacher/homework/:id/grades", Component: HomeworkGrades },
      { path: "teacher/exams/:id", Component: ExamDetails },
      { path: "teacher/exams/:id/submissions", Component: ExamSubmissions },
      { path: "teacher/exams/:id/grades", Component: ExamGrades },
      { path: "teacher/lesson-details", Component: LessonDetails },
      { path: "teacher/homework-details", Component: HomeworkDetailsPage },
      { path: "teacher/notifications", Component: TeacherNotifications },
      { path: "teacher/attendance/method-selection", Component: AttendanceMethodSelection },
      { path: "teacher/attendance/manual", Component: ManualAttendance },
      { path: "teacher/attendance/qrcode", Component: QRAttendance },
      { path: "teacher/attendance/code", Component: CodeAttendance },

      // Student Routes
      { path: "student/dashboard", Component: StudentDashboard },
      { path: "student/schedule", Component: StudentSchedule },
      { path: "student/subjects", Component: StudentSubjects },
      { path: "student/subjects/:id", Component: StudentSubjectDetails },
      { path: "student/subjects/:id/materials", Component: StudentSubjectMaterials },
      { path: "student/subjects/:id/document-viewer", Component: StudentDocumentViewer },
      { path: "student/homework", Component: StudentHomework },
      { path: "student/homework/:id", Component: StudentHomeworkDetails },
      { path: "student/grades", Component: StudentGrades },
      { path: "student/messages", Component: StudentMessages },
      { path: "student/ai", Component: AIChat },
      { path: "student/support", Component: StudentSupport },
      { path: "student/profile", Component: StudentProfile },
      { path: "student/settings", Component: StudentSettings },
      { path: "student/notifications", Component: StudentNotifications },

      // Parent Routes
      { path: "parent/dashboard", Component: ParentDashboard },
      { path: "parent/children", Component: ParentChildren },
      { path: "parent/attendance", Component: ParentAttendance },
      { path: "parent/grades", Component: ParentGrades },
      { path: "parent/homework", Component: ParentHomework },
      { path: "parent/messages", Component: ParentMessages },
      { path: "parent/payments", Component: ParentPayments },
      { path: "parent/support", Component: ParentSupport },
      { path: "parent/notifications", Component: ParentNotifications },
      { path: "parent/profile", Component: ParentProfile },
      { path: "parent/settings", Component: ParentSettings },
      { path: "parent/calendar", Component: ParentCalendar },
      { path: "parent/schedule", Component: ParentSchedule },
      { path: "parent/receipts", Component: ParentReceipts },
    ],
  },
  {
    path: "*",
    Component: PlaceholderPage,
  }
    ]
  }
]);