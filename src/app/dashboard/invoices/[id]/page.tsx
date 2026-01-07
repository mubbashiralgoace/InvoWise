"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ArrowLeft, Edit, Download } from "lucide-react";
import jsPDF from "jspdf";

interface Invoice {
  id: string;
  invoice_number: string;
  status: string;
  issue_date: string;
  due_date: string;
  currency: string;
  tax_rate: number;
  discount: number;
  discount_type: string;
  subtotal: number;
  tax_amount: number;
  discount_amount: number;
  total: number;
  paid_amount: number;
  notes: string | null;
  terms: string | null;
  client: {
    name: string;
    email: string;
    address: string | null;
    city: string | null;
    state: string | null;
    zip_code: string | null;
    country: string | null;
  } | null;
  items: Array<{
    id: string;
    description: string;
    quantity: number;
    unit_price: number;
    tax_rate: number;
    line_total: number;
  }>;
}

export default function InvoiceViewPage() {
  const params = useParams();
  const { toast } = useToast();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchInvoice();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  const fetchInvoice = async () => {
    try {
      const supabase = createSupabaseBrowserClient();
      const { data: invoiceData, error: invoiceError } = await supabase
        .from("invoices")
        .select(`
          *,
          clients:client_id (
            name,
            email,
            address,
            city,
            state,
            zip_code,
            country
          )
        `)
        .eq("id", params.id)
        .single();

      if (invoiceError) throw invoiceError;

      const { data: itemsData, error: itemsError } = await supabase
        .from("invoice_items")
        .select("*")
        .eq("invoice_id", params.id)
        .order("sort_order");

      if (itemsError) throw itemsError;

      interface InvoiceDataWithClient {
        clients?: {
          name: string;
          email: string;
          address: string | null;
          city: string | null;
          state: string | null;
          zip_code: string | null;
          country: string | null;
        } | null;
      }

      setInvoice({
        ...invoiceData,
        client: (invoiceData as InvoiceDataWithClient).clients || null,
        items: itemsData || [],
      });
    } catch (error) {
      console.error("Error fetching invoice:", error);
      toast({
        title: "Error",
        description: "Failed to load invoice",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    if (!invoice) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    let yPos = margin;

    // Header
    doc.setFontSize(20);
    doc.text("INVOICE", margin, yPos);
    yPos += 10;

    // Invoice details
    doc.setFontSize(10);
    doc.text(`Invoice #: ${invoice.invoice_number}`, pageWidth - margin - 60, yPos - 10, { align: "right" });
    doc.text(`Issue Date: ${format(new Date(invoice.issue_date), "MMM dd, yyyy")}`, pageWidth - margin - 60, yPos - 5, { align: "right" });
    doc.text(`Due Date: ${format(new Date(invoice.due_date), "MMM dd, yyyy")}`, pageWidth - margin - 60, yPos, { align: "right" });
    yPos += 15;

    // Client info
    if (invoice.client) {
      doc.setFontSize(12);
      doc.text("Bill To:", margin, yPos);
      yPos += 5;
      doc.setFontSize(10);
      doc.text(invoice.client.name, margin, yPos);
      yPos += 5;
      if (invoice.client.email) {
        doc.text(invoice.client.email, margin, yPos);
        yPos += 5;
      }
      if (invoice.client.address) {
        doc.text(invoice.client.address, margin, yPos);
        yPos += 5;
      }
      const addressParts = [
        invoice.client.city,
        invoice.client.state,
        invoice.client.zip_code,
      ].filter(Boolean);
      if (addressParts.length > 0) {
        doc.text(addressParts.join(", "), margin, yPos);
        yPos += 5;
      }
    }
    yPos += 10;

    // Items table
    doc.setFontSize(12);
    doc.text("Items", margin, yPos);
    yPos += 8;

    // Table header
    doc.setFontSize(9);
    doc.text("Description", margin, yPos);
    doc.text("Qty", margin + 80, yPos);
    doc.text("Price", margin + 100, yPos);
    doc.text("Total", pageWidth - margin - 20, yPos, { align: "right" });
    yPos += 5;
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 5;

    // Table rows
    invoice.items.forEach((item) => {
      if (yPos > 250) {
        doc.addPage();
        yPos = margin;
      }
      doc.setFontSize(9);
      doc.text(item.description.substring(0, 40), margin, yPos);
      doc.text(item.quantity.toString(), margin + 80, yPos);
      doc.text(`$${item.unit_price.toFixed(2)}`, margin + 100, yPos);
      doc.text(`$${item.line_total.toFixed(2)}`, pageWidth - margin - 20, yPos, { align: "right" });
      yPos += 6;
    });

    yPos += 5;
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 8;

    // Totals
    doc.setFontSize(9);
    doc.text("Subtotal:", pageWidth - margin - 50, yPos, { align: "right" });
    doc.text(`$${invoice.subtotal.toFixed(2)}`, pageWidth - margin - 10, yPos, { align: "right" });
    yPos += 6;
    doc.text(`Tax (${invoice.tax_rate}%):`, pageWidth - margin - 50, yPos, { align: "right" });
    doc.text(`$${invoice.tax_amount.toFixed(2)}`, pageWidth - margin - 10, yPos, { align: "right" });
    yPos += 6;
    if (invoice.discount_amount > 0) {
      doc.text("Discount:", pageWidth - margin - 50, yPos, { align: "right" });
      doc.text(`-$${invoice.discount_amount.toFixed(2)}`, pageWidth - margin - 10, yPos, { align: "right" });
      yPos += 6;
    }
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Total:", pageWidth - margin - 50, yPos, { align: "right" });
    doc.text(`$${invoice.total.toFixed(2)}`, pageWidth - margin - 10, yPos, { align: "right" });
    doc.setFont("helvetica", "normal");

    // Notes
    if (invoice.notes) {
      yPos += 15;
      doc.setFontSize(10);
      doc.text("Notes:", margin, yPos);
      yPos += 5;
      doc.setFontSize(9);
      const splitNotes = doc.splitTextToSize(invoice.notes, pageWidth - 2 * margin);
      doc.text(splitNotes, margin, yPos);
    }

    doc.save(`invoice-${invoice.invoice_number}.pdf`);
    toast({
      title: "Success",
      description: "PDF downloaded successfully",
    });
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      draft: "outline",
      sent: "secondary",
      paid: "default",
      overdue: "destructive",
      cancelled: "outline",
    };

    return (
      <Badge variant={variants[status] || "outline"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Loading invoice...</p>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Invoice not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/invoices">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Invoice {invoice.invoice_number}</h1>
            <div className="text-muted-foreground mt-2">
              {getStatusBadge(invoice.status)}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleDownloadPDF}>
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
          <Button variant="outline" asChild>
            <Link href={`/dashboard/invoices/${invoice.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Invoice Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {invoice.client && (
              <div>
                <h3 className="font-semibold mb-2">Bill To:</h3>
                <p className="text-sm">{invoice.client.name}</p>
                {invoice.client.email && (
                  <p className="text-sm text-muted-foreground">{invoice.client.email}</p>
                )}
                {invoice.client.address && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {invoice.client.address}
                    {invoice.client.city && `, ${invoice.client.city}`}
                    {invoice.client.state && `, ${invoice.client.state}`}
                    {invoice.client.zip_code && ` ${invoice.client.zip_code}`}
                  </p>
                )}
              </div>
            )}

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">Issue Date</p>
                <p className="font-medium">
                  {format(new Date(invoice.issue_date), "MMM dd, yyyy")}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Due Date</p>
                <p className="font-medium">
                  {format(new Date(invoice.due_date), "MMM dd, yyyy")}
                </p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Items</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead className="text-right">Unit Price</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoice.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.description}</TableCell>
                      <TableCell className="text-right">{item.quantity}</TableCell>
                      <TableCell className="text-right">
                        ${item.unit_price.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right">
                        ${item.line_total.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {invoice.notes && (
              <div>
                <h3 className="font-semibold mb-2">Notes</h3>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {invoice.notes}
                </p>
              </div>
            )}

            {invoice.terms && (
              <div>
                <h3 className="font-semibold mb-2">Terms & Conditions</h3>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {invoice.terms}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal:</span>
                <span>${invoice.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax ({invoice.tax_rate}%):</span>
                <span>${invoice.tax_amount.toFixed(2)}</span>
              </div>
              {invoice.discount_amount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Discount:</span>
                  <span>-${invoice.discount_amount.toFixed(2)}</span>
                </div>
              )}
              <div className="border-t pt-2 flex justify-between font-bold">
                <span>Total:</span>
                <span>${invoice.total.toFixed(2)}</span>
              </div>
              {invoice.paid_amount > 0 && (
                <div className="flex justify-between text-sm pt-2 border-t">
                  <span className="text-muted-foreground">Paid:</span>
                  <span>${invoice.paid_amount.toFixed(2)}</span>
                </div>
              )}
              {invoice.total > invoice.paid_amount && (
                <div className="flex justify-between text-sm text-destructive">
                  <span>Balance Due:</span>
                  <span>${(invoice.total - invoice.paid_amount).toFixed(2)}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

