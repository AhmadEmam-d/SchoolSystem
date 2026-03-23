import React from 'react';
import { useNavigate, useParams } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Badge } from '../../components/ui/badge';
import { ArrowLeft, BookOpen, Calendar, Clock, FileText, Link as LinkIcon, Upload, X, Plus, CheckCircle } from 'lucide-react';
import { CLASSES } from '../../lib/mockData';
import { useTranslation } from 'react-i18next';

// Mock lesson data for editing
const MOCK_LESSONS = {
  'l1': {
    class: 'c1',
    lessonTitle: 'Introduction to Calculus',
    lessonNumber: 'Lesson 1',
    date: '2026-03-05',
    startTime: '08:00',
    endTime: '09:00',
    description: 'Basic concepts of derivatives and limits',
    objectives: ['Understand derivatives', 'Learn about limits', 'Apply in real-world problems'],
    materials: ['Textbook Chapter 5', 'Scientific calculator', 'Graph paper'],
    homework: 'Complete exercises 1-5 on page 120',
    notes: 'Students need more time on derivatives',
  },
  'l2': {
    class: 'c1',
    lessonTitle: 'Quadratic Equations',
    lessonNumber: 'Lesson 2',
    date: '2026-03-06',
    startTime: '09:00',
    endTime: '10:00',
    description: 'Solving quadratic equations using different methods',
    objectives: ['Master factoring method', 'Use quadratic formula', 'Graph parabolas'],
    materials: ['Textbook Chapter 8', 'Calculator', 'Practice worksheets'],
    homework: 'Solve problems 1-10 on page 245',
    notes: 'Focus on factoring techniques',
  },
  'l3': {
    class: 'c2',
    lessonTitle: 'Trigonometry Basics',
    lessonNumber: 'Lesson 3',
    date: '2026-03-04',
    startTime: '10:00',
    endTime: '11:00',
    description: 'Introduction to sine, cosine, and tangent',
    objectives: ['Define trigonometric ratios', 'Calculate angles', 'Solve triangles'],
    materials: ['Textbook Chapter 12', 'Protractor', 'Ruler'],
    homework: 'Complete worksheet on trigonometric ratios',
    notes: 'Good understanding, proceed as planned',
  },
};

