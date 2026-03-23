# صفحات محتاجة تظبيط ترجمة

## ✅ تم التعديل:
1. Dashboard - adminDashboard / adminDashboardDesc
2. Students - studentsPage / studentsPageDesc  
3. Teachers - teachersPage / teachersPageDesc
4. Sidebar - Reports menu
5. Timetable - days of week
6. i18n.ts - all translations added

## ❌ محتاجين تعديل:
- Classes → classesPage / classesPageDesc
- Parents → parentsPage / parentsPageDesc  
- Attendance → attendancePage / attendancePageDesc
- Subjects → subjectsPage / subjectsPageDesc
- Exams → examsPage / examsPageDesc
- Announcements → announcementsPage / announcementsPageDesc
- Messages → messagesPage / messagesPageDesc
- Reports → reportsPage / reportsPageDesc
- Settings → settingsPage / settingsPageDesc
- Profile → profilePage
- AddStudent → addNewStudent / addNewStudentDesc
- AddTeacher → addNewTeacher / addNewTeacherDesc
- AddParent → addNewParent / addNewParentDesc
- AddClass → addNewClass / addNewClassDesc
- AddSubject → addNewSubject / addNewSubjectDesc
- CreateAnnouncement → createNewAnnouncement / createNewAnnouncementDesc

## Pattern للتعديل:
```tsx
// 1. Import useTranslation
import { useTranslation } from 'react-i18next';

// 2. في الـ component:
const { t } = useTranslation();

// 3. في الـ JSX:
<h1 className="...">{t('pageName')}</h1>
<p className="...">{t('pageNameDesc')}</p>
```
