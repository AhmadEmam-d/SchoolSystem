import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { HelpCircle, Search, MessageCircle, FileText, Video, Book, Send } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Label } from '../../components/ui/label';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../../components/ui/accordion';
import { toast } from 'sonner';

export function StudentSupport() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');

  const faqItems = [
    {
      question: t('faqHowSubmitHomework') || 'How do I submit my homework?',
      answer: t('faqHowSubmitHomeworkAns') || 'Go to the Homework page, find the assignment you want to submit, click the "Submit" button, enter your answer or upload your files, and click "Submit Homework".'
    },
    {
      question: t('faqWhereGrades') || 'Where can I see my grades?',
      answer: t('faqWhereGradesAns') || 'Visit the Grades page from the sidebar to see all your grades, including exams, assignments, and your overall GPA. You can view detailed breakdowns for each subject.'
    },
    {
      question: t('faqCheckSchedule') || 'How do I check my class schedule?',
      answer: t('faqCheckScheduleAns') || 'Click on "Schedule" in the sidebar to see your weekly timetable with all your classes, timings, teachers, and room numbers.'
    },
    {
      question: t('faqMessageTeachers') || 'How can I message my teachers?',
      answer: t('faqMessageTeachersAns') || 'Go to the Messages page and select the teacher you want to contact. You can send messages directly and they will respond through the same platform.'
    },
    {
      question: t('faqSmartTutor') || 'What is SmartTutor AI and how do I use it?',
      answer: t('faqSmartTutorAns') || 'SmartTutor AI is your personal AI assistant that can help with homework questions, explain concepts, and provide study guidance. Click on "SmartTutor AI" in the sidebar to start chatting.'
    },
    {
      question: t('faqAttendance') || 'How do I view my attendance record?',
      answer: t('faqAttendanceAns') || 'Your attendance percentage is shown on your dashboard and in the Subjects page. You can see detailed attendance for each subject.'
    },
    {
      question: t('faqMissClass') || 'What should I do if I miss a class?',
      answer: t('faqMissClassAns') || 'Contact your teacher through the Messages page and check the class materials or recordings if available. Make sure to submit any missed assignments.'
    },
    {
      question: t('faqResetPassword') || 'How do I reset my password?',
      answer: t('faqResetPasswordAns') || 'For security reasons, please contact the school administration or your teacher to reset your password. They will provide you with a new temporary password.'
    },
  ];

  const filteredFAQs = faqItems.filter(item =>
    item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmitTicket = (e) => {
    e.preventDefault();
    toast.success(t('supportRequestSubmittedStudent'));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('helpSupportTitle')}</h1>
          <p className="text-gray-500 mt-1">{t('getHelpAnswers')}</p>
        </div>
      </div>

      {/* Quick Help Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-none shadow-md hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3">
              <Book className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-medium text-gray-900">{t('studentGuideCard')}</h3>
            <p className="text-sm text-gray-500 mt-1">{t('howUsePortal')}</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-md hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-3">
              <Video className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="font-medium text-gray-900">{t('videoTutorialsCard')}</h3>
            <p className="text-sm text-gray-500 mt-1">{t('watchAndLearn')}</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-md hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
              <MessageCircle className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-medium text-gray-900">{t('askTeacher')}</h3>
            <p className="text-sm text-gray-500 mt-1">{t('getPersonalizedHelp')}</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-md hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-3">
              <FileText className="h-6 w-6 text-orange-600" />
            </div>
            <h3 className="font-medium text-gray-900">{t('studyResourcesCard')}</h3>
            <p className="text-sm text-gray-500 mt-1">{t('extraMaterials')}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* FAQ Section */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-none shadow-md">
            <CardHeader className="border-b bg-gray-50">
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-indigo-600" />
                {t('frequentlyAskedQuestions')}
              </CardTitle>
              <div className="mt-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder={t('searchFAQsPlaceholder')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <Accordion type="single" collapsible className="w-full">
                {filteredFAQs.map((item, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left hover:no-underline">
                      <span className="font-medium text-gray-900">{item.question}</span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-gray-600">{item.answer}</p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
              {filteredFAQs.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>{t('noFAQsFound')}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Contact Support Form */}
        <div className="lg:col-span-1">
          <Card className="border-none shadow-md sticky top-6">
            <CardHeader className="border-b bg-gray-50">
              <CardTitle>{t('needMoreHelp')}</CardTitle>
              <CardDescription>{t('sendMsgToTeachers')}</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSubmitTicket} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="subject">{t('subject')}</Label>
                  <Input id="subject" placeholder={t('whatHelpWith')} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">{t('supportCategoryLabel')}</Label>
                  <select 
                    id="category" 
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  >
                    <option value="">{t('selectCategoryOpt')}</option>
                    <option value="homework">{t('homeworkHelpOpt')}</option>
                    <option value="technical">{t('technicalIssueOpt')}</option>
                    <option value="grades">{t('gradesQuestionOpt')}</option>
                    <option value="schedule">{t('scheduleIssueOpt')}</option>
                    <option value="other">{t('other')}</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">{t('messageContent')}</Label>
                  <Textarea 
                    id="message" 
                    placeholder={t('describeQuestionIssue')} 
                    rows={6}
                    required
                  />
                </div>
                <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700">
                  <Send className="h-4 w-4 mr-2" />
                  {t('sendMessage')}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
