import { useMemo, useState } from "react";
import { Bell, BriefcaseBusiness, CheckCheck, Clock3, MessageSquareText, ShieldCheck } from "lucide-react";
import Button from "../components/ui/Button";
import { Badge, EmptyState, IconFrame, PageShell, SectionHeader } from "../components/ui/Kit";

const notifications = [
  {
    id: 1,
    title: "Application viewed",
    body: "Your profile was viewed for Frontend Engineer at Figma.",
    time: "12 min ago",
    type: "Applications",
    icon: BriefcaseBusiness,
    tone: "green",
    unread: true,
  },
  {
    id: 2,
    title: "Recruiter message",
    body: "A hiring team requested your latest resume and portfolio links.",
    time: "2h ago",
    type: "Messages",
    icon: MessageSquareText,
    tone: "blue",
    unread: true,
  },
  {
    id: 3,
    title: "Profile strength improved",
    body: "Your skill coverage score increased after adding saved roles.",
    time: "Yesterday",
    type: "System",
    icon: ShieldCheck,
    tone: "violet",
    unread: false,
  },
];

const filters = ["All", "Applications", "Messages", "System"];

const Notifications = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [readIds, setReadIds] = useState([]);

  const visibleNotifications = useMemo(
    () =>
      notifications.filter(
        (notification) => activeFilter === "All" || notification.type === activeFilter
      ),
    [activeFilter]
  );

  const unreadCount = notifications.filter(
    (notification) => notification.unread && !readIds.includes(notification.id)
  ).length;

  return (
    <PageShell>
      <SectionHeader
        eyebrow="Notifications"
        title="Signals that"
        highlight="need attention"
        description="A compact feed for application movement, recruiter contact, and account updates."
        actions={
          <Button variant="secondary" leftIcon={CheckCheck} onClick={() => setReadIds(notifications.map((item) => item.id))}>
            Mark all read
          </Button>
        }
      />

      <div className="mb-6 flex flex-wrap items-center gap-2">
        {filters.map((filter) => (
          <button
            key={filter}
            type="button"
            onClick={() => setActiveFilter(filter)}
            className={`rounded-full border px-3 py-1.5 text-xs font-black transition ${
              activeFilter === filter
                ? "border-primary bg-[var(--primary-soft)] text-primary"
                : "border-border-soft text-text-muted hover:bg-surface-hover"
            }`}
          >
            {filter}
          </button>
        ))}
        <Badge tone="rose">{unreadCount} unread</Badge>
      </div>

      <section className="surface-card overflow-hidden">
        {visibleNotifications.length === 0 ? (
          <EmptyState
            icon={Bell}
            title="No notifications here"
            description="New hiring signals and account updates will appear in this feed."
          />
        ) : (
          <div className="divide-y divide-border-soft">
            {visibleNotifications.map((notification) => {
              const isUnread = notification.unread && !readIds.includes(notification.id);
              return (
                <button
                  key={notification.id}
                  type="button"
                  onClick={() => setReadIds((ids) => [...new Set([...ids, notification.id])])}
                  className="flex w-full gap-4 p-4 text-left transition hover:bg-surface-hover sm:p-5"
                >
                  <IconFrame icon={notification.icon} tone={notification.tone} />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-black text-text-strong">{notification.title}</h2>
                      {isUnread && <span className="size-2 rounded-full bg-rose" />}
                    </div>
                    <p className="mt-1 text-sm leading-6 text-text-muted">{notification.body}</p>
                    <p className="mt-3 flex items-center gap-1 text-xs font-bold uppercase tracking-[0.16em] text-text-faint">
                      <Clock3 className="size-3.5" />
                      {notification.time}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </section>
    </PageShell>
  );
};

export default Notifications;
