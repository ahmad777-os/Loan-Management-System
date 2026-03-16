import { useState } from "react";
import { adminService } from "../../app/api";
import { useFetch } from "../../hooks/useFetch";
import { Card, PageLoader, EmptyState, Pagination, Table, Badge } from "../../components/ui/UI";
import "./AuditLogs.css";

const ACTIONS = ["", "LOGIN_SUCCESS", "LOGIN_FAILED"];

export default function AuditLogs() {
  const [page,    setPage]    = useState(1);
  const [action,  setAction]  = useState("");
  const [success, setSuccess] = useState("");

  const { data, loading } = useFetch(
    () => adminService.getAuditLogs({
      page, limit: 50,
      action:  action  || undefined,
      success: success || undefined,
    }),
    [page, action, success]
  );

  return (
    <div className="audit-page">

      {/* ── Header ── */}
      <div className="audit-header">
        <div className="audit-header__text">
          <p className="audit-header__eyebrow">Security</p>
          <h1 className="audit-header__title">Audit Logs</h1>
          <p className="audit-header__meta">
            <span className="audit-count">{data?.pagination?.total ?? 0}</span> total events
          </p>
        </div>

        {/* ── Filters ── */}
        <div className="audit-filters">
          <div className="audit-filter-group">
            <label className="audit-filter-label">Action</label>
            <div className="audit-select-wrap">
              <select
                className="audit-select"
                value={action}
                onChange={(e) => { setAction(e.target.value); setPage(1); }}
              >
                {ACTIONS.map((a) => (
                  <option key={a} value={a}>{a || "All Actions"}</option>
                ))}
              </select>
              <span className="audit-select-arrow">&#8964;</span>
            </div>
          </div>

          <div className="audit-filter-group">
            <label className="audit-filter-label">Result</label>
            <div className="audit-select-wrap">
              <select
                className="audit-select"
                value={success}
                onChange={(e) => { setSuccess(e.target.value); setPage(1); }}
              >
                <option value="">All Results</option>
                <option value="true">Success</option>
                <option value="false">Failed</option>
              </select>
              <span className="audit-select-arrow">&#8964;</span>
            </div>
          </div>
        </div>
      </div>

      <div className="audit-divider" />

      {/* ── Table ── */}
      <Card>
        {loading ? (
          <PageLoader />
        ) : data?.logs?.length ? (
          <>
            <div className="audit-table-wrap">
              <Table headers={["User", "Action", "Resource", "Result", "IP", "Time"]}>
                {data.logs.map((log) => (
                  <tr key={log._id} className="audit-row">

                    <td className="audit-td audit-td--user">
                      <div className="audit-avatar-cell">
                        <div className="audit-avatar">
                          {(log.userID?.name || "?").charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="audit-user-name">{log.userID?.name || "Unknown"}</p>
                          <p className="audit-user-email">{log.userID?.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="audit-td">
                      <span className={`audit-action-tag audit-action-tag--${log.action?.toLowerCase().replace(/_/g, "-")}`}>
                        {log.action}
                      </span>
                    </td>

                    <td className="audit-td audit-td--resource">{log.resource}</td>

                    <td className="audit-td">
                      <Badge status={log.success ? "approved" : "rejected"} />
                    </td>

                    <td className="audit-td audit-td--ip">{log.ip}</td>

                    <td className="audit-td audit-td--time">
                      {new Date(log.timestamp).toLocaleString("en-PK")}
                    </td>
                  </tr>
                ))}
              </Table>
            </div>
            <Pagination pagination={data.pagination} onPage={setPage} />
          </>
        ) : (
          <EmptyState message="No audit logs found" />
        )}
      </Card>
    </div>
  );
}
