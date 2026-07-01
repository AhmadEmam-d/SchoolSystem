import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Download, Receipt, Calendar, DollarSign, Printer, Mail, Filter, ArrowLeft, Loader2 } from 'lucide-react';
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

  // Per-action loading state so buttons show a spinner and can't be double-clicked
  const [downloadingIds, setDownloadingIds] = useState(new Set());
  const [printingIds, setPrintingIds] = useState(new Set());

  const [isDownloadingAll, setIsDownloadingAll] = useState(false);

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

  // ── Helpers: build a printable HTML receipt (used for both Print & Download) ─
  const escapeHtml = (value) =>
    String(value ?? '').replace(/[&<>"']/g, (c) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    }[c]));

  const receiptStyles = `
    body { font-family: Arial, Helvetica, sans-serif; color: #1a1a1a; margin: 0; padding: 0; }
    .page { padding: 40px; page-break-after: always; }
    .page:last-child { page-break-after: auto; }
    .header { display:flex; justify-content:space-between; align-items:flex-start; border-bottom:2px solid #4f46e5; padding-bottom:16px; margin-bottom:24px; }
    .header h1 { color:#4f46e5; margin:0 0 4px 0; font-size:22px; }
    .meta { color:#666; font-size:12px; line-height:1.5; }
    table { width:100%; border-collapse:collapse; margin-top:12px; }
    td { padding:10px 0; border-bottom:1px solid #eee; font-size:13px; }
    td.label { color:#666; width:40%; }
    td.value { font-weight:600; text-align:right; }
    .total { margin-top:16px; padding-top:14px; border-top:2px solid #4f46e5; display:flex; justify-content:space-between; align-items:center; font-size:17px; font-weight:700; color:#16a34a; }
    .status { display:inline-block; margin-top:14px; padding:4px 12px; border-radius:20px; background:#dcfce7; color:#166534; font-size:11px; font-weight:600; }
    .footer { margin-top:32px; text-align:center; color:#999; font-size:11px; }
    @media print { .page { padding: 20px 30px; } }
  `;

  const buildReceiptBody = (receipt) => `
    <div class="header">
      <div>
        <h1>${t('receiptDocTitle') || 'Payment Receipt'}</h1>
        <div class="meta">${t('receiptNumberLabel') || 'Receipt'} #${escapeHtml(receipt.receiptNumber)}</div>
        <div class="meta">${t('invoiceLabel') || 'Invoice'}: ${escapeHtml(receipt.invoiceNumber || '-')}</div>
      </div>
      <div class="meta" style="text-align:right">
        ${receipt.paymentDate ? new Date(receipt.paymentDate).toLocaleDateString() : ''}
      </div>
    </div>
    <table>
      <tr><td class="label">${t('descriptionLabel') || 'Description'}</td><td class="value">${escapeHtml(receipt.title)}</td></tr>
      <tr><td class="label">${t('categoryLabel') || 'Category'}</td><td class="value">${escapeHtml(receipt.category)}</td></tr>
      <tr><td class="label">${t('studentLabel') || 'Student'}</td><td class="value">${escapeHtml(receipt.studentName)}</td></tr>
      <tr><td class="label">${t('paymentMethodLabel') || 'Payment Method'}</td><td class="value">${escapeHtml(receipt.paymentMethod)}${receipt.cardLastFour ? ' &bull;&bull;' + escapeHtml(receipt.cardLastFour) : ''}</td></tr>
      <tr><td class="label">${t('transactionIdLabel') || 'Transaction ID'}</td><td class="value" style="font-family:monospace;">${escapeHtml(receipt.transactionId)}</td></tr>
    </table>
    <div class="total"><span>${t('totalPaidLabel') || 'Total Paid'}</span><span>${escapeHtml(receipt.amount)} EGP</span></div>
    ${receipt.status ? `<div class="status">${escapeHtml(receipt.status)}</div>` : ''}
    <div class="footer">${t('receiptFooterNote') || 'This is a computer-generated receipt.'}</div>
  `;

  const buildReceiptDocument = (bodyHtml) => `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>${t('paymentReceiptsTitle') || 'Payment Receipts'}</title>
        <style>${receiptStyles}</style>
      </head>
      <body>${bodyHtml}</body>
    </html>
  `;

  // Opens a hidden/blank window with the receipt(s) and triggers the browser
  // print dialog. Users can choose "Save as PDF" there for a real download,
  // or pick a printer to print directly — same flow, different destination.
  const openPrintableWindow = (html) => {
    const win = window.open('', '_blank', 'width=850,height=950');
    if (!win) {
      toast.error(t('popupBlockedError') || 'Please allow pop-ups for this site to continue');
      return null;
    }
    win.document.open();
    win.document.write(html);
    win.document.close();
    win.onload = () => {
      win.focus();
      win.print();
    };
    return win;
  };

  // ── Actions ───────────────────────────────────────────────────────────────
  const handleDownloadReceipt = async (receipt) => {
    const id = receipt.receiptNumber;
    setDownloadingIds(prev => new Set(prev).add(id));
    try {
      // Prefer a real backend-generated file if the endpoint exists.
      if (api.parentPayments.downloadReceipt) {
        const blob = await api.parentPayments.downloadReceipt(id);
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `receipt-${id}.pdf`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      } else {
        // Fallback: open the print dialog so the user can save it as a PDF.
        const doc = buildReceiptDocument(`<div class="page">${buildReceiptBody(receipt)}</div>`);
        openPrintableWindow(doc);
      }
      toast.success(`${t('downloadingReceiptMsg') || 'Downloading receipt'} ${id}`);
    } catch (error) {
      console.error('Error downloading receipt:', error);
      toast.error(t('errorDownloadingReceipt') || 'Failed to download receipt');
    } finally {
      setDownloadingIds(prev => { const next = new Set(prev); next.delete(id); return next; });
    }
  };

  const handleDownloadAll = async () => {
    if (filteredReceipts.length === 0) return;
    setIsDownloadingAll(true);
    try {
      if (api.parentPayments.downloadReceiptsBundle) {
        const ids = filteredReceipts.map(r => r.receiptNumber);
        const blob = await api.parentPayments.downloadReceiptsBundle(ids);
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `receipts-${new Date().toISOString().slice(0, 10)}.pdf`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      } else {
        const pages = filteredReceipts.map(r => `<div class="page">${buildReceiptBody(r)}</div>`).join('');
        const doc = buildReceiptDocument(pages);
        openPrintableWindow(doc);
      }
      toast.success(`${t('downloadingAllMsg') || 'Downloading'} ${filteredReceipts.length} ${t('receiptsAsPdf') || 'receipts as PDF'}`);
    } catch (error) {
      console.error('Error downloading receipts:', error);
      toast.error(t('errorDownloadingReceipts') || 'Failed to download receipts');
    } finally {
      setIsDownloadingAll(false);
    }
  };

  const handlePrintReceipt = (receipt) => {
    const id = receipt.receiptNumber;
    setPrintingIds(prev => new Set(prev).add(id));
    try {
      const doc = buildReceiptDocument(`<div class="page">${buildReceiptBody(receipt)}</div>`);
      const win = openPrintableWindow(doc);
      if (win) toast.success(`${t('printingReceiptMsg') || 'Printing receipt'} ${id}`);
    } finally {
      setPrintingIds(prev => { const next = new Set(prev); next.delete(id); return next; });
    }
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
        <Button
          onClick={handleDownloadAll}
          disabled={isDownloadingAll || filteredReceipts.length === 0}
          className="bg-indigo-600 hover:bg-indigo-700"
        >
          {isDownloadingAll ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Download className="h-4 w-4 mr-2" />
          )}
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
          filteredReceipts.map((receipt, index) => {
            const id = receipt.receiptNumber || index;
            const isDownloading = downloadingIds.has(id);
            const isPrinting = printingIds.has(id);
           

            return (
              <Card key={id} className="border-none shadow-md hover:shadow-lg transition-shadow">
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
                      <Button
                        onClick={() => handleDownloadReceipt(receipt)}
                        disabled={isDownloading}
                        size="sm"
                        className="bg-indigo-600 hover:bg-indigo-700"
                      >
                        {isDownloading ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Download className="h-4 w-4 mr-2" />
                        )}
                        {t('downloadBtn')}
                      </Button>
                      <Button
                        onClick={() => handlePrintReceipt(receipt)}
                        disabled={isPrinting}
                        variant="outline"
                        size="sm"
                      >
                        {isPrinting ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Printer className="h-4 w-4 mr-2" />
                        )}
                        {t('printBtn')}
                      </Button>
                     
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}