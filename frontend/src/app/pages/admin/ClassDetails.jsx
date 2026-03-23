import React from 'react';
import { useNavigate, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Users, BookOpen, Edit, Calendar } from 'lucide-react';
import { useMockData } from "@/context/MockDataContext";
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';

export function ClassDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { classes, students, teachers } = useMockData();

  const classData = classes.find(c => c.id === id);

  if (!classData) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900">Class not found</h2>
          <Button className="mt-4" onClick={() => navigate('/admin/classes')}>
            Back to Classes
          </Button>
        </div>
      </div>
    );
  }

  const classStudents = students?.filter(s => classData.studentIds?.includes(s.id)) || [];
  const classTeachers = teachers?.filter(t => classData.teacherIds?.includes(t.id)) || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/classes')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-purple-600 dark:text-purple-400">
              {classData.name}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Class Details and Information
            </p>
          </div>
        </div>
        <Button
          className="gap-2"
          onClick={() => navigate(`/admin/classes/edit/${id}`)}
        >
          <Edit className="h-4 w-4" />
          Edit Class
        </Button>
      </div>

      {/* Class Information */}
      <Card>
        <CardHeader>
          <CardTitle>Class Information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-500 mb-1">Class Name</p>
            <p className="font-semibold text-gray-900">{classData.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Grade Level</p>
            <p className="font-semibold text-gray-900">Grade {classData.gradeLevel}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Total Students</p>
            <p className="font-semibold text-gray-900">{classData.studentIds.length} Students</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Assigned Teachers</p>
            <p className="font-semibold text-gray-900">{classData.teacherIds.length} Teachers</p>
          </div>
        </CardContent>
      </Card>

      {/* Students List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Students ({classStudents.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {classStudents.length > 0 ? (
            <div className="space-y-3">
              {classStudents.map((student) => (
                <div
                  key={student.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <p className="font-medium text-gray-900">{student.name}</p>
                    <p className="text-sm text-gray-500">{student.email}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/admin/students/${student.id}`)}
                  >
                    View Profile
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No students enrolled in this class
            </div>
          )}
        </CardContent>
      </Card>

      {/* Teachers List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Teachers ({classTeachers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {classTeachers.length > 0 ? (
            <div className="space-y-3">
              {classTeachers.map((teacher) => (
                <div
                  key={teacher.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <p className="font-medium text-gray-900">{teacher.name}</p>
                    <p className="text-sm text-gray-500">{teacher.email}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/admin/teachers/${teacher.id}`)}
                  >
                    View Profile
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No teachers assigned to this class
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="w-full gap-2"
              onClick={() => navigate('/admin/timetable')}
            >
              <Calendar className="h-4 w-4" />
              View Timetable
            </Button>
            <Button
              variant="outline"
              className="w-full gap-2"
              onClick={() => navigate('/admin/attendance')}
            >
              <Users className="h-4 w-4" />
              Take Attendance
            </Button>
            <Button
              variant="outline"
              className="w-full gap-2"
              onClick={() => navigate(`/admin/classes/edit/${id}`)}
            >
              <Edit className="h-4 w-4" />
              Edit Class
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
