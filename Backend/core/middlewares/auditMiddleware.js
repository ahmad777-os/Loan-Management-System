import AuditLog from "../../modules/audit/auditLog.model.js";

export const auditLog = (action, resource) => async (req, res, next) => {
  const originalJson = res.json.bind(res);

  res.json = async (body) => {
    if (req.user?.id) {
      try {
        await AuditLog.create({
          userID: req.user.id,
          action,
          resource,
          resourceId: req.params?.id || req.params?.loanId || null,
          details: { method: req.method, path: req.path },
          ip: req.ip || req.connection.remoteAddress,
          userAgent: req.get("User-Agent"),
          success: res.statusCode < 400,
        });
      } catch (e) {
        console.error("Audit log error:", e.message);
      }
    }
    return originalJson(body);
  };

  next();
};