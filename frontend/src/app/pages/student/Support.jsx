import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { HelpCircle, Search, MessageCircle, FileText, Video, Book, Send } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Label } from '../../components/ui/label';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../../components/ui/accordion';
import { toast } from 'sonner';
import { api } from '../../lib/api';

export function StudentSupport() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [faqs, setFaqs] = useState([]);
  const [isLoadingFaqs, setIsLoadingFaqs] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ticketForm, setTicketForm] = useState({
    subject: '',
    category: '',
    message: '',
  });

  // ── Load FAQs ────────────────────────────────────────────────────────────
  useEffect(() => {
    const loadFaqs = async () => {
      try {
        const data = await api.helpSupport.getFAQs();
        setFaqs(data);
      } catch (error) {
        console.error('Error loading FAQs:', error);
        toast.error(t('errorFetchingFAQs') || 'Failed to load FAQs');
      } finally {
        setIsLoadingFaqs(false);
      }
    };
    loadFaqs();
  }, [t]);

  const filteredFAQs = faqs.filter(item =>
    item.question?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.answer?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ── Submit ticket ────────────────────────────────────────────────────────
  const handleSubmitTicket = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const result = await api.helpSupport.createTicket({
        subject:  ticketForm.subject,
        category: ticketForm.category,
        message:  ticketForm.message,
      });
      if (result.success) {
        toast.success(t('supportRequestSubmittedStudent'));
        setTicketForm({ subject: '', category: '', message: '' });
      } else {
        toast.error(result.message || t('errorSubmittingTicket') || 'Failed to submit ticket');
      }
    } catch (error) {
      console.error('Error submitting ticket:', error);
      toast.error(t('errorSubmittingTicket') || 'Failed to submit ticket');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-foreground">{t('helpSupportTitle')}</h1>
          <p className="text-muted-foreground">{t('getHelpAnswers')}</p>
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
              <h3 className="font-medium text-foreground">{t('studentGuideCard')}</h3>
              <p className="text-sm text-muted-foreground">{t('howUsePortal')}</p>
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
              <p className="text-sm text-muted-foreground">{t('watchAndLearn')}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center space-y-3">
            <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center mx-auto">
              <MessageCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="space-y-1">
              <h3 className="font-medium text-foreground">{t('askTeacher')}</h3>
              <p className="text-sm text-muted-foreground">{t('getPersonalizedHelp')}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center space-y-3">
            <div className="h-12 w-12 rounded-full bg-orange-100 dark:bg-orange-900/40 flex items-center justify-center mx-auto">
              <FileText className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div className="space-y-1">
              <h3 className="font-medium text-foreground">{t('studyResourcesCard')}</h3>
              <p className="text-sm text-muted-foreground">{t('extraMaterials')}</p>
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
              {isLoadingFaqs ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
                </div>
              ) : (
                <>
                  <Accordion type="single" collapsible className="w-full">
                    {filteredFAQs.map((item, index) => (
                      <AccordionItem key={item.oid || index} value={`item-${index}`}>
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
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Contact Support Form */}
        <div className="lg:col-span-1">
          <Card className="border-none shadow-md sticky top-6">
            <CardHeader className="border-b border-border bg-muted/50">
              <CardTitle>{t('needMoreHelp')}</CardTitle>
              <CardDescription>{t('sendMsgToTeachers')}</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSubmitTicket} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="subject">{t('subject')}</Label>
                  <Input
                    id="subject"
                    placeholder={t('whatHelpWith')}
                    value={ticketForm.subject}
                    onChange={(e) => setTicketForm({ ...ticketForm, subject: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">{t('supportCategoryLabel')}</Label>
                  <select
                    id="category"
                    value={ticketForm.category}
                    onChange={(e) => setTicketForm({ ...ticketForm, category: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                    value={ticketForm.message}
                    onChange={(e) => setTicketForm({ ...ticketForm, message: e.target.value })}
                    rows={6}
                    required
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-indigo-600 hover:bg-indigo-700"
                >
                  <Send className="h-4 w-4 mr-2" />
                  {isSubmitting ? t('submitting') || 'Submitting...' : t('sendMessage')}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}