export function AddLesson() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { id } = useParams();
  const isEditMode = !!id;
  
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [showSuccess, setShowSuccess] = React.useState(false);

  // Load existing data if in edit mode
  const existingLesson = id && MOCK_LESSONS[id];

  const [formData, setFormData] = React.useState({
    class: existingLesson?.class || '',
    lessonTitle: existingLesson?.lessonTitle || '',
    lessonNumber: existingLesson?.lessonNumber || '',
    date: existingLesson?.date || '',
    startTime: existingLesson?.startTime || '',
    endTime: existingLesson?.endTime || '',
    description: existingLesson?.description || '',
    objectives: existingLesson?.objectives || [''],
    materials: existingLesson?.materials || [''],
    homework: existingLesson?.homework || '',
    notes: existingLesson?.notes || '',
  });

  const [files, setFiles] = React.useState([]);
  const [links, setLinks] = React.useState(['']);

  const myClasses = CLASSES.filter(c => c.teacherId === 't1');

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleObjectiveChange = (index, value) => {
    const newObjectives = [...formData.objectives];
    newObjectives[index] = value;
    setFormData({ ...formData, objectives: newObjectives });
  };

  const addObjective = () => {
    setFormData({ ...formData, objectives: [...formData.objectives, ''] });
  };

  const removeObjective = (index) => {
    const newObjectives = formData.objectives.filter((_, i) => i !== index);
    setFormData({ ...formData, objectives: newObjectives });
  };

  const handleMaterialChange = (index, value) => {
    const newMaterials = [...formData.materials];
    newMaterials[index] = value;
    setFormData({ ...formData, materials: newMaterials });
  };

  const addMaterial = () => {
    setFormData({ ...formData, materials: [...formData.materials, ''] });
  };

  const removeMaterial = (index) => {
    const newMaterials = formData.materials.filter((_, i) => i !== index);
    setFormData({ ...formData, materials: newMaterials });
  };

  const handleLinkChange = (index, value) => {
    const newLinks = [...links];
    newLinks[index] = value;
    setLinks(newLinks);
  };

  const addLink = () => {
    setLinks([...links, '']);
  };

  const removeLink = (index) => {
    setLinks(links.filter((_, i) => i !== index));
  };

  const handleFileUpload = (e) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles([...files, ...newFiles]);
    }
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
      
      // Reset form after 2 seconds and navigate
      setTimeout(() => {
        navigate('/teacher/lessons');
      }, 2000);
    }, 1000);
  };

  if (showSuccess) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {isEditMode ? t('lessonUpdatedSuccess') : t('lessonCreatedSuccess')}
            </h2>
            <p className="text-gray-600 mb-6">
              {isEditMode ? t('lessonUpdatedDesc') : t('lessonCreatedDesc')}
            </p>
            <Button onClick={() => navigate('/teacher/lessons')} className="w-full bg-indigo-600 hover:bg-indigo-700">
              {t('goToLessons')}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-2 -ml-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('cancel')}
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEditMode ? t('editLesson') : t('addNewLesson')}
          </h1>
          <p className="text-gray-500 mt-1">
            {isEditMode ? t('editLessonDesc') : t('addNewLessonDesc')}
          </p>
        </div>
        <Badge variant="outline" className="text-sm">
          <BookOpen className="h-3 w-3 mr-1" />
          {isEditMode ? t('editMode') : t('newLesson')}
        </Badge>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Basic Information */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-indigo-600" />
              {t('basicInformation')}
            </CardTitle>
            <CardDescription>{t('enterLessonDetails')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="class">{t('selectClass')} *</Label>
                <select
                  id="class"
                  name="class"
                  value={formData.class}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                >
                  <option value="">{t('chooseClass')}</option>
                  {myClasses.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name} - {cls.grade} Grade
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="lessonNumber">{t('lessonNumber')} *</Label>
                <Input
                  id="lessonNumber"
                  name="lessonNumber"
                  type="text"
                  placeholder="e.g., Lesson 5"
                  value={formData.lessonNumber}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="lessonTitle">{t('lessonTitle')} *</Label>
              <Input
                id="lessonTitle"
                name="lessonTitle"
                type="text"
                placeholder="e.g., Introduction to Algebra"
                value={formData.lessonTitle}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">{t('date')} *</Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="startTime">{t('startTime')} *</Label>
                <Input
                  id="startTime"
                  name="startTime"
                  type="time"
                  value={formData.startTime}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endTime">{t('endTime')} *</Label>
                <Input
                  id="endTime"
                  name="endTime"
                  type="time"
                  value={formData.endTime}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">{t('lessonDescription')}</Label>
              <Textarea
                id="description"
                name="description"
                placeholder={t('lessonDescription')}
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* Learning Objectives */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-indigo-600" />
              {t('learningObjectives')}
            </CardTitle>
            <CardDescription>{t('learningObjectivesDesc')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {formData.objectives.map((objective, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  placeholder={`${t('objective')} ${index + 1}`}
                  value={objective}
                  onChange={(e) => handleObjectiveChange(index, e.target.value)}
                />
                {formData.objectives.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeObjective(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={addObjective}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              {t('addObjective')}
            </Button>
          </CardContent>
        </Card>

        {/* Required Materials */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-indigo-600" />
              {t('requiredMaterials')}
            </CardTitle>
            <CardDescription>{t('requiredMaterialsDesc')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {formData.materials.map((material, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  placeholder={`${t('material')} ${index + 1}`}
                  value={material}
                  onChange={(e) => handleMaterialChange(index, e.target.value)}
                />
                {formData.materials.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeMaterial(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={addMaterial}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              {t('addMaterial')}
            </Button>
          </CardContent>
        </Card>

        {/* Attachments & Links */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-indigo-600" />
              {t('attachmentsAndResources')}
            </CardTitle>
            <CardDescription>{t('uploadFilesOrLinks')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* File Upload */}
            <div className="space-y-2">
              <Label>{t('uploadFiles')}</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-400 transition-colors">
                <input
                  type="file"
                  id="file-upload"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.jpg,.jpeg,.png,.gif"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer flex flex-col items-center gap-2"
                >
                  <div className="h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center">
                    <Upload className="h-6 w-6 text-indigo-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {t('clickToUpload')}
                  </span>
                  <span className="text-xs text-gray-500">
                    PDF, DOC, PPT, XLS, Images (MAX. 10MB each)
                  </span>
                </label>
              </div>

              {files.length > 0 && (
                <div className="space-y-2 mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      {t('attachedFiles')} ({files.length})
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setFiles([])}
                      className="text-red-600 hover:text-red-700"
                    >
                      {t('clearAll')}
                    </Button>
                  </div>
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-indigo-50 border border-indigo-200 rounded-lg"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div className="h-10 w-10 bg-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          <FileText className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                          <p className="text-xs text-gray-500">
                            {(file.size / 1024).toFixed(2)} KB • {file.type || 'Unknown type'}
                          </p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                        className="ml-2"
                      >
                        <X className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Links */}
            <div className="space-y-2">
              <Label>{t('addResourceLinks')}</Label>
              {links.map((link, index) => (
                <div key={index} className="flex gap-2">
                  <div className="flex-1 relative">
                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="https://example.com/resource"
                      value={link}
                      onChange={(e) => handleLinkChange(index, e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  {links.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeLink(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={addLink}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                {t('addLink')}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Homework & Notes */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-indigo-600" />
              {t('homeworkAndNotes')}
            </CardTitle>
            <CardDescription>{t('optionalHomework')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="homework">{t('homeworkAssignment')}</Label>
              <Textarea
                id="homework"
                name="homework"
                placeholder={t('homeworkAssignment')}
                value={formData.homework}
                onChange={handleInputChange}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">{t('teacherNotes')}</Label>
              <Textarea
                id="notes"
                name="notes"
                placeholder={t('teacherNotes')}
                value={formData.notes}
                onChange={handleInputChange}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(-1)}
          >
            {t('cancel')}
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            {isSubmitting 
              ? (isEditMode ? t('updating') : t('creating')) 
              : (isEditMode ? t('updateLesson') : t('createLesson'))
            }
          </Button>
        </div>
      </form>
    </div>
  );
}