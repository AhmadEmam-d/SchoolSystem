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

export function TeacherSupport() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');

  const faqItems = [
    {
      question: t('faqMarkAttendance') || 'How do I mark attendance for my class?',
      answer: t('faqMarkAttendanceAns') || "Navigate to the Attendance page, select your class and date, then mark each student as Present, Absent, or Late. Don't forget to save your changes when done."
    },
    {
      question: t('faqCreateAssignment') || 'How can I create a new assignment or homework?',
      answer: t('faqCreateAssignmentAns') || 'Go to the Homework page and click the "Create Homework" button. Fill in the details including title, description, due date, and attach any necessary files. You can assign it to specific classes.'
    },
    {
      question: t('faqGradeSubmissions') || 'How do I grade student submissions?',
      answer: t('faqGradeSubmissionsAns') || 'Visit the Exams or Homework page, find the assignment you want to grade, and click "Grade Papers". You can view each student\'s submission and enter their marks.'
    },
    {
      question: t('faqMsgParents') || 'Can I send messages to parents?',
      answer: t('faqMsgParentsAns') || 'Yes! Go to the Messages page where you can communicate with both students and their parents. You can also send bulk announcements through the system.'
    },
    {
      question: t('faqUseSmartTutor') || 'How do I use the SmartTutor AI feature?',
      answer: t('faqUseSmartTutorAns') || 'Click on "SmartTutor AI" in the sidebar. You can ask questions about creating lesson plans, generating quiz questions, or getting teaching suggestions. The AI is designed to assist teachers in their daily tasks.'
    },
    {
      question: t('faqViewTimetable') || 'How can I view my class timetable?',
      answer: t('faqViewTimetableAns') || 'Your teaching schedule is available on your dashboard. You can also access a detailed timetable view to see all your classes, timings, and rooms assigned to you.'
    },
    {
      question: t('faqTechnicalIssue') || 'What should I do if I encounter a technical issue?',
      answer: t('faqTechnicalIssueAns') || 'Use the "Contact Support" form below to describe your issue. Our technical team will respond within 24 hours. For urgent matters, you can also contact the school IT department directly.'
    },
    {
      question: t('faqUpdateProfile') || 'How do I update my profile information?',
      answer: t('faqUpdateProfileAns') || 'Currently, profile updates need to be requested through the administration. Please contact the school office or use the support form to request any changes to your profile.'
    },
  ];

  const filteredFAQs = faqItems.filter(item =>
    item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmitTicket = (e) => {
    e.preventDefault();
    toast.success(t('supportRequestSubmittedTeacher'));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-foreground">{t('helpSupportTitle')}</h1>
          <p className="text-muted-foreground">{t('getHelpAnswersTeacher')}</p>
        </div>
      </div>

      {/* Quick Help Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-none shadow-md hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center space-y-3">
            <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center mx-auto">
              <Book className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="space-y-1">
              <h3 className="font-medium text-foreground">{t('userGuide')}</h3>
              <p className="text-sm text-muted-foreground">{t('completeDocs')}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-md hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center space-y-3">
            <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center mx-auto">
              <Video className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="space-y-1">
              <h3 className="font-medium text-foreground">{t('videoTutorialsCard')}</h3>
              <p className="text-sm text-muted-foreground">{t('stepByStepGuides')}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-md hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center space-y-3">
            <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center mx-auto">
              <MessageCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="space-y-1">
              <h3 className="font-medium text-foreground">{t('liveChat')}</h3>
              <p className="text-sm text-muted-foreground">{t('chatWithSupport')}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-md hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center space-y-3">
            <div className="h-12 w-12 rounded-full bg-orange-100 dark:bg-orange-900/40 flex items-center justify-center mx-auto">
              <FileText className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div className="space-y-1">
              <h3 className="font-medium text-foreground">{t('knowledgeBase') || 'Knowledge Base'}</h3>
              <p className="text-sm text-muted-foreground">{t('browseArticles') || 'Browse help articles'}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* FAQ Section */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-none shadow-md">
            <CardHeader className="border-b border-border bg-muted/50">
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                {t('frequentlyAskedQuestions')}
              </CardTitle>
              <div className="mt-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
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
                      <span className="font-medium text-foreground">{item.question}</span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground">{item.answer}</p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
              {filteredFAQs.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <p>{t('noFAQsFound')}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Contact Support Form */}
        <div className="lg:col-span-1">
          <Card className="border-none shadow-md sticky top-6">
            <CardHeader className="border-b border-border bg-muted/50">
              <CardTitle>{t('contactSupport')}</CardTitle>
              <CardDescription>{t('needMoreHelpContact')}</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSubmitTicket} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="subject">{t('subject')}</Label>
                  <Input id="subject" placeholder={t('briefDescription')} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">{t('supportCategoryLabel')}</Label>
                  <select
                    id="category"
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  >
                    <option value="">{t('selectCategoryOpt')}</option>
                    <option value="technical">{t('technicalIssueOpt')}</option>
                    <option value="account">{t('accountAccessOpt') || 'Account Access'}</option>
                    <option value="feature">{t('featureRequestOpt') || 'Feature Request'}</option>
                    <option value="other">{t('other')}</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">{t('messageContent')}</Label>
                  <Textarea
                    id="message"
                    placeholder={t('describeQuestionConcern')}
                    rows={6}
                    required
                  />
                </div>
                <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700">
                  <Send className="h-4 w-4 mr-2" />
                  {t('submitTicketBtn')}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}