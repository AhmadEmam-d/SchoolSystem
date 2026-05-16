import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Download, Calendar, AlertCircle, Receipt, CreditCard } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import {
  Dialog, DialogContent, DialogDescription,
  DialogHeader, DialogTitle,
} from '../../components/ui/dialog';
import { toast } from 'sonner';
import { useNavigate } from 'react-router';
import { api } from '../../lib/api';

// ── PayPal Client ID (frontend-safe only — Secret Key stays on backend) ───────
const PAYPAL_CLIENT_ID = 'Aes5DIzlsdpxUgjcdXbIS3d6KSZvEGCX0C4NVc-nHi_YMBALNtS72NbFiOD0a68JLeXbTgSkBdd26yZv';

// ── Load PayPal SDK once ──────────────────────────────────────────────────────
function loadPayPalScript(currency = 'USD') {
  return new Promise((resolve, reject) => {
    if (window.paypal) { resolve(window.paypal); return; }
    const existing = document.getElementById('paypal-sdk');
    if (existing) { existing.addEventListener('load', () => resolve(window.paypal)); return; }

    const script = document.createElement('script');
    script.id  = 'paypal-sdk';
    script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=${currency}`;
    script.onload  = () => resolve(window.paypal);
    script.onerror = () => reject(new Error('PayPal SDK failed to load'));
    document.head.appendChild(script);
  });
}

// ── PayPal Buttons Component ──────────────────────────────────────────────────
function PayPalButtons({ amount, invoiceId, studentId, onSuccess, onError }) {
  const containerRef = useRef(null);
  const renderedRef  = useRef(false);

  useEffect(() => {
    if (renderedRef.current) return;
    renderedRef.current = true;

    loadPayPalScript('USD')
      .then((paypal) => {
        if (!containerRef.current) return;
        containerRef.current.innerHTML = '';

        paypal.Buttons({
          style: { layout: 'vertical', color: 'blue', shape: 'rect', label: 'pay' },

          // 1️⃣ Create order on PayPal side
          createOrder: (data, actions) =>
            actions.order.create({
              purchase_units: [{
                amount: { value: amount.toFixed(2), currency_code: 'USD' },
                description: `Invoice ${invoiceId}`,
                custom_id: invoiceId,
              }],
            }),

          // 2️⃣ On approval — send paypalOrderId to backend to capture & record
          onApprove: async (data) => {
            try {
              const result = await api.parentPayments.makePayment({
                invoiceId,
                studentId,
                amount,
                paypalOrderId: data.orderID,
                paymentMethod: 'PayPal',
              });
              if (result.success) {
                onSuccess(result);
              } else {
                onError(result.message || 'Payment failed');
              }
            } catch (err) {
              onError(err.message || 'Payment failed');
            }
          },

          onError:  (err) => { console.error('PayPal error:', err); onError('PayPal encountered an error. Please try again.'); },
          onCancel: ()    => { toast.info('Payment cancelled'); },
        }).render(containerRef.current);
      })
      .catch((err) => onError(err.message));

    return () => {
      if (containerRef.current) containerRef.current.innerHTML = '';
      renderedRef.current = false;
    };
  }, [amount, invoiceId, studentId]);

  return (
    <div ref={containerRef} className="w-full min-h-[150px] flex items-center justify-center">
      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600" />
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export function ParentPayments() {
  const { t, i18n } = useTranslation();
  const isRTL   = i18n.language === 'ar';
  const navigate = useNavigate();

  const [isDialogOpen,    setIsDialogOpen]    = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isLoading,       setIsLoading]       = useState(true);
  const [summary,         setSummary]         = useState(null);
  const [payments,        setPayments]        = useState([]);

  // ── Fetch ───────────────────────────────────────────────────────────────────
  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [summaryData, historyData] = await Promise.all([
        api.parentPayments.getSummary(),
        api.parentPayments.getHistory({ pageSize: 50 }),
      ]);
      setSummary(summaryData);
      setPayments(historyData.items || []);
    } catch (err) {
      console.error(err);
      toast.error(t('errorFetchingPayments') || 'Failed to load payments');
    } finally {
      setIsLoading(false);
    }
  };

  const overduePayments = payments.filter(p => p.status?.toLowerCase() === 'overdue');

  const handlePaymentSuccess = async (result) => {
    toast.success(result.message || t('paymentProcessedSuccess'));
    setIsDialogOpen(false);
    setSelectedPayment(null);
    await fetchData();
  };

  const openPayDialog = (payment) => {
    setSelectedPayment(payment);
    setIsDialogOpen(true);
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'paid':    return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">{t('statusPaid')}</Badge>;
      case 'pending': return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">{t('statusPending')}</Badge>;
      case 'overdue': return <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">{t('statusOverdue')}</Badge>;
      default:        return null;
    }
  };

  // ── Loading ─────────────────────────────────────────────────────────────────
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

      {/* Header */}
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
          { label: t('totalPaidLabel'), value: `${summary?.totalPaid ?? 0} EGP`, color: 'text-green-600 dark:text-green-400' },
          { label: t('pendingLabel'),   value: `${summary?.pending   ?? 0} EGP`, color: 'text-yellow-600 dark:text-yellow-400' },
          { label: t('overdueLabel'),   value: `${summary?.overdue   ?? 0} EGP`, color: 'text-red-600 dark:text-red-400' },
          { label: t('totalDueLabel'),  value: `${summary?.totalDue  ?? 0} EGP`, color: 'text-foreground' },
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
              <Button onClick={() => openPayDialog(overduePayments[0])} className="bg-red-600 hover:bg-red-700 flex-shrink-0">
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
                        <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700" onClick={() => openPayDialog(payment)}>
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

      {/* PayPal Payment Dialog */}
      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => { setIsDialogOpen(open); if (!open) setSelectedPayment(null); }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              {t('makePaymentTitle')}
            </DialogTitle>
            <DialogDescription>
              {selectedPayment && (
                <span>
                  {selectedPayment.title}
                  {' — '}
                  <span className="font-semibold text-indigo-600">
                    {selectedPayment.remainingAmount || selectedPayment.amount} EGP
                  </span>
                  {selectedPayment.studentName && (
                    <span className="text-muted-foreground"> · {selectedPayment.studentName}</span>
                  )}
                </span>
              )}
            </DialogDescription>
          </DialogHeader>

          {selectedPayment && (
            <>
              {/* Payment Summary */}
              <div className="p-4 bg-muted/50 rounded-lg border border-border space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t('invoiceLabel') || 'Invoice'}</span>
                  <span className="font-mono text-foreground">{selectedPayment.invoiceNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t('studentLabel') || 'Student'}</span>
                  <span className="font-medium text-foreground">{selectedPayment.studentName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t('categoryLabel') || 'Category'}</span>
                  <span className="font-medium text-foreground">{selectedPayment.category}</span>
                </div>
                <div className="flex justify-between border-t border-border pt-2">
                  <span className="font-semibold text-foreground">{t('totalAmountLabel')}</span>
                  <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                    {selectedPayment.remainingAmount || selectedPayment.amount} EGP
                  </span>
                </div>
              </div>

              {/* PayPal Buttons */}
              <div className="pt-2">
                <p className="text-xs text-muted-foreground text-center mb-3">
                  🔒 {t('securePaymentMsg') || 'Secure payment powered by PayPal'}
                </p>
                <PayPalButtons
                  key={selectedPayment.invoiceId}
                  amount={selectedPayment.remainingAmount || selectedPayment.amount}
                  invoiceId={selectedPayment.invoiceId}
                  studentId={selectedPayment.studentId}
                  onSuccess={handlePaymentSuccess}
                  onError={(msg) => toast.error(msg || t('paymentFailed'))}
                />
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

    </div>
  );
}