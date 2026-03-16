import { useState } from "react";
import { notificationService } from "../../app/api";
import { useFetch } from "../../hooks/useFetch";
import { PageLoader, EmptyState, Pagination } from "../../components/ui/UI";
import { Bell, Trash2, CheckCheck } from "lucide-react";
import "./Notifications.css";

export default function Notifications() {
  const [page, setPage] = useState(1);
  const { data, loading, refetch } = useFetch(
    () => notificationService.getAll({ page, limit: 20 }),
    [page]
  );

  const handleMarkRead = async (id) => {
    await notificationService.markRead(id);
    refetch();
  };

  const handleMarkAll = async () => {
    await notificationService.markAllRead();
    refetch();
  };

  const handleDelete = async (id) => {
    await notificationService.delete(id);
    refetch();
  };

  return (
    <div className="notif-root">
      <div className="notif-header">
        <div className="notif-title-wrap">
          <h1 className="notif-title">Notifications</h1>
          {data?.unreadCount > 0 && (
            <span className="notif-unread-chip">{data.unreadCount}</span>
          )}
        </div>
        {data?.unreadCount > 0 && (
          <button className="notif-mark-all-btn" onClick={handleMarkAll}>
            <CheckCheck size={13} />
            Mark all read
          </button>
        )}
      </div>

      <div className="notif-card">
        {loading ? (
          <PageLoader />
        ) : data?.notifications?.length ? (
          <>
            <div className="notif-list">
              {data.notifications.map((n) => (
                <div
                  key={n._id}
                  className={`notif-item${!n.read ? " notif-item--unread" : ""}`}
                >
                  <div className="notif-icon-wrap">
                    <Bell size={15} />
                  </div>
                  <div className="notif-body">
                    <div className="notif-item-title">{n.title}</div>
                    <div className="notif-item-message">{n.message}</div>
                    <div className="notif-item-time">
                      {new Date(n.createdAt).toLocaleString("en-PK")}
                    </div>
                  </div>
                  <div className="notif-item-actions">
                    {!n.read && (
                      <button
                        className="notif-action-btn"
                        onClick={() => handleMarkRead(n._id)}
                        title="Mark as read"
                      >
                        <CheckCheck size={14} />
                      </button>
                    )}
                    <button
                      className="notif-action-btn notif-action-btn--delete"
                      onClick={() => handleDelete(n._id)}
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <Pagination pagination={data.pagination} onPage={setPage} />
          </>
        ) : (
          <EmptyState message="No notifications yet" />
        )}
      </div>
    </div>
  );
}
