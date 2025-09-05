// apps/client/src/pages/client/ClientDashboard.tsx
import React, { useEffect, useState } from "react";
import {
  Users,
  CheckSquare,
  DollarSign,
  FileText,
  Calendar,
  TrendingUp,
  Clock,
  AlertTriangle,
  Plus,
  Send,
  BarChart3,
} from "lucide-react";
import { useAuth } from "@consulting19/shared";
import { supabase } from "@consulting19/shared/lib/supabase";

type Stats = {
  activeClients: number;
  pendingTasks: number;
  monthlyRevenue: number;
  pendingInvoices: number;
  totalDocuments: number;
  completedProjects: number;
};

type ActivityItem = {
  id?: string | number;
  action?: string | null;
  created_at?: string | null;
  details?: string | null;
  [key: string]: any;
};

function formatCurrency(n: number) {
  try {
    return n.toLocaleString(undefined, {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    });
  } catch {
    return `$${Math.round(n).toLocaleString()}`;
  }
}

const ClientDashboard: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats>({
    activeClients: 0,
    pendingTasks: 0,
    monthlyRevenue: 0,
    pendingInvoices: 0,
    totalDocuments: 0,
    completedProjects: 0,
  });
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);

  useEffect(() => {
    if (!user) return;

    let cancelled = false;
    (async () => {
      setLoading(true);

      // Basit ve sağlam yardımcılar (tip karmaşası yok)
      const safeCount = async (table: string, build?: (q: any) => any) => {
        try {
          let q: any = supabase.from(table).select("*", {
            count: "exact",
            head: true,
          });
          if (build) q = build(q);
          const { count, error } = await q;
          if (error) return 0;
          return count ?? 0;
        } catch {
          return 0;
        }
      };

      const safeSelect = async <T,>(
        table: string,
        select = "*",
        build?: (q: any) => any
      ) => {
        try {
          let q: any = supabase.from(table).select(select);
          if (build) q = build(q);
          const { data, error } = await q;
          if (error) return [] as unknown as T[];
          return (data ?? []) as T[];
        } catch {
          return [] as unknown as T[];
        }
      };

      // Bu ayın başı
      const monthStart = new Date();
      monthStart.setDate(1);
      monthStart.setHours(0, 0, 0, 0);

      // Paralel sorgular – şeman farklıysa 0/boş döner, UI çökmez
      const [activeClients, pendingTasks, totalDocuments, completedProjects, invoices, activity] =
        await Promise.all([
          safeCount("clients", (q) => q.eq("user_id", user.id).eq("status", "active")),
          safeCount("tasks", (q) => q.eq("user_id", user.id).in("status", ["todo", "in_progress"])),
          safeCount("documents", (q) => q.eq("user_id", user.id)),
          safeCount("projects", (q) => q.eq("user_id", user.id).eq("status", "completed")),
          safeSelect<{ amount_due?: number; status?: string; created_at?: string }>(
            "invoices",
            "amount_due, status, created_at",
            (q) => q.eq("user_id", user.id)
          ),
          safeSelect<ActivityItem>(
            "audit_logs",
            "*",
            (q) => q.eq("user_id", user.id).order("created_at", { ascending: false }).limit(5)
          ),
        ]);

      const monthlyRevenue =
        invoices
          .filter(
            (i) =>
              i.status === "paid" &&
              i.created_at &&
              new Date(i.created_at).getTime() >= monthStart.getTime()
          )
          .reduce((sum, i) => sum + (Number(i.amount_due) || 0), 0) || 0;

      const pendingInvoices = invoices.filter((i) => i.status === "pending").length || 0;

      if (!cancelled) {
        setStats({
          activeClients,
          pendingTasks,
          monthlyRevenue,
          pendingInvoices,
          totalDocuments,
          completedProjects,
        });
        setRecentActivity(activity);
        setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user]);

  if (!user) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold text-gray-900">Welcome</h1>
        <p className="text-gray-600 mt-2">Please sign in to view your dashboard.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-28 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ---- TEK KÖK <div> ----
  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="mb-2">
        <h1 className="text-3xl font-bold text-gray-900">Client Dashboard</h1>
        <p className="text-gray-600">Track your services, invoices and recent activity.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { label: "Active Services / Clients", value: stats.activeClients, icon: Users, bg: "bg-blue-50" },
          { label: "Monthly Spend / Revenue", value: formatCurrency(stats.monthlyRevenue), icon: DollarSign, bg: "bg-green-50" },
          { label: "Open Tasks", value: stats.pendingTasks, icon: CheckSquare, bg: "bg-orange-50" },
          { label: "Pending Invoices", value: stats.pendingInvoices, icon: FileText, bg: "bg-red-50" },
          { label: "My Documents", value: stats.totalDocuments, icon: FileText, bg: "bg-purple-50" },
          { label: "Completed Projects", value: stats.completedProjects, icon: BarChart3, bg: "bg-teal-50" },
        ].map((s, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{s.label}</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{s.value as any}</p>
              </div>
              <div className={`w-12 h-12 ${s.bg} rounded-2xl flex items-center justify-center`}>
                <s.icon className="w-6 h-6 text-gray-700" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            type="button"
            className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Plus className="w-4 h-4 text-blue-700" />
            </div>
            <span className="font-medium text-gray-900">Request Service</span>
          </button>

          <button
            type="button"
            className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <FileText className="w-4 h-4 text-green-700" />
            </div>
            <span className="font-medium text-gray-900">Upload Document</span>
          </button>

          <button
            type="button"
            className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-4 h-4 text-purple-700" />
            </div>
            <span className="font-medium text-gray-900">Schedule Meeting</span>
          </button>

          <button
            type="button"
            className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
              <Send className="w-4 h-4 text-orange-700" />
            </div>
            <span className="font-medium text-gray-900">Open a Ticket</span>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>

        {recentActivity.length === 0 ? (
          <div className="text-center py-10">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">No Recent Activity</h3>
            <p className="text-gray-600">Your recent updates will appear here.</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {recentActivity.map((a, i) => (
              <li key={a.id ?? i} className="py-3 flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-gray-700" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-900">
                      {a.action || a.details || "Activity"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {a.created_at ? new Date(a.created_at).toLocaleString() : ""}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Info */}
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 flex items-start space-x-3">
        <AlertTriangle className="w-5 h-5 text-amber-700 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-amber-900">Heads up</p>
          <p className="text-sm text-amber-900/80">
            Eğer sayılar farklı görünüyorsa, şemadaki tablo/sütun adlarını filtrelerde kendi yapına göre düzenle.
            UI düşmez; değerler güvenli şekilde 0’a düşer.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;
