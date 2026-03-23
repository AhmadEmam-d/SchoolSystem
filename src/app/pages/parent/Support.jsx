import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { HelpCircle, Search, MessageCircle, FileText, Video, Book, Send, Phone } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Label } from '../../components/ui/label';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../../components/ui/accordion';
import { toast } from 'sonner';

export function ParentSupport() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');

  const faqItems = [
    {
      question: t('faqTrackProgress') || "How do I track my child's academic progress?",
      answer: t('faqTrackProgressAns') || "You can monitor your child's progress through the Children, Grades, and Attendance pages. Each section provides detailed information about their performance, attendance records, and overall academic standing."
    },
    {
      question: t('faqContactTeachers') || "How can I communicate with my child's teachers?",
      answer: t('faqContactTeachersAns') || "Go to the Messages page to send direct messages to your child's teachers. You can discuss their progress, ask questions, or schedule meetings through the platform."
    },
    {
      question: t('faqFeePayments') || 'How do I make fee payments?',
      answer: t('faqFeePaymentsAns') || 'Navigate to the Payments page where you can view all pending and past payments. Click "Pay Now" on any pending payment to securely process your payment using a credit or debit card.'
    },
    {
      question: t('faqViewHomework') || "Can I view my child's homework assignments?",
      answer: t('faqViewHomeworkAns') || 'Yes! The Homework page shows all assignments for your children, including pending, submitted, and graded work. You can also see due dates and grades for completed assignments.'
    },
    {
      question: t('faqCheckAttendance') || "How do I check my child's attendance?",
      answer: t('faqCheckAttendanceAns') || 'Visit the Attendance page to see detailed attendance records, including overall attendance percentage, recent attendance history, and subject-wise breakdowns.'
    },
    {
      question: t('faqOverdueAssignments') || 'What should I do if I notice my child has overdue assignments?',
      answer: t('faqOverdueAssignmentsAns') || 'Contact the relevant teacher through the Messages page to discuss the situation. Also, encourage your child to submit the work as soon as possible. The Homework page shows all overdue assignments.'
    },
    {
      question: t('faqDownloadReportCard') || "How can I download my child's report card?",
      answer: t('faqDownloadReportCardAns') || "On the Grades page, click the \"Download Report Cards\" button to get a PDF copy of your child's academic report. You can also download individual receipts from the Payments page."
    },
    {
      question: t('faqUpdateContactInfo') || 'What if I need to update my contact information?',
      answer: t('faqUpdateContactInfoAns') || 'Please contact the school administration directly or submit a request through the support form below. They will assist you in updating your contact details in the system.'
    },
    {
      question: t('faqGetNotified') || 'How do I get notified about school events and announcements?',
      answer: t('faqGetNotifiedAns') || "Important announcements are displayed on your dashboard. You can also receive notifications through email for critical updates regarding your child's education."
    },
  ];

  const filteredFAQs = faqItems.filter(item =>
    item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmitTicket = (e) => {
    e.preventDefault();
    toast.success(t('supportRequestSubmittedParent'));
  };

  const quickContacts = [
    { icon: Book, color: 'bg-blue-100 dark:bg-blue-900/40', iconColor: 'text-blue-600 dark:text-blue-400', title: t('parentGuideCard'), desc: t('completeDocs') },
    { icon: Video, color: 'bg-purple-100 dark:bg-purple-900/40', iconColor: 'text-purple-600 dark:text-purple-400', title: t('videoTutorialsCard'), desc: t('stepByStepGuides') },
    { icon: Phone, color: 'bg-green-100 dark:bg-green-900/40', iconColor: 'text-green-600 dark:text-green-400', title: t('callSupportCard'), desc: '+1 (555) 123-4567' },
    { icon: MessageCircle, color: 'bg-orange-100 dark:bg-orange-900/40', iconColor: 'text-orange-600 dark:text-orange-400', title: t('liveChat'), desc: t('chatWithSupport') },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-foreground">{t('helpSupportTitle')}</h1>
          <p className="text-muted-foreground">{t('getHelpAnswersParent')}</p>
        </div>
      </div>

      {/* Quick Contact Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickContacts.map(({ icon: Icon, color, iconColor, title, desc }) => (
          <Card key={title} className="border-none shadow-md hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center space-y-3">
              <div className={`h-12 w-12 rounded-full ${color} flex items-center justify-center mx-auto`}>
                <Icon className={`h-6 w-6 ${iconColor}`} />
              </div>
              <div className="space-y-1">
                <h3 className="font-medium text-foreground">{title}</h3>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </div>
            </CardContent>
          </Card>
        ))}
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
                      <p className="text-muted-foreground leading-relaxed">{item.answer}</p>
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
                    <option value="academic">{t('academicQuestions')}</option>
                    <option value="payments">{t('paymentsAndFees')}</option>
                    <option value="technical">{t('technicalIssueOpt')}</option>
                    <option value="attendance">{t('attendanceConcerns')}</option>
                    <option value="teacher">{t('teacherCommunication')}</option>
                    <option value="other">{t('other')}</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="child">{t('relatedChild')}</Label>
                  <select
                    id="child"
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">{t('selectChild')}</option>
                    <option value="bart">Bart Simpson</option>
                    <option value="lisa">Lisa Simpson</option>
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
                  {t('submitRequestBtn')}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
