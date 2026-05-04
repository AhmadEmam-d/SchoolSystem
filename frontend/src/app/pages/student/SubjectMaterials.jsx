import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import {
  ArrowLeft,
  Search,
  Download,
  Eye,
  FileText,
  FileVideo,
  FileImage,
  File,
  BookOpen,
  Calendar,
  User,
  Link,
  Loader2,
  ChevronDown,
  ChevronRight,
  BookMarked,
  Paperclip,
} from 'lucide-react';
import { toast } from 'sonner';
import { api } from '../../lib/api'; // ← عدّل المسار حسب مشروعك

// ─── helpers ────────────────────────────────────────────────────────────────

const API_BASE_URL = 'https://localhost:7179';

/** نرجع الـ icon المناسب حسب MIME أو اسم الملف */
function getFileIcon(fileType = '', fileName = '') {
  const mime = fileType.toLowerCase();
  const ext = fileName.split('.').pop()?.toLowerCase() ?? '';

  if (mime.includes('video') || ['mp4', 'mkv', 'mov', 'avi'].includes(ext))
    return <FileVideo className="h-5 w-5 text-purple-500" />;
  if (mime.includes('image') || ['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(ext))
    return <FileImage className="h-5 w-5 text-emerald-500" />;
  if (mime.includes('pdf') || ext === 'pdf')
    return <FileText className="h-5 w-5 text-rose-500" />;
  if (['ppt', 'pptx'].includes(ext))
    return <FileText className="h-5 w-5 text-orange-500" />;
  return <File className="h-5 w-5 text-sky-500" />;
}

function getTypeBadge(fileType = '', fileName = '') {
  const mime = fileType.toLowerCase();
  const ext = fileName.split('.').pop()?.toUpperCase() ?? 'FILE';

  if (mime.includes('video')) return { label: 'VIDEO', cls: 'bg-purple-100 text-purple-800' };
  if (mime.includes('image')) return { label: 'IMAGE', cls: 'bg-emerald-100 text-emerald-800' };
  if (mime.includes('pdf'))   return { label: 'PDF',   cls: 'bg-rose-100 text-rose-800' };
  return { label: ext, cls: 'bg-sky-100 text-sky-800' };
}

function formatBytes(bytes) {
  if (!bytes) return null;
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

// ─── component ──────────────────────────────────────────────────────────────

export function StudentSubjectMaterials() {
  const navigate = useNavigate();
  const { id: subjectId } = useParams(); // id = subjectId

  const [lessons, setLessons]       = useState([]);   // list of lessons
  const [filesMap, setFilesMap]     = useState({});   // { lessonId: [files] }
  const [loading, setLoading]       = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedLesson, setExpandedLesson] = useState(null); // oid of expanded lesson
  const [subjectName, setSubjectName] = useState('Subject');
  const [teacherName, setTeacherName] = useState('');

  // ── fetch lessons ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!subjectId) return;

    (async () => {
      setLoading(true);
      try {
        const data = await api.lessons.getBySubjectForStudent(subjectId);
        // data is an array of lesson objects
        const list = Array.isArray(data) ? data : [];
        setLessons(list);

        if (list.length > 0) {
          setSubjectName(list[0].subjectName ?? 'Subject');
          setTeacherName(list[0].teacherName ?? '');
        }

        // ── fetch files for each lesson that has materials ──────────────────
        const entries = await Promise.all(
          list
            .filter((l) => l.materialsCount > 0)
            .map(async (l) => {
              try {
                // GET /api/Files/lesson/{lessonId}
                const res = await fetch(
                  `${API_BASE_URL}/api/Files/lesson/${l.oid}`,
                  {
                    headers: {
                      Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                  }
                );
                const json = await res.json();
                const files = json.success
                  ? Array.isArray(json.data) ? json.data : []
                  : l.materials ?? []; // fallback to embedded materials
                return [l.oid, files];
              } catch {
                // fallback: use the materials array already in the lesson object
                return [l.oid, l.materials ?? []];
              }
            })
        );

        const map = {};
        for (const [oid, files] of entries) map[oid] = files;

        // also seed lessons that already have inline materials but materialsCount==0
        for (const l of list) {
          if (!map[l.oid] && l.materials?.length) map[l.oid] = l.materials;
        }

        setFilesMap(map);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load materials');
      } finally {
        setLoading(false);
      }
    })();
  }, [subjectId]);

  // ── flatten all files for search ──────────────────────────────────────────
  const allFiles = lessons.flatMap((lesson) =>
    (filesMap[lesson.oid] ?? []).map((f) => ({ ...f, lesson }))
  );

  const filteredFiles = searchQuery.trim()
    ? allFiles.filter(
        (f) =>
          f.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          f.lesson?.title?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : null; // null = show grouped view

  // ── actions ───────────────────────────────────────────────────────────────
const handleView = (file) => {
  const url = file.fileUrl?.startsWith('http')
    ? file.fileUrl
    : `https://localhost:7179${file.fileUrl}`;
  window.open(url, '_blank');
};

  const handleDownload = async (file) => {
    const url = file.fileUrl?.startsWith('http')
      ? file.fileUrl
      : `${API_BASE_URL}${file.fileUrl}`;
    try {
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const blob = await res.blob();
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = file.name ?? 'download';
      link.click();
      toast.success(`Downloading "${file.name}"...`);
    } catch {
      toast.error('Download failed');
    }
  };

  const toggleLesson = (oid) =>
    setExpandedLesson((prev) => (prev === oid ? null : oid));

  // ── render ────────────────────────────────────────────────────────────────
  const totalMaterials = Object.values(filesMap).reduce((s, a) => s + a.length, 0);

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div>
        <Button
          variant="ghost"
          onClick={() => navigate(`/student/subjects/${subjectId}`)}
          className="mb-2 -ml-2"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Subject
        </Button>

        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <BookOpen className="h-7 w-7 text-indigo-600" />
              <h1 className="text-3xl font-bold text-gray-900 capitalize">
                {subjectName} — Materials
              </h1>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              {teacherName && (
                <>
                  <User className="h-4 w-4" />
                  <span>{teacherName}</span>
                  <span className="mx-2">•</span>
                </>
              )}
              <span>{lessons.length} lessons</span>
              <span className="mx-2">•</span>
              <span>{totalMaterials} resources</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Search ── */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search materials or lessons..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* ── Loading ── */}
      {loading && (
        <div className="flex items-center justify-center py-20 text-gray-400">
          <Loader2 className="h-8 w-8 animate-spin mr-3" />
          <span>Loading materials...</span>
        </div>
      )}

      {/* ── No data ── */}
      {!loading && lessons.length === 0 && (
        <Card>
          <CardContent className="p-12 flex flex-col items-center justify-center text-center text-gray-500">
            <File className="h-12 w-12 mb-4 text-gray-300" />
            <p className="font-medium">No lessons found for this subject</p>
          </CardContent>
        </Card>
      )}

      {/* ── Search Results (flat list) ── */}
      {!loading && filteredFiles !== null && (
        <>
          {filteredFiles.length === 0 ? (
            <Card>
              <CardContent className="p-10 text-center text-gray-500">
                <p>No results for "{searchQuery}"</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredFiles.map((file) => (
                <FileCard
                  key={file.oid}
                  file={file}
                  lessonTitle={file.lesson?.title}
                  onView={handleView}
                  onDownload={handleDownload}
                />
              ))}
            </div>
          )}
          <div className="text-sm text-gray-500 text-center">
            Showing {filteredFiles.length} result(s)
          </div>
        </>
      )}

      {/* ── Grouped by Lesson ── */}
      {!loading && filteredFiles === null && lessons.length > 0 && (
        <div className="space-y-4">
          {lessons.map((lesson) => {
            const files = filesMap[lesson.oid] ?? [];
            const isExpanded = expandedLesson === lesson.oid;

            return (
              <Card key={lesson.oid} className="overflow-hidden">
                {/* Lesson header — clickable */}
                <button
                  onClick={() => toggleLesson(lesson.oid)}
                  className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 rounded-lg bg-indigo-50 shrink-0">
                      <BookMarked className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div className="text-left min-w-0">
                      <p className="font-semibold text-gray-900 truncate">
                        {lesson.title || '(Untitled Lesson)'}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5 flex-wrap">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(lesson.date)}</span>
                        <span>•</span>
                        <span className="capitalize">{lesson.type}</span>
                        <span>•</span>
                        <LessonStatusBadge status={lesson.status} />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 ml-3 shrink-0">
                    <span className="flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      <Paperclip className="h-3 w-3" />
                      {files.length} file{files.length !== 1 ? 's' : ''}
                    </span>
                    {isExpanded
                      ? <ChevronDown className="h-4 w-4 text-gray-400" />
                      : <ChevronRight className="h-4 w-4 text-gray-400" />
                    }
                  </div>
                </button>

                {/* Files grid */}
                {isExpanded && (
                  <div className="border-t px-5 py-4">
                    {files.length === 0 ? (
                      <p className="text-sm text-gray-400 text-center py-4">
                        No materials for this lesson
                      </p>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {files.map((file) => (
                          <FileCard
                            key={file.oid}
                            file={file}
                            onView={handleView}
                            onDownload={handleDownload}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {!loading && lessons.length > 0 && filteredFiles === null && (
        <div className="text-sm text-gray-500 text-center">
          {totalMaterials} total resource{totalMaterials !== 1 ? 's' : ''} across {lessons.length} lesson{lessons.length !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
}

// ─── sub-components ──────────────────────────────────────────────────────────

function FileCard({ file, lessonTitle, onView, onDownload }) {
  const { label, cls } = getTypeBadge(file.fileType, file.name);
  const icon = getFileIcon(file.fileType, file.name);

  return (
    <div className="border rounded-xl p-4 flex flex-col gap-3 bg-white hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="p-2 bg-gray-50 rounded-lg">{icon}</div>
        <Badge className={`${cls} text-xs`}>{label}</Badge>
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900 text-sm leading-snug truncate" title={file.name}>
          {file.name}
        </p>
        {lessonTitle && (
          <p className="text-xs text-indigo-500 mt-0.5 truncate">{lessonTitle}</p>
        )}
        {file.fileSize && (
          <p className="text-xs text-gray-400 mt-1">{formatBytes(file.fileSize)}</p>
        )}
      </div>

      <div className="flex gap-2">
        <Button variant="outline" size="sm" className="flex-1" onClick={() => onView(file)}>
          <Eye className="h-4 w-4 mr-1" />
          View
        </Button>
        <Button
          size="sm"
          className="flex-1 bg-indigo-600 hover:bg-indigo-700"
          onClick={() => onDownload(file)}
        >
          <Download className="h-4 w-4 mr-1" />
          Download
        </Button>
      </div>
    </div>
  );
}

function LessonStatusBadge({ status }) {
  const map = {
    Completed: 'text-emerald-600',
    Upcoming:  'text-amber-500',
    Cancelled: 'text-red-500',
  };
  return (
    <span className={`font-medium ${map[status] ?? 'text-gray-500'}`}>
      {status}
    </span>
  );
}