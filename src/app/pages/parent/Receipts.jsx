import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Download, Receipt, Calendar, DollarSign, FileText, Printer, Mail, Filter, ArrowLeft } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { toast } from 'sonner';
import { useNavigate } from 'react-router';

export function ParentReceipts() {
  const { t } = useTranslation();
  const [filterChild, setFilterChild] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const navigate = useNavigate();

  const receipts = [
    { id: '1', receiptNumber: 'RCP-2026-001', description: 'Tuition Fee - March 2026', amount: 1200, paymentDate: '2026-02-28', paymentMethod: 'Credit Card', childName: 'Bart Simpson', transactionId: 'TXN-48573920', category: 'Tuition' },
    { id: '2', receiptNumber: 'RCP-2026-002', description: 'Tuition Fee - March 2026', amount: 1200, paymentDate: '2026-02-28', paymentMethod: 'Credit Card', childName: 'Lisa Simpson', transactionId: 'TXN-48573921', category: 'Tuition' },
    { id: '3', receiptNumber: 'RCP-2026-003', description: 'School Supplies Fee', amount: 120, paymentDate: '2026-02-15', paymentMethod: 'Debit Card', childName: 'Bart Simpson', transactionId: 'TXN-48523456', category: 'Supplies' },
    { id: '4', receiptNumber: 'RCP-2026-004', description: 'Music Class Fee', amount: 200, paymentDate: '2026-02-10', paymentMethod: 'Bank Transfer', childName: 'Lisa Simpson', transactionId: 'TXN-48501234', category: 'Extracurricular' },
    { id: '5', receiptNumber: 'RCP-2026-005', description: 'Sports Equipment Fee', amount: 85, paymentDate: '2026-02-05', paymentMethod: 'Credit Card', childName: 'Bart Simpson', transactionId: 'TXN-48487654', category: 'Supplies' },
    { id: '6', receiptNumber: 'RCP-2026-006', description: 'Science Lab Fee', amount: 150, paymentDate: '2026-01-28', paymentMethod: 'Credit Card', childName: 'Lisa Simpson', transactionId: 'TXN-48445678', category: 'Lab Fees' },
  ];

  const filteredReceipts = receipts.filter(receipt => {
    const matchesChild = filterChild === 'all' || receipt.childName === filterChild;
    const matchesCategory = filterCategory === 'all' || receipt.category === filterCategory;
    return matchesChild && matchesCategory;
  });

  const totalAmount = filteredReceipts.reduce((sum, receipt) => sum + receipt.amount, 0);

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
      case 'Tuition': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'Supplies': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'Extracurricular': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      case 'Lab Fees': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const uniqueChildren = Array.from(new Set(receipts.map(r => r.childName)));
  const uniqueCategories = Array.from(new Set(receipts.map(r => r.category)));

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

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-none shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="text-sm font-medium text-muted-foreground">{t('totalReceiptsLabel')}</div>
                <div className="text-2xl font-bold text-foreground">{filteredReceipts.length}</div>
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
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">{totalAmount} EGP</div>
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
                  {new Date(filteredReceipts[0]?.paymentDate || '').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
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
            <Select value={filterChild} onValueChange={setFilterChild}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder={t('allChildrenFilter')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('allChildrenFilter')}</SelectItem>
                {uniqueChildren.map(child => (
                  <SelectItem key={child} value={child}>{child}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder={t('allCategoriesFilter')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('allCategoriesFilter')}</SelectItem>
                {uniqueCategories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {(filterChild !== 'all' || filterCategory !== 'all') && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setFilterChild('all');
                  setFilterCategory('all');
                }}
              >
                {t('clearFilters')}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Receipts List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredReceipts.map(receipt => (
          <Card key={receipt.id} className="border-none shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-6">
                {/* Receipt Info */}
                <div className="flex-1 space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <h3 className="font-semibold text-foreground">{receipt.description}</h3>
                      <p className="text-sm text-muted-foreground">Receipt #{receipt.receiptNumber}</p>
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
                      <div className="font-medium text-foreground">{receipt.paymentMethod}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs text-muted-foreground">{t('studentLabel')}</div>
                      <Badge variant="outline">{receipt.childName}</Badge>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-border">
                    <div className="text-xs text-muted-foreground">
                      {t('transactionIdLabel')}: <span className="font-mono text-foreground">{receipt.transactionId}</span>
                    </div>
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
        ))}
      </div>

      {filteredReceipts.length === 0 && (
        <Card className="border-none shadow-md">
          <CardContent className="p-12 text-center space-y-3">
            <Receipt className="h-12 w-12 text-muted-foreground mx-auto" />
            <h3 className="font-medium text-foreground">{t('noReceiptsFound')}</h3>
            <p className="text-muted-foreground">{t('adjustFiltersMsg')}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
