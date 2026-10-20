import { useState } from "react";
import {
  // CreditCard,
  // Search,
  // ArrowRight,
  // ShieldAlert,
  // CheckCircle2,
  RotateCcw,
  DollarSign,
  AlertCircle,
  Calendar,
  AlertTriangle,
  Loader,
} from "lucide-react";
import type { AgentSubscription } from "../types";
import SubscriptionDetails from "./SubscriptionDetails";
import { useSubscriptions } from "../hooks/useSubscriptions";

type SubscriptionStatus = "Active" | "Expired" | "Expiring soon";

const getStatus = (subscription: AgentSubscription): SubscriptionStatus => {
  const rawStatus = subscription?.status.toLowerCase();
  if (rawStatus === "expired") return "Expired";
  if (rawStatus?.includes("expiring")) return "Expiring soon";

  const endTime = new Date(subscription?.endDate).getTime();
  if (Number.isFinite(endTime) && endTime < Date.now()) return "Expired";
  if (
    Number.isFinite(endTime) &&
    endTime - Date.now() <= 7 * 24 * 60 * 60 * 1000
  ) {
    return "Expiring soon";
  }
  return "Active";
};

const formatDate = (value: string) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString();
};

const formatPrice = (value: string) => {
  const price = Number(value);
  return Number.isFinite(price)
    ? new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
        maximumFractionDigits: 2,
      }).format(price)
    : value;
};

export default function SubscriptionsView() {
  const {
    data: subscriptions = [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useSubscriptions();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedSubscription, setSelectedSubscription] =
    useState<AgentSubscription | null>(null);

  const filteredSubs = subscriptions.filter((subscription) => {
    const search = searchTerm.toLowerCase();
    const matchesSearch =
      String(subscription?.agentId).includes(search) ||
      String(subscription?.id).includes(search) ||
      subscription?.plan?.name.toLowerCase().includes(search);
    const matchesStatus =
      statusFilter === "all" || getStatus(subscription) === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const activeCount = subscriptions.filter(
    (sub) => getStatus(sub) === "Active",
  ).length;
  const expiringCount = subscriptions.filter(
    (sub) => getStatus(sub) === "Expiring soon",
  ).length;
  const expiredCount = subscriptions.filter(
    (sub) => getStatus(sub) === "Expired",
  ).length;
  const cards = [
    {
      id: "total",
      label: "Total subscriptions",
      count: subscriptions.length,
      iconType: "agents",
    },
    {
      id: "active",
      label: "Active subscriptions",
      count: activeCount,
      iconType: "agents",
    },
    {
      id: "expiring",
      label: "Expiring soon",
      count: expiringCount,
      iconType: "pending",
    },
    {
      id: "expired",
      label: "Expired subscriptions",
      count: expiredCount,
      iconType: "verified",
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-3 py-20 font-bold text-emerald-800">
        <Loader size={20} className="animate-spin" /> Loading subscriptions...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center gap-3 py-20 font-bold text-red-800">
        <AlertTriangle size={20} /> {error.message}
      </div>
    );
  }

  // Helper to map icons
  const renderIcon = (type: string) => {
    switch (type) {
      case "agents":
        return <DollarSign size={14} className="text-[#004d2c]" />;
      case "verified":
        return <AlertCircle size={14} className="text-red-600" />;
      case "pending":
        return <Calendar size={14} className="text-amber-500" />;
      case "listings":
        return <DollarSign size={14} className="text-blue-600" />;
    }
  };

  const getIconBackground = (type: string) => {
    switch (type) {
      case "agents":
        return "bg-emerald-50 border border-emerald-100";
      case "verified":
        return "bg-red-50 border border-red-100";
      case "pending":
        return "bg-amber-50 border border-amber-100";
      case "listings":
        return "bg-blue-50 border border-blue-100";
      default:
        return "bg-slate-50 border border-slate-100";
    }
  };

  return (
    <div id="subscriptions-view" className="space-y-6">
      <div className="w-full ">
        <h1 className=" text-xl font-bold pb-1">Subscription Management</h1>
        <p className="text-[10px] text-slate-400">
          Manage agent subscription and payments
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {cards.map((card) => (
          <div
            key={card.id}
            className=" p-2 border border-gray-200   bg-white rounded-md shadow"
          >
            <div className="">
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center ${getIconBackground(card.iconType)}`}
              >
                {renderIcon(card.iconType)}
              </div>
            </div>
            <h1 className="pt-2 text-sm font-bold text-green-800">
              {card.count}
            </h1>
            <p className="text-[10px] text-slate-400 pt-2 ">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Table control filters */}
      <div className="bg-white p-4 rounded-xl border border-emerald-950/5 flex flex-col md:flex-row gap-3.5 items-center justify-between">
        <div className="flex-1 w-full relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by agent ID, subscription ID, or plan..."
            className="w-full pl-4 pr-4 py-1.5 text-xs bg-slate-50/80 hover:bg-slate-50 font-medium text-slate-800 border border-slate-200 rounded-lg outline-none focus:border-[#004d2c] transition-all"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 text-slate-700 px-3 py-1.5 text-xs border border-slate-200 outline-none rounded-lg focus:border-[#004d2c] font-semibold w-full md:w-44 select-none"
          >
            <option value="all">All statuses</option>
            <option value="Active">Active</option>
            <option value="Expiring soon">Expiring soon</option>
            <option value="Expired">Expired</option>
          </select>

          <button
            onClick={() => void refetch()}
            disabled={isFetching}
            className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-600 transition-colors cursor-pointer disabled:cursor-wait"
            title="Refresh subscriptions"
            aria-label="Refresh subscriptions"
          >
            <RotateCcw size={14} className={isFetching ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* Subscriptions registry list table */}
      <div className="bg-white rounded-xl border border-emerald-950/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-5">Agent</th>
                <th className="py-3 px-5">Subscription Plan</th>
                <th className="py-3 px-5">Amount</th>
                <th className="py-3 px-5">Start Date</th>
                <th className="py-3 px-5">End Date</th>
                <th className="py-3 px-5">Status</th>
                <th className="py-3 px-5 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-xs font-semibold">
              {filteredSubs.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="py-12 text-center text-slate-400 font-medium"
                  >
                    No subscriptions match the current filters.
                  </td>
                </tr>
              ) : (
                filteredSubs.map((sub) => {
                  const status = getStatus(sub);
                  return (
                    <tr
                      key={sub?.id}
                      className="hover:bg-[#f4fcf8]/50 transition-all"
                    >
                      <td className="py-3.5 px-5 font-bold text-slate-800 text-[10px]">
                        Agent #{sub?.agentId}
                        <span className="block text-[10px] text-slate-400 font-bold uppercase">
                          SUB-{sub?.id}
                        </span>
                      </td>

                      <td className="py-3 px-5 text-slate-600 font-normal">
                        <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700  border border-indigo-100 text-[9px] rounded">
                          {sub?.plan.name}
                        </span>
                      </td>

                      <td className="py-3 px-5 text-green-800 font-normal text-[10px]">
                        {formatPrice(sub?.plan?.price)}
                      </td>

                      <td className="py-3 px-5 text-slate-500 font-mono text-[10px]">
                        {formatDate(sub?.startDate)}
                      </td>

                      <td className="py-3 px-5 text-slate-500 font-mono text-[10px]">
                        {formatDate(sub?.endDate)}
                      </td>

                      <td className="py-3 px-5">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[9px] font-normal  tracking-wide border ${
                            status === "Active"
                              ? "bg-emerald-50 text-emerald-800 border-emerald-100"
                              : status === "Expiring soon"
                                ? "bg-amber-50 text-amber-700 border-amber-100"
                                : "bg-red-50 text-red-600 border-red-100"
                          }`}
                        >
                          {status}
                        </span>
                      </td>

                      <td className="py-3 px-5 text-right">
                        <button
                          onClick={() => setSelectedSubscription(sub)}
                          className="px-3 py-1 bg-white hover:bg-[#004d2c] hover:text-white text-[#004d2c] font-semibold border border-slate-200 hover:border-[#004d2c] rounded-lg transition-colors cursor-pointer text-[10px]"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>

          <div className="p-4 bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-t border-slate-100 flex items-center justify-between">
            <span>
              Showing {filteredSubs.length} of {subscriptions.length}{" "}
              subscriptions
            </span>
          </div>
        </div>
      </div>
      {selectedSubscription && (
        <SubscriptionDetails
          subscription={selectedSubscription}
          onClose={() => setSelectedSubscription(null)}
        />
      )}
    </div>
  );
}
