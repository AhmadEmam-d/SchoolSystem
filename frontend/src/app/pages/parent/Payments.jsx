import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { CreditCard, Download, Calendar, AlertCircle, Receipt } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '../../components/ui/dialog';
import { Label } from '../../components/ui/label';
import { Input } from '../../components/ui/input';
import { toast } from 'sonner';
import { useNavigate } from 'react-router';
import { api } from '../../lib/api';

export function ParentPayments() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const navigate = useNavigate();

  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // API Data
  const [summary, setSummary] = useState(null);
  const [payments, setPayments] = useState([]);

  // Card form state
  const [cardForm, setCardForm] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    email: '',
  });

  // ── Fetch ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [summaryData, historyData] = await Promise.all([
        api.parentPayments.getSummary(),
        api.parentPayments.getHistory({ pageSize: 50 }),
      ]);
      setSummary(summaryData);
      setPayments(historyData.items || []);
    } catch (error) {
      console.error('Error fetching payments:', error);
      toast.error(t('errorFetchingPayments') || 'Failed to load payments');
    } finally {
      setIsLoading(false);
    }
  };

  // ── Derived counts ────────────────────────────────────────────────────────
  const overduePayments = payments.filter(p => p.status?.toLowerCase() === 'overdue');

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'paid':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">{t('statusPaid')}</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">{t('statusPending')}</Badge>;
      case 'overdue':
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">{t('statusOverdue')}</Badge>;
      default:
        return null;
    }
  };

  // ── Make Payment ──────────────────────────────────────────────────────────
  const handleMakePayment = async () => {
    if (!selectedPayment) return;
    setIsSubmitting(true);
    try {
      const result = await api.parentPayments.makePayment({
        invoiceId:      selectedPayment.invoiceId,
        studentId:      selectedPayment.studentId,
        amount:         selectedPayment.remainingAmount || selectedPayment.amount,
        cardNumber:     cardForm.cardNumber.replace(/\s/g, ''),
        expiryDate:     cardForm.expiryDate,
        cvv:            cardForm.cvv,
        cardholderName: cardForm.cardholderName,
        email:          cardForm.email,
      });

      if (result.success) {
        toast.success(result.message || t('paymentProcessedSuccess'));
        setIsPaymentDialogOpen(false);
        setCardForm({ cardNumber: '', expiryDate: '', cvv: '', cardholderName: '', email: '' });
        await fetchData(); // refresh
      } else {
        toast.error(result.message || t('paymentFailed') || 'Payment failed');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error(error.message || t('paymentFailed') || 'Payment failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openPayDialog = (payment) => {
    setSelectedPayment(payment);
    setIsPaymentDialogOpen(true);
  };

  // ── Loading ───────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-12rem)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4" />
          <p className="text-muted-foreground">{t('loading') || 'Loading...'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-foreground">{t('paymentsPageTitle')}</h1>
          <p className="text-muted-foreground">{t('manageSchoolFeesAndPayments')}</p>
        </div>
        <Button onClick={() => navigate('/parent/receipts')} variant="outline">
          <Download className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
          {t('downloadReceiptsBtn')}
        </Button>
      </div>

      {/* Stats from API */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: t('totalPaidLabel'),    value: `${summary?.totalPaid    ?? 0} EGP`, color: 'text-green-600 dark:text-green-400' },
          { label: t('pendingLabel'),      value: `${summary?.pending      ?? 0} EGP`, color: 'text-yellow-600 dark:text-yellow-400' },
          { label: t('overdueLabel'),      value: `${summary?.overdue      ?? 0} EGP`, color: 'text-red-600 dark:text-red-400' },
          { label: t('totalDueLabel'),     value: `${summary?.totalDue     ?? 0} EGP`, color: 'text-foreground' },
        ].map(({ label, value, color }) => (
          <Card key={label} className="border-none shadow-md">
            <CardContent className="p-6 space-y-1">
              <div className="text-sm font-medium text-muted-foreground">{label}</div>
              <div className={`text-2xl font-bold ${color}`}>{value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Overdue Alert */}
      {summary?.hasOverduePayments && overduePayments.length > 0 && (
        <Card className="border-none shadow-md bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
              <div className="flex-1 space-y-1">
                <h4 className="font-medium text-red-900 dark:text-red-300">{t('overduePaymentsAlert')}</h4>
                <p className="text-sm text-red-800 dark:text-red-400">
                  {summary.overdueCount} {t('overdueLabel')}: {summary.overdueAmount} EGP
                </p>
              </div>
              <Button
                onClick={() => openPayDialog(overduePayments[0])}
                className="bg-red-600 hover:bg-red-700 flex-shrink-0"
              >
                {t('payNowBtn')}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payment History */}
      <Card className="border-none shadow-md">
        <CardHeader className="border-b border-border bg-muted/50">
          <CardTitle>{t('paymentHistoryTitle')}</CardTitle>
          <CardDescription>{t('allTransactionsAndPending')}</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {payments.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground">
              <Receipt className="h-12 w-12 mx-auto mb-3 opacity-40" />
              <p>{t('noPaymentsFound') || 'No payments found'}</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {payments.map(payment => (
                <div key={payment.invoiceId} className="p-6 hover:bg-muted/30 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h4 className="font-medium text-foreground">{payment.title}</h4>
                        {getStatusBadge(payment.status)}
                        {payment.isOverdue && payment.daysOverdue > 0 && (
                          <span className="text-xs text-red-500">
                            ({payment.daysOverdue} {t('daysOverdue') || 'days overdue'})
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                        <span className="font-semibold text-foreground">{payment.amount} EGP</span>
                        {payment.remainingAmount > 0 && (
                          <span className="text-red-500">{t('remaining') || 'Remaining'}: {payment.remainingAmount} EGP</span>
                        )}
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{t('dueLabel')}: {new Date(payment.dueDate).toLocaleDateString(isRTL ? 'ar-EG' : 'en-US')}</span>
                        </div>
                        <Badge variant="outline" className="text-xs">{payment.studentName}</Badge>
                        <Badge variant="outline" className="text-xs">{payment.category}</Badge>
                        {payment.paidDate && (
                          <span className="text-green-600 dark:text-green-400">
                            {t('paidOnLabel')} {new Date(payment.paidDate).toLocaleDateString(isRTL ? 'ar-EG' : 'en-US')}
                          </span>
                        )}
                        {payment.receiptNumber && (
                          <span className="text-xs text-muted-foreground font-mono">{payment.receiptNumber}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {payment.status?.toLowerCase() === 'paid' ? (
                        <Button variant="outline" size="sm" onClick={() => navigate('/parent/receipts')}>
                          <Receipt className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                          {t('receiptBtn')}
                        </Button>
                      ) : payment.canPay ? (
                        <Button
                          size="sm"
                          className="bg-indigo-600 hover:bg-indigo-700"
                          onClick={() => openPayDialog(payment)}
                        >
                          <CreditCard className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                          {t('payNowBtn')}
                        </Button>
                      ) : null}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Dialog */}
      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{t('makePaymentTitle')}</DialogTitle>
            <DialogDescription>
              {selectedPayment && `${selectedPayment.title} - ${selectedPayment.remainingAmount || selectedPayment.amount} EGP`}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="cardNumber">{t('cardNumberLabel')}</Label>
              <Input
                id="cardNumber"
                placeholder="1234 5678 9012 3456"
                value={cardForm.cardNumber}
                onChange={(e) => setCardForm({ ...cardForm, cardNumber: e.target.value })}
                maxLength={19}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiry">{t('expiryDateLabel')}</Label>
                <Input
                  id="expiry"
                  placeholder="MM/YY"
                  value={cardForm.expiryDate}
                  onChange={(e) => setCardForm({ ...cardForm, expiryDate: e.target.value })}
                  maxLength={5}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvv">{t('cvvLabel')}</Label>
                <Input
                  id="cvv"
                  placeholder="123"
                  type="password"
                  maxLength={3}
                  value={cardForm.cvv}
                  onChange={(e) => setCardForm({ ...cardForm, cvv: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">{t('cardholderNameLabel')}</Label>
              <Input
                id="name"
                placeholder="John Doe"
                value={cardForm.cardholderName}
                onChange={(e) => setCardForm({ ...cardForm, cardholderName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{t('email') || 'Email'}</Label>
              <Input
                id="email"
                type="email"
                placeholder="email@example.com"
                value={cardForm.email}
                onChange={(e) => setCardForm({ ...cardForm, email: e.target.value })}
              />
            </div>
            <div className="p-4 bg-muted/50 rounded-lg border border-border">
              <div className="flex items-center justify-between">
                <span className="font-medium text-foreground">{t('totalAmountLabel')}</span>
                <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                  {selectedPayment?.remainingAmount || selectedPayment?.amount} EGP
                </span>
              </div>
              {selectedPayment?.studentName && (
                <p className="text-sm text-muted-foreground mt-1">{t('studentLabel') || 'Student'}: {selectedPayment.studentName}</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPaymentDialogOpen(false)} disabled={isSubmitting}>
              {t('cancel')}
            </Button>
            <Button
              className="bg-indigo-600 hover:bg-indigo-700"
              onClick={handleMakePayment}
              disabled={isSubmitting}
            >
              <CreditCard className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {isSubmitting
                ? (t('processing') || 'Processing...')
                : `${t('payNowBtn')} ${selectedPayment?.remainingAmount || selectedPayment?.amount} EGP`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}