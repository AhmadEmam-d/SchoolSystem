import React, { useState } from 'react';
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

export function ParentPayments() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const navigate = useNavigate();

  const payments = [
    { id: '1', description: 'Tuition Fee - March 2026', amount: 1200, dueDate: '2026-03-01', status: 'paid', paidDate: '2026-02-28', childName: 'Bart Simpson' },
    { id: '2', description: 'Tuition Fee - April 2026', amount: 1200, dueDate: '2026-04-01', status: 'pending', childName: 'Bart Simpson' },
    { id: '3', description: 'Science Lab Fee', amount: 150, dueDate: '2026-03-15', status: 'pending', childName: 'Bart Simpson' },
    { id: '4', description: 'Tuition Fee - March 2026', amount: 1200, dueDate: '2026-03-01', status: 'paid', paidDate: '2026-02-28', childName: 'Lisa Simpson' },
    { id: '5', description: 'Advanced Math Program', amount: 300, dueDate: '2026-03-20', status: 'pending', childName: 'Lisa Simpson' },
    { id: '6', description: 'School Trip', amount: 75, dueDate: '2026-02-25', status: 'overdue', childName: 'Bart Simpson' },
  ];

  const paidPayments = payments.filter(p => p.status === 'paid');
  const pendingPayments = payments.filter(p => p.status === 'pending');
  const overduePayments = payments.filter(p => p.status === 'overdue');

  const totalPaid = paidPayments.reduce((sum, p) => sum + p.amount, 0);
  const totalPending = pendingPayments.reduce((sum, p) => sum + p.amount, 0);
  const totalOverdue = overduePayments.reduce((sum, p) => sum + p.amount, 0);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'paid': return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">{t('statusPaid')}</Badge>;
      case 'pending': return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">{t('statusPending')}</Badge>;
      case 'overdue': return <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">{t('statusOverdue')}</Badge>;
      default: return null;
    }
  };

  const handleMakePayment = () => {
    toast.success(t('paymentProcessedSuccess'));
    setIsPaymentDialogOpen(false);
  };

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

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: t('totalPaidLabel'), value: `${totalPaid} EGP`, color: 'text-green-600 dark:text-green-400' },
          { label: t('pendingLabel'), value: `${totalPending} EGP`, color: 'text-yellow-600 dark:text-yellow-400' },
          { label: t('overdueLabel'), value: `${totalOverdue} EGP`, color: 'text-red-600 dark:text-red-400' },
          { label: t('totalDueLabel'), value: `${totalPending + totalOverdue} EGP`, color: 'text-foreground' },
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
      {overduePayments.length > 0 && (
        <Card className="border-none shadow-md bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
              <div className="flex-1 space-y-1">
                <h4 className="font-medium text-red-900 dark:text-red-300">{t('overduePaymentsAlert')}</h4>
                <p className="text-sm text-red-800 dark:text-red-400">
                  {overduePayments.length} {t('overdueLabel')}: {totalOverdue} EGP
                </p>
              </div>
              <Button
                onClick={() => {
                  setSelectedPayment(overduePayments[0]);
                  setIsPaymentDialogOpen(true);
                }}
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
          <div className="divide-y divide-border">
            {payments.map(payment => (
              <div key={payment.id} className="p-6 hover:bg-muted/30 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h4 className="font-medium text-foreground">{payment.description}</h4>
                      {getStatusBadge(payment.status)}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                      <span className="font-semibold text-foreground">{payment.amount} EGP</span>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{t('dueLabel')}: {new Date(payment.dueDate).toLocaleDateString(isRTL ? 'ar-EG' : 'en-US')}</span>
                      </div>
                      <Badge variant="outline" className="text-xs">{payment.childName}</Badge>
                      {payment.paidDate && (
                        <span className="text-green-600 dark:text-green-400">
                          {t('paidOnLabel')} {new Date(payment.paidDate).toLocaleDateString(isRTL ? 'ar-EG' : 'en-US')}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {payment.status === 'paid' ? (
                      <Button variant="outline" size="sm" onClick={() => navigate('/parent/receipts')}>
                        <Receipt className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                        {t('receiptBtn')}
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        className="bg-indigo-600 hover:bg-indigo-700"
                        onClick={() => {
                          setSelectedPayment(payment);
                          setIsPaymentDialogOpen(true);
                        }}
                      >
                        <CreditCard className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                        {t('payNowBtn')}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Payment Dialog */}
      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{t('makePaymentTitle')}</DialogTitle>
            <DialogDescription>
              {selectedPayment && `${selectedPayment.description} - ${selectedPayment.amount} EGP`}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="cardNumber">{t('cardNumberLabel')}</Label>
              <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiry">{t('expiryDateLabel')}</Label>
                <Input id="expiry" placeholder="MM/YY" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvv">{t('cvvLabel')}</Label>
                <Input id="cvv" placeholder="123" type="password" maxLength={3} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">{t('cardholderNameLabel')}</Label>
              <Input id="name" placeholder="John Doe" />
            </div>
            <div className="p-4 bg-muted/50 rounded-lg border border-border">
              <div className="flex items-center justify-between">
                <span className="font-medium text-foreground">{t('totalAmountLabel')}</span>
                <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                  {selectedPayment?.amount} EGP
                </span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPaymentDialogOpen(false)}>
              {t('cancel')}
            </Button>
            <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={handleMakePayment}>
              <CreditCard className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {t('payNowBtn')} {selectedPayment?.amount} EGP
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
