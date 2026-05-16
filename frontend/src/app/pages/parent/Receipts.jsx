import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Download, Receipt, Calendar, DollarSign, Printer, Mail, Filter, ArrowLeft } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { toast } from 'sonner';
import { useNavigate } from 'react-router';
import { api } from '../../lib/api';

export function ParentReceipts() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [filterStudent, setFilterStudent] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [receiptsData, setReceiptsData] = useState(null); // full API response
  const [receipts, setReceipts] = useState([]);

  // ── Fetch ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    fetchReceipts();
  }, []);

  const fetchReceipts = async () => {
    setIsLoading(true);
    try {
      const data = await api.parentPayments.getReceipts({ pageSize: 100 });
      setReceiptsData(data);
      setReceipts(data.items || []);
    } catch (error) {
      console.error('Error fetching receipts:', error);
      toast.error(t('errorFetchingReceipts') || 'Failed to load receipts');
    } finally {
      setIsLoading(false);
    }
  };

  // ── Filter ────────────────────────────────────────────────────────────────
  const filteredReceipts = receipts.filter(r => {
    const matchesStudent  = filterStudent  === 'all' || r.studentName  === filterStudent;
    const matchesCategory = filterCategory === 'all' || r.category     === filterCategory;
    return matchesStudent && matchesCategory;
  });

  const totalAmount = filteredReceipts.reduce((sum, r) => sum + r.amount, 0);

  const uniqueStudents   = Array.from(new Set(receipts.map(r => r.studentName).filter(Boolean)));
  const uniqueCategories = Array.from(new Set(receipts.map(r => r.category).filter(Boolean)));

  // ── Actions (UI only — wire to real endpoints if available) ───────────────
  const handleDownloadReceipt = (receipt) => {
    toast.success(`Downloading receipt ${receipt.receiptNumber}`);
  };

  const handleDownloadAll = () => {
    toast.success(`Downloading ${filteredReceipts.length} receipts as PDF`);
  };

  const handlePrintReceipt = (receipt) => {
    toast.success(`Printing receipt ${receipt.receiptNumber}`);
  };

  const handleEmailReceipt = (receipt) => {
    toast.success(`Receipt ${receipt.receiptNumber} sent to your email`);
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Tuition':         return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'Activity':        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      case 'Lab Fee':         return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
      case 'Supplies':        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'Extracurricular': return 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400';
      default:                return 'bg-muted text-muted-foreground';
    }
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
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <Button onClick={() => navigate('/parent/payments')} variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-foreground">{t('paymentReceiptsTitle')}</h1>
            <p className="text-muted-foreground">{t('viewAndDownloadReceipts')}</p>
          </div>
        </div>
        <Button onClick={handleDownloadAll} className="bg-indigo-600 hover:bg-indigo-700">
          <Download className="h-4 w-4 mr-2" />
          {t('downloadAll')} ({filteredReceipts.length})
        </Button>
      </div>

      {/* Summary Stats — from API */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-none shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="text-sm font-medium text-muted-foreground">{t('totalReceiptsLabel')}</div>
                <div className="text-2xl font-bold text-foreground">
                  {filterStudent === 'all' && filterCategory === 'all'
                    ? (receiptsData?.totalReceipts ?? filteredReceipts.length)
                    : filteredReceipts.length}
                </div>
              </div>
              <div className="h-12 w-12 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center">
                <Receipt className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="text-sm font-medium text-muted-foreground">{t('totalAmountLabel')}</div>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {filterStudent === 'all' && filterCategory === 'all'
                    ? (receiptsData?.totalAmount ?? totalAmount)
                    : totalAmount} EGP
                </div>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="text-sm font-medium text-muted-foreground">{t('latestPaymentLabel')}</div>
                <div className="text-2xl font-bold text-foreground">
                  {receiptsData?.latestPaymentDate
                    ? new Date(receiptsData.latestPaymentDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                    : '—'}
                </div>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-none shadow-md">
        <CardContent className="p-6">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-muted-foreground" />
              <span className="font-medium text-foreground">{t('filtersLabel')}:</span>
            </div>
            <Select value={filterStudent} onValueChange={setFilterStudent}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder={t('allChildrenFilter')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('allChildrenFilter')}</SelectItem>
                {uniqueStudents.map(name => (
                  <SelectItem key={name} value={name}>{name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder={t('allCategoriesFilter')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('allCategoriesFilter')}</SelectItem>
                {uniqueCategories.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {(filterStudent !== 'all' || filterCategory !== 'all') && (
              <Button variant="outline" size="sm" onClick={() => { setFilterStudent('all'); setFilterCategory('all'); }}>
                {t('clearFilters')}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Receipts List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredReceipts.length === 0 ? (
          <Card className="border-none shadow-md">
            <CardContent className="p-12 text-center space-y-3">
              <Receipt className="h-12 w-12 text-muted-foreground mx-auto" />
              <h3 className="font-medium text-foreground">{t('noReceiptsFound')}</h3>
              <p className="text-muted-foreground">{t('adjustFiltersMsg')}</p>
            </CardContent>
          </Card>
        ) : (
          filteredReceipts.map((receipt, index) => (
            <Card key={receipt.receiptNumber || index} className="border-none shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-6">
                  {/* Receipt Info */}
                  <div className="flex-1 space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <h3 className="font-semibold text-foreground">{receipt.title}</h3>
                        <p className="text-sm text-muted-foreground">Receipt #{receipt.receiptNumber}</p>
                        <p className="text-xs text-muted-foreground">Invoice: {receipt.invoiceNumber}</p>
                      </div>
                      <Badge className={getCategoryColor(receipt.category)}>
                        {receipt.category}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="space-y-1">
                        <div className="text-xs text-muted-foreground">{t('amountLabel')}</div>
                        <div className="font-semibold text-green-600 dark:text-green-400">{receipt.amount} EGP</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-xs text-muted-foreground">{t('paymentDateLabel')}</div>
                        <div className="font-medium text-foreground">
                          {new Date(receipt.paymentDate).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-xs text-muted-foreground">{t('paymentMethodLabel')}</div>
                        <div className="font-medium text-foreground">
                          {receipt.paymentMethod}
                          {receipt.cardLastFour && (
                            <span className="text-muted-foreground ml-1">••{receipt.cardLastFour}</span>
                          )}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-xs text-muted-foreground">{t('studentLabel')}</div>
                        <Badge variant="outline">{receipt.studentName}</Badge>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-border flex items-center gap-4 flex-wrap">
                      <div className="text-xs text-muted-foreground">
                        {t('transactionIdLabel')}: <span className="font-mono text-foreground">{receipt.transactionId}</span>
                      </div>
                      {receipt.status && (
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 text-xs">
                          {receipt.status}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-2 flex-shrink-0">
                    <Button onClick={() => handleDownloadReceipt(receipt)} size="sm" className="bg-indigo-600 hover:bg-indigo-700">
                      <Download className="h-4 w-4 mr-2" />
                      {t('downloadBtn')}
                    </Button>
                    <Button onClick={() => handlePrintReceipt(receipt)} variant="outline" size="sm">
                      <Printer className="h-4 w-4 mr-2" />
                      {t('printBtn')}
                    </Button>
                    <Button onClick={() => handleEmailReceipt(receipt)} variant="outline" size="sm">
                      <Mail className="h-4 w-4 mr-2" />
                      {t('emailBtn')}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}