import { Router, type IRouter } from "express";
import { GetDashboardSummaryResponse } from "@workspace/api-zod";
import {
  queryAll,
  queryOne,
  type RecentVisitRow,
} from "../lib/sqlite";

const router: IRouter = Router();

router.get("/dashboard", (_req, res): void => {
  const totals = queryOne<{
    totalPatients: number;
    totalVisits: number;
    visitsToday: number;
  }>(`
    SELECT
      (SELECT COUNT(*) FROM patients) AS totalPatients,
      (SELECT COUNT(*) FROM visits) AS totalVisits,
      (SELECT COUNT(*) FROM visits WHERE visit_date = ?) AS visitsToday
  `, new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Bogota",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date()));

  const recentVisits = queryAll<RecentVisitRow>(`
    SELECT
      v.id,
      v.patient_id AS patientId,
      p.name AS patientName,
      p.species AS patientSpecies,
      v.visit_date AS visitDate,
      v.reason
    FROM visits v
    JOIN patients p ON p.id = v.patient_id
    ORDER BY v.visit_date DESC, v.id DESC
    LIMIT 6
  `);

  const result = {
    totalPatients: totals?.totalPatients ?? 0,
    totalVisits: totals?.totalVisits ?? 0,
    visitsToday: totals?.visitsToday ?? 0,
    recentVisits,
  };
  res.json(GetDashboardSummaryResponse.parse(result));
});

export default router;
