import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { applicantService } from "../../app/api";
import { useFetch } from "../../hooks/useFetch";
import { Card, PageLoader, EmptyState, Pagination, Table } from "../../components/ui/UI";
import "./Applicants.css";

export default function Applicants() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const { data, loading } = useFetch(
    () => applicantService.getAll({ page, limit: 20 }),
    [page]
  );

  return (
    <div className="ap-page">

      {/* ── Page Header ── */}
      <div className="ap-header">
        <p className="ap-header__eyebrow">Registry</p>
        <h1 className="ap-header__title">Applicants</h1>
        <p className="ap-header__meta">
          <span className="ap-count">{data?.pagination?.total ?? 0}</span> registered applicants
        </p>
      </div>

      <div className="ap-divider" />

      {/* ── Table Card ── */}
      <Card>
        {loading ? (
          <PageLoader />
        ) : data?.applicants?.length ? (
          <>
            <div className="ap-table-wrap">
              <Table headers={["Applicant ID", "Name", "CNIC", "Phone", "City", "Income", "Joined"]}>
                {data.applicants.map((a) => (
                  <tr
                    key={a._id}
                    className="ap-row"
                    onClick={() => navigate(`/applicants/${a._id}`)}
                  >
                    <td className="ap-td ap-td--mono">{a.applicantID}</td>

                    <td className="ap-td ap-td--name">
                      <div className="ap-avatar-cell">
                        <div className="ap-avatar">
                          {(a.userID?.name || "?").charAt(0).toUpperCase()}
                        </div>
                        <span>{a.userID?.name || "—"}</span>
                      </div>
                    </td>

                    <td className="ap-td ap-td--mono">{a.cnic}</td>
                    <td className="ap-td">{a.phone}</td>

                    <td className="ap-td">
                      {a.city ? (
                        <span className="ap-city-tag">{a.city}</span>
                      ) : "—"}
                    </td>

                    <td className="ap-td ap-td--amount">
                      {a.monthlyIncome ? (
                        <>
                          <span className="ap-currency">Rs</span>
                          {a.monthlyIncome.toLocaleString()}
                        </>
                      ) : "—"}
                    </td>

                    <td className="ap-td ap-td--date">
                      {new Date(a.createdAt).toLocaleDateString("en-PK")}
                    </td>
                  </tr>
                ))}
              </Table>
            </div>
            <Pagination pagination={data.pagination} onPage={setPage} />
          </>
        ) : (
          <EmptyState message="No applicants found" />
        )}
      </Card>
    </div>
  );
}
