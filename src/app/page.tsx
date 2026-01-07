import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileText, Zap, DollarSign, Users, Shield, Download } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Hero Section */}
      <div className="relative isolate overflow-hidden">
        <div className="pointer-events-none absolute inset-x-20 top-[-10rem] -z-10 transform-gpu blur-3xl">
          <div className="aspect-[1155/678] w-[72rem] bg-gradient-to-tr from-emerald-500/40 to-teal-500/30 opacity-50" />
        </div>
        <div className="mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-6 py-16 text-center">
          <div className="mb-8 flex items-center justify-center gap-2 rounded-full bg-emerald-500/10 px-4 py-2 text-sm text-emerald-300">
            <FileText className="h-4 w-4" />
            <span>Free Invoice Generator</span>
          </div>
          <h1 className="mt-4 text-5xl font-bold leading-tight text-white sm:text-6xl md:text-7xl">
            Create Professional
            <br />
            <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              Invoices Instantly
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-slate-300 sm:text-xl">
            InvoWise makes invoicing simple. Generate beautiful, professional invoices in minutes. Track payments, manage clients, and get paid faster - all for free.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Button asChild size="lg" className="bg-emerald-500 hover:bg-emerald-600 text-white">
              <Link href="/auth/signup">Get Started Free</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className=" border-white/20 text-emerald-500 hover:bg-white/10">
              <Link href="/auth/signin">Sign In</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative -mt-20 pb-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Everything You Need to Invoice Like a Pro
            </h2>
            <p className="mt-4 text-lg text-slate-400">
              Powerful features designed to make invoicing effortless
            </p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="group relative overflow-hidden rounded-xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-teal-500/5 p-6 transition-all hover:border-emerald-500/40 hover:shadow-lg hover:shadow-emerald-500/20">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg shadow-emerald-500/30">
                <Zap className="h-7 w-7 text-white" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-white">Lightning Fast</h3>
              <p className="text-sm leading-relaxed text-slate-300">
                Create professional invoices in seconds. No learning curve, just simple and intuitive.
              </p>
            </div>

            <div className="group relative overflow-hidden rounded-xl border border-teal-500/20 bg-gradient-to-br from-teal-500/10 to-cyan-500/5 p-6 transition-all hover:border-teal-500/40 hover:shadow-lg hover:shadow-teal-500/20">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 shadow-lg shadow-teal-500/30">
                <DollarSign className="h-7 w-7 text-white" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-white">Smart Calculations</h3>
              <p className="text-sm leading-relaxed text-slate-300">
                Automatic tax rates, discounts, and totals. Focus on your work, we handle the math.
              </p>
            </div>

            <div className="group relative overflow-hidden rounded-xl border border-blue-500/20 bg-gradient-to-br from-blue-500/10 to-indigo-500/5 p-6 transition-all hover:border-blue-500/40 hover:shadow-lg hover:shadow-blue-500/20">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/30">
                <Users className="h-7 w-7 text-white" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-white">Client Database</h3>
              <p className="text-sm leading-relaxed text-slate-300">
                Build your client list once, use it forever. Quick access to all contact details.
              </p>
            </div>

            <div className="group relative overflow-hidden rounded-xl border border-purple-500/20 bg-gradient-to-br from-purple-500/10 to-pink-500/5 p-6 transition-all hover:border-purple-500/40 hover:shadow-lg hover:shadow-purple-500/20">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg shadow-purple-500/30">
                <Download className="h-7 w-7 text-white" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-white">One-Click PDF</h3>
              <p className="text-sm leading-relaxed text-slate-300">
                Export beautiful PDFs instantly. Print-ready invoices that impress your clients.
              </p>
            </div>

            <div className="group relative overflow-hidden rounded-xl border border-orange-500/20 bg-gradient-to-br from-orange-500/10 to-amber-500/5 p-6 transition-all hover:border-orange-500/40 hover:shadow-lg hover:shadow-orange-500/20">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg shadow-orange-500/30">
                <FileText className="h-7 w-7 text-white" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-white">Track Everything</h3>
              <p className="text-sm leading-relaxed text-slate-300">
                Monitor invoice status, payments, and overdue amounts. Stay on top of your finances.
              </p>
            </div>

            <div className="group relative overflow-hidden rounded-xl border border-red-500/20 bg-gradient-to-br from-red-500/10 to-rose-500/5 p-6 transition-all hover:border-red-500/40 hover:shadow-lg hover:shadow-red-500/20">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-red-600 shadow-lg shadow-red-500/30">
                <Shield className="h-7 w-7 text-white" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-white">100% Free Forever</h3>
              <p className="text-sm leading-relaxed text-slate-300">
                No hidden fees, no credit card required. Your data stays private and secure.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="border-t border-white/10 bg-white/5 py-16">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Start Creating Invoices Today
          </h2>
          <p className="mt-4 text-lg text-slate-300">
            Join thousands of freelancers and businesses using InvoWise to streamline their invoicing process
          </p>
          <div className="mt-8">
            <Button asChild size="lg" className="bg-emerald-500 hover:bg-emerald-600 text-white">
              <Link href="/auth/signup">Create Free Account</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
