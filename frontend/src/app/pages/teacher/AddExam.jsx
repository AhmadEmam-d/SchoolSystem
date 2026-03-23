import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { ArrowLeft, Upload, X, FileText, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { CLASSES } from '../../lib/mockData';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { useTranslation } from 'react-i18next';

export function AddExam() {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);

  const handleFileChange = (e) => {
    if (e.target.files) {
      setFiles([...files, ...Array.from(e.target.files)]);
    }
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success('Exam created successfully!');
    navigate('/teacher/exams');
  };

  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/teacher/exams')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {t('scheduleExam')}
          </h1>
          <p className="text-muted-foreground">
            {t('setupExam')}
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>{t('examsAssessments')}</CardTitle>
              <CardDescription>
                Enter the basic details of the exam
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Exam Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Exam Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Mathematics Final Exam - Semester 1"
                  required
                />
              </div>

              {/* Class and Subject */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="class">Class *</Label>
                  <Select required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                    <SelectContent>
                      {CLASSES.map((cls) => (
                        <SelectItem key={cls.id} value={cls.id}>
                          {cls.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject *</Label>
                  <Select required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mathematics">Mathematics</SelectItem>
                      <SelectItem value="physics">Physics</SelectItem>
                      <SelectItem value="chemistry">Chemistry</SelectItem>
                      <SelectItem value="biology">Biology</SelectItem>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="arabic">Arabic</SelectItem>
                      <SelectItem value="history">History</SelectItem>
                      <SelectItem value="geography">Geography</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Exam Type */}
              <div className="space-y-2">
                <Label htmlFor="examType">Exam Type *</Label>
                <Select required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select exam type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="midterm">Mid-Term Exam</SelectItem>
                    <SelectItem value="final">Final Exam</SelectItem>
                    <SelectItem value="quiz">Quiz</SelectItem>
                    <SelectItem value="test">Test</SelectItem>
                    <SelectItem value="assessment">Assessment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Schedule & Duration */}
          <Card>
            <CardHeader>
              <CardTitle>Schedule & Duration</CardTitle>
              <CardDescription>
                Set the exam date, time, and duration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Date and Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="examDate">Exam Date *</Label>
                  <Input
                    id="examDate"
                    type="date"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="examTime">Start Time *</Label>
                  <Input
                    id="examTime"
                    type="time"
                    required
                  />
                </div>
              </div>

              {/* Duration and Total Marks */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration *</Label>
                  <Select required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="45">45 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="90">1.5 hours</SelectItem>
                      <SelectItem value="120">2 hours</SelectItem>
                      <SelectItem value="150">2.5 hours</SelectItem>
                      <SelectItem value="180">3 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="totalMarks">Total Marks *</Label>
                  <Input
                    id="totalMarks"
                    type="number"
                    placeholder="e.g., 100"
                    min="1"
                    required
                  />
                </div>
              </div>

              {/* Room/Location */}
              <div className="space-y-2">
                <Label htmlFor="location">Exam Location</Label>
                <Input
                  id="location"
                  placeholder="e.g., Room 101, Main Hall"
                />
              </div>
            </CardContent>
          </Card>

          {/* Instructions & Description */}
          <Card>
            <CardHeader>
              <CardTitle>Instructions & Description</CardTitle>
              <CardDescription>
                Provide detailed instructions and description for the exam
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Exam Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what the exam covers, topics included, etc..."
                  rows={3}
                />
              </div>

              {/* Instructions */}
              <div className="space-y-2">
                <Label htmlFor="instructions">Exam Instructions *</Label>
                <Textarea
                  id="instructions"
                  placeholder="Enter detailed instructions for students:&#10;- Allowed materials (calculator, books, etc.)&#10;- Answer format requirements&#10;- Any special rules or guidelines&#10;- Grading criteria"
                  rows={6}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  These instructions will be displayed to students before they start the exam
                </p>
              </div>

              {/* Warning Message */}
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Make sure to clearly specify all rules and requirements. Students will see these instructions before taking the exam.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Exam Materials & Attachments */}
          <Card>
            <CardHeader>
              <CardTitle>Exam Materials</CardTitle>
              <CardDescription>
                Upload exam papers, question sheets, or reference materials
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Attachments Upload */}
              <div className="space-y-2">
                <Label htmlFor="attachments">Question Paper & Materials</Label>
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
                  <Upload className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
                  <p className="text-sm font-medium text-foreground mb-1">
                    Upload exam files
                  </p>
                  <p className="text-xs text-muted-foreground mb-4">
                    PDFs, Word documents, images (Max 10MB per file)
                  </p>
                  <Input
                    id="attachments"
                    type="file"
                    multiple
                    className="hidden"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('attachments')?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Choose Files
                  </Button>
                </div>

                {/* File List */}
                {files.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <p className="text-sm font-medium text-foreground">
                      Uploaded files ({files.length})
                    </p>
                    {files.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border border-border"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-blue-600" />
                          <div>
                            <p className="text-sm font-medium text-foreground">
                              {file.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {(file.size / 1024).toFixed(2)} KB
                            </p>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                        >
                          <X className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Additional Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Settings</CardTitle>
              <CardDescription>
                Configure exam settings and notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="notifyStudents"
                    className="rounded border-gray-300"
                    defaultChecked
                  />
                  <Label htmlFor="notifyStudents" className="cursor-pointer">
                    Notify students about this exam
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="notifyParents"
                    className="rounded border-gray-300"
                    defaultChecked
                  />
                  <Label htmlFor="notifyParents" className="cursor-pointer">
                    Notify parents about this exam
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="sendReminder"
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="sendReminder" className="cursor-pointer">
                    Send reminder 24 hours before exam
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="allowCalculator"
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="allowCalculator" className="cursor-pointer">
                    Calculator allowed
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="openBook"
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="openBook" className="cursor-pointer">
                    Open book exam
                  </Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Form Actions */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/teacher/exams')}
                >
                  Cancel
                </Button>
                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => toast.info('Exam saved as draft')}
                  >
                    Save as Draft
                  </Button>
                  <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700">
                    Create Exam
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}