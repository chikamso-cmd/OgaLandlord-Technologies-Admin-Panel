import { CalendarDays, CircleDollarSign, Hash, UserRound } from "lucide-react";
import type { AgentSubscription } from "../types";
import ModalShell from "./modals/ModalShell";

interface SubscriptionDetailsProps {
  subscription: AgentSubscription;
  onClose: () => void;
}

const formatDate = (value: string) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      });
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

export default function SubscriptionDetails({
  subscription,
  onClose,
}: SubscriptionDetailsProps) {
  const details = [
    { label: "Subscription ID", value: subscription.id, icon: Hash },
    { label: "Agent ID", value: subscription.agentId, icon: UserRound },
    { label: "Plan", value: subscription.plan.name, icon: CircleDollarSign },
    {
      label: "Price",
      value: formatPrice(subscription.plan.price),
      icon: CircleDollarSign,
    },
    {
      label: "Plan duration",
      value: `${subscription.plan.durationDays} days`,
      icon: CalendarDays,
    },
    { label: "Status", value: subscription.status, icon: CalendarDays },
    {
      label: "Starts",
      value: formatDate(subscription.startDate),
      icon: CalendarDays,
    },
    {
      label: "Ends",
      value: formatDate(subscription.endDate),
      icon: CalendarDays,
    },
    {
      label: "Created",
      value: formatDate(subscription.createdAt),
      icon: CalendarDays,
    },
  ];

  return (
    <ModalShell
      title="Subscription details"
      description={`Subscription #${subscription.id} for agent #${subscription.agentId}`}
      onClose={onClose}
    >
      <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {details.map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="rounded-lg border border-slate-200 bg-slate-50 p-3"
          >
            <dt className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wide text-slate-400">
              <Icon size={13} />
              {label}
            </dt>
            <dd className="mt-2 wrap-break-word text-sm font-semibold capitalize text-slate-800">
              {value}
            </dd>
          </div>
        ))}
      </dl>
    </ModalShell>
  );
}
