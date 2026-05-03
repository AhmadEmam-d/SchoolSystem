import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import {
  ArrowLeft, Calendar, Clock, Users,
  Download, Link as LinkIcon,
  CheckCircle, Edit, Trash2, FileText,
  Eye
} from 'lucide-react';
import { api } from '../../lib/api';

const API_BASE_URL = "https://localhost:7179";

export function LessonDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [lesson, setLesson] = useState(null);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ================= FETCH LESSON + FILES =================
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        
        // 1. Fetch lesson
        const lessonResponse = await api.lessons.getById(id);
        const lessonData = lessonResponse?.data?.data || lessonResponse?.data || lessonResponse;
        
        // 2. Fetch files from API_BASE_URL + /api/Files/lesson/{id}
        const filesUrl = `${API_BASE_URL}/api/Files/lesson/${id}`;
        console.log("Fetching files from:", filesUrl);
        
        const filesResponse = await fetch(filesUrl);
        let filesData = [];
        
        if (filesResponse.ok) {
          const filesJson = await filesResponse.json();
          console.log("Files API response:", filesJson);
          
          // Handle response structure: { success: true, data: [...], count: number }
          if (filesJson?.success && Array.isArray(filesJson?.data)) {
            filesData = filesJson.data;
          } else if (Array.isArray(filesJson)) {
            filesData = filesJson;
          } else if (filesJson?.data && Array.isArray(filesJson.data)) {
            filesData = filesJson.data;
          } else {
            filesData = [];
          }
        } else {
          console.warn("Failed to fetch files from API, status:", filesResponse.status);
          // Fallback: use materials from lesson data if available
          filesData = lessonData?.materials || [];
        }
        
        setLesson(lessonData);
        setFiles(filesData);
        setError(null);
      } catch (err) {
        console.error('Error loading lesson:', err);
        setError('Failed to load lesson data');
        setLesson(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      load();
    }
  }, [id]);

  // ================= HELPER FUNCTIONS =================
  const formatDate = (d) => {
    if (!d) return '';
    return new Date(d).toLocaleDateString("en-US");
  };

  const formatTime = (t) => {
    if (!t) return '';
    return t.substring(11, 16);
  };

  const formatSize = (size) => {
    if (!size) return '';
    if (size < 1024) return size + " B";
    if (size < 1024 * 1024) return (size / 1024).toFixed(1) + " KB";
    return (size / (1024 * 1024)).toFixed(1) + " MB";
  };

  // ================= CHECK IF FILE CAN BE PREVIEWED =================
  const canPreview = (fileType) => {
    const previewableTypes = [
      'application/pdf',
      'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
      'text/plain', 'text/html'
    ];
    return previewableTypes.includes(fileType);
  };

  // ================= BUILD FULL FILE URL =================
  const getFullFileUrl = (fileUrl) => {
    if (!fileUrl) return '';
    if (fileUrl.startsWith('http')) return fileUrl;
    if (fileUrl.startsWith('/uploads')) return `${API_BASE_URL}${fileUrl}`;
    return `${API_BASE_URL}/${fileUrl}`;
  };

  // ================= OPEN FILE =================
  const handleFileOpen = (fileUrl, fileName, fileType) => {
    const fullUrl = getFullFileUrl(fileUrl);
    console.log("Opening file:", fullUrl);
    
    if (canPreview(fileType)) {
      // Open in new tab for preview
      window.open(fullUrl, '_blank');
    } else {
      // Download directly
      const link = document.createElement('a');
      link.href = fullUrl;
      link.download = fileName;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // ================= DELETE LESSON =================
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this lesson?")) return;
    try {
      await api.lessons.delete(id);
      navigate('/teacher/lessons');
    } catch (err) {
      console.error('Error deleting lesson:', err);
      alert('An error occurred while deleting the lesson');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <p className="text-red-500">{error}</p>
        <Button onClick={() => navigate(-1)} className="mt-4">
          <ArrowLeft className="h-4 w-4 mr-2" /> Go Back
        </Button>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="p-4">
        <p>Lesson not found</p>
        <Button onClick={() => navigate('/teacher/lessons')} className="mt-4">
          Back to List
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4">

      {/* HEADER */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" /> 
            Back
          </Button>
          <h1 className="text-2xl font-bold mt-2">{lesson.title}</h1>
          <div className="flex gap-2 mt-2 flex-wrap">
            <Badge>{lesson.status}</Badge>
            {lesson.type && <Badge variant="outline">{lesson.type}</Badge>}
          </div>
          <p className="text-gray-500 mt-1">
            {lesson.className} • {lesson.subjectName}
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => navigate(`/teacher/lessons/edit/${lesson.oid}`)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {/* INFO CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            <span>{formatDate(lesson.date)}</span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-2">
            <Clock className="h-5 w-5" />
            <span>
              {formatTime(lesson.startTime)} - {formatTime(lesson.endTime)}
            </span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-2">
            <Users className="h-5 w-5" />
            <span>{lesson.teacherName}</span>
          </CardContent>
        </Card>
      </div>

      {/* DESCRIPTION */}
      <Card>
        <CardHeader>
          <CardTitle>Description</CardTitle>
        </CardHeader>
        <CardContent>
          {lesson.description || "No description"}
        </CardContent>
      </Card>

      {/* OBJECTIVES */}
      <Card>
        <CardHeader>
          <CardTitle>Objectives ({lesson.objectivesCount || lesson.objectives?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          {lesson.objectives?.length > 0 ? (
            lesson.objectives.map((o, index) => (
              <div key={o.oid || index} className="flex gap-2 mb-2">
                <CheckCircle className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                <span>{o.description}</span>
              </div>
            ))
          ) : (
            <p>No objectives</p>
          )}
        </CardContent>
      </Card>

      {/* FILES */}
      <Card>
        <CardHeader>
          <CardTitle>Files ({files.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {files.length === 0 ? (
            <p>No files uploaded</p>
          ) : (
            <div className="space-y-2">
              {files.map((file, index) => {
                const isPreviewable = canPreview(file.fileType);
                
                return (
                  <div 
                    key={file.entityId || file.oid || index} 
                    className="flex justify-between items-center p-3 border rounded-lg hover:bg-gray-50 transition-colors flex-wrap gap-3"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <FileText className="h-5 w-5 shrink-0 text-gray-500" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{file.name}</p>
                        <p className="text-xs text-gray-500">
                          {file.fileType?.split('/').pop() || 'File'} • {formatSize(file.fileSize)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleFileOpen(file.fileUrl, file.name, file.fileType)}
                        className="gap-1"
                      >
                        {isPreviewable ? (
                          <>
                            <Eye className="h-4 w-4" />
                            Preview
                          </>
                        ) : (
                          <>
                            <Download className="h-4 w-4" />
                            Download
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* LINKS */}
      {(lesson.resourceLinks ?? []).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Links</CardTitle>
          </CardHeader>
          <CardContent>
            {lesson.resourceLinks.map((link, i) => (
              <a
                key={i}
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-blue-600 hover:underline mb-2"
              >
                <LinkIcon className="inline h-4 w-4 mr-1" />
                {link}
              </a>
            ))}
          </CardContent>
        </Card>
      )}

      {/* HOMEWORK */}
      {lesson.homework && (
        <Card>
          <CardHeader>
            <CardTitle>Homework</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-semibold">{lesson.homework.title}</p>
            <p className="mt-1">{lesson.homework.description}</p>
            <p className="text-sm text-gray-500 mt-2">
              Due Date: {formatDate(lesson.homework.dueDate)}
            </p>
          </CardContent>
        </Card>
      )}

      {/* NOTES */}
      {lesson.teacherNotes && (
        <Card>
          <CardHeader>
            <CardTitle>Teacher Notes</CardTitle>
          </CardHeader>
          <CardContent>
            {lesson.teacherNotes}
          </CardContent>
        </Card>
      )}

      {/* DURATION */}
      {lesson.duration && (
        <Card>
          <CardHeader>
            <CardTitle>Lesson Duration</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{lesson.duration} minutes</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}