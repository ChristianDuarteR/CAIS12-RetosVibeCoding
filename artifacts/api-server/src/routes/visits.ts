import { Router, type IRouter } from "express";
import {
  CreateVisitBody,
  CreateVisitResponse,
  DeleteVisitParams,
  DeleteVisitResponse,
  GetVisitParams,
  GetVisitResponse,
  ListPatientVisitsParams,
  ListPatientVisitsResponse,
  ListVisitsQueryParams,
  ListVisitsResponse,
  UpdateVisitBody,
  UpdateVisitParams,
  UpdateVisitResponse,
} from "@workspace/api-zod";
import {
  execute,
  insert,
  queryAll,
  queryOne,
  type VisitRow,
} from "../lib/sqlite";

const router: IRouter = Router();

const visitColumns = `
  v.id,
  v.patient_id AS patientId,
  p.name AS patientName,
  p.species AS patientSpecies,
  v.visit_date AS visitDate,
  v.reason,
  v.diagnosis,
  v.treatment,
  v.observations,
  v.created_at AS createdAt
`;

function normalizeVisitDate(value: Date): string {
  return value.toISOString().slice(0, 10);
}

router.get("/patients/:id/visits", (req, res): void => {
  const params = ListPatientVisitsParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const patientExists = queryOne<{ id: number }>(
    "SELECT id FROM patients WHERE id = ?",
    params.data.id,
  );
  if (!patientExists) {
    res.status(404).json({ error: "Paciente no encontrado." });
    return;
  }

  const visits = queryAll<VisitRow>(
    `SELECT ${visitColumns}
     FROM visits v
     JOIN patients p ON p.id = v.patient_id
     WHERE v.patient_id = ?
     ORDER BY v.visit_date DESC, v.id DESC`,
    params.data.id,
  );
  res.json(ListPatientVisitsResponse.parse(visits));
});

router.get("/visits", (req, res): void => {
  const params = ListVisitsQueryParams.safeParse(req.query);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const visits =
    params.data.patientId === undefined
      ? queryAll<VisitRow>(
          `SELECT ${visitColumns}
           FROM visits v
           JOIN patients p ON p.id = v.patient_id
           ORDER BY v.visit_date DESC, v.id DESC`,
        )
      : queryAll<VisitRow>(
          `SELECT ${visitColumns}
           FROM visits v
           JOIN patients p ON p.id = v.patient_id
           WHERE v.patient_id = ?
           ORDER BY v.visit_date DESC, v.id DESC`,
          params.data.patientId,
        );

  res.json(ListVisitsResponse.parse(visits));
});

router.post("/visits", (req, res): void => {
  const body = CreateVisitBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }

  const patientExists = queryOne<{ id: number }>(
    "SELECT id FROM patients WHERE id = ?",
    body.data.patientId,
  );
  if (!patientExists) {
    res.status(404).json({ error: "Paciente no encontrado." });
    return;
  }

  const id = insert(
    `INSERT INTO visits (patient_id, visit_date, reason, diagnosis, treatment, observations)
     VALUES (?, ?, ?, ?, ?, ?)`,
    body.data.patientId,
    normalizeVisitDate(body.data.visitDate),
    body.data.reason.trim(),
    body.data.diagnosis,
    body.data.treatment,
    body.data.observations,
  );
  const visit = queryOne<VisitRow>(
    `SELECT ${visitColumns}
     FROM visits v
     JOIN patients p ON p.id = v.patient_id
     WHERE v.id = ?`,
    id,
  );

  if (!visit) {
    res.status(500).json({ error: "No fue posible guardar la visita." });
    return;
  }

  res.status(201).json(CreateVisitResponse.parse(visit));
});

router.get("/visits/:id", (req, res): void => {
  const params = GetVisitParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const visit = queryOne<VisitRow>(
    `SELECT ${visitColumns}
     FROM visits v
     JOIN patients p ON p.id = v.patient_id
     WHERE v.id = ?`,
    params.data.id,
  );
  if (!visit) {
    res.status(404).json({ error: "Visita no encontrada." });
    return;
  }

  res.json(GetVisitResponse.parse(visit));
});

router.put("/visits/:id", (req, res): void => {
  const params = UpdateVisitParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const body = UpdateVisitBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }

  const patientExists = queryOne<{ id: number }>(
    "SELECT id FROM patients WHERE id = ?",
    body.data.patientId,
  );
  if (!patientExists) {
    res.status(404).json({ error: "Paciente no encontrado." });
    return;
  }

  const changed = execute(
    `UPDATE visits
     SET patient_id = ?, visit_date = ?, reason = ?, diagnosis = ?,
         treatment = ?, observations = ?
     WHERE id = ?`,
    body.data.patientId,
    normalizeVisitDate(body.data.visitDate),
    body.data.reason.trim(),
    body.data.diagnosis,
    body.data.treatment,
    body.data.observations,
    params.data.id,
  );
  if (!changed) {
    res.status(404).json({ error: "Visita no encontrada." });
    return;
  }

  const visit = queryOne<VisitRow>(
    `SELECT ${visitColumns}
     FROM visits v
     JOIN patients p ON p.id = v.patient_id
     WHERE v.id = ?`,
    params.data.id,
  );
  if (!visit) {
    res.status(404).json({ error: "Visita no encontrada." });
    return;
  }

  res.json(UpdateVisitResponse.parse(visit));
});

router.delete("/visits/:id", (req, res): void => {
  const params = DeleteVisitParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const deleted = execute("DELETE FROM visits WHERE id = ?", params.data.id);
  if (!deleted) {
    res.status(404).json({ error: "Visita no encontrada." });
    return;
  }

  DeleteVisitResponse.parse(undefined);
  res.sendStatus(204);
});

export default router;
