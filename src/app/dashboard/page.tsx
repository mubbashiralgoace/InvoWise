"use client";

import { useEffect, useState } from "react";
import { UserSync } from "@/components/dashboard/UserSync";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { FileText, Users, ArrowRight, Plus, DollarSign, TrendingUp } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

const quickActions = [
  {
    title: "Create Invoice",
    description: "Generate a new invoice",
    href: "/dashboard/invoices/new",
    icon: Plus,
  },
  {
    title: "View Invoices",
    description: "See all your invoices",
    href: "/dashboard/invoices",
    icon: FileText,
  },
  {
    title: "Manage Clients",
    description: "Add or edit clients",
    href: "/dashboard/clients",
    icon: Users,
  },
];

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalInvoices: 0,
    totalRevenue: 0,
    paidInvoices: 0,
    pendingAmount: 0,
  });
  interface RecentInvoice {
    id: string;
    invoice_number: string;
    total: number;
    status: string;
    client: { name: string } | null;
  }

  const [recentInvoices, setRecentInvoices] = useState<RecentInvoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchDashboardData = async () => {
    try {
      const supabase = createSupabaseBrowserClient();
      const { data: invoices, error } = await supabase
        .from("invoices")
        .select("id, invoice_number, status, total, paid_amount, issue_date, clients:client_id(name)")
        .order("created_at", { ascending: false })
        .limit(5);

      if (error) throw error;

      const totalInvoices = invoices?.length || 0;
      const totalRevenue = invoices?.reduce((sum, inv) => sum + (inv.paid_amount || 0), 0) || 0;
      const paidInvoices = invoices?.filter((inv) => inv.status === "paid").length || 0;
      const pendingAmount = invoices?.reduce((sum, inv) => sum + (inv.total - (inv.paid_amount || 0)), 0) || 0;

      setStats({
        totalInvoices,
        totalRevenue,
        paidInvoices,
        pendingAmount,
      });

      // Transform invoices to match RecentInvoice interface
      const formattedInvoices: RecentInvoice[] = (invoices || []).map((inv: {
        id: string;
        invoice_number: string;
        status: string;
        total: number;
        issue_date: string;
        clients?: { name: string }[] | { name: string } | null;
      }) => ({
        id: inv.id,
        invoice_number: inv.invoice_number,
        total: inv.total,
        status: inv.status,
        client: Array.isArray(inv.clients) 
          ? (inv.clients[0] || null)
          : (inv.clients || null),
      }));

      setRecentInvoices(formattedInvoices);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <UserSync />
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard Overview</h1>
          <p className="text-muted-foreground mt-2">
            Welcome back! Here&apos;s your invoice summary
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Invoices</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalInvoices}</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Paid invoices</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Paid Invoices</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.paidInvoices}</div>
              <p className="text-xs text-muted-foreground">Completed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Amount</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.pendingAmount.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Outstanding</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Get started with invoicing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={action.href}
                    href={action.href}
                    className="flex items-center justify-between rounded-lg border p-4 transition hover:bg-slate-50"
                  >
                    <div className="flex items-center gap-4">
                      <div className="rounded-lg bg-slate-100 p-2">
                        <Icon className="h-5 w-5 text-slate-700" />
                      </div>
                      <div>
                        <p className="font-medium">{action.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {action.description}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground" />
                  </Link>
                );
              })}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Invoices</CardTitle>
              <CardDescription>
                Your latest invoices
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8 text-muted-foreground">
                  Loading...
                </div>
              ) : recentInvoices.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No invoices yet</p>
                  <p className="text-sm mt-2">
                    Create your first invoice to get started
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentInvoices.map((invoice) => (
                    <Link
                      key={invoice.id}
                      href={`/dashboard/invoices/${invoice.id}`}
                      className="flex items-center justify-between rounded-lg border p-3 transition hover:bg-slate-50"
                    >
                      <div>
                        <p className="font-medium">{invoice.invoice_number}</p>
                        <p className="text-sm text-muted-foreground">
                          {invoice.client?.name || "No client"}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${invoice.total.toFixed(2)}</p>
                        <p className="text-xs text-muted-foreground capitalize">{invoice.status}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
