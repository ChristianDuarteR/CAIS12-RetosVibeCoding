import { Router, type IRouter } from "express";
import {
  CreatePatientBody,
  CreatePatientResponse,
  DeletePatientParams,
  DeletePatientResponse,
  GetPatientParams,
  GetPatientResponse,
  ListPatientsQueryParams,
  ListPatientsResponse,
  UpdatePatientBody,
  UpdatePatientParams,
  UpdatePatientResponse,
} from "@workspace/api-zod";
import {
  execute,
  insert,
  queryAll,
  queryOne,
  type PatientRow,
} from "../lib/sqlite";

const router: IRouter = Router();

const patientColumns = `
  id,
  name,
  species,
  breed,
  age,
  sex,
  owner_name AS ownerName,
  owner_phone AS ownerPhone,
  created_at AS createdAt
`;

router.get("/patients", (req, res): void => {
  const params = ListPatientsQueryParams.safeParse(req.query);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const search = params.data.q?.trim();
  const patients = search
    ? queryAll<PatientRow>(
        `SELECT ${patientColumns}
         FROM patients
         WHERE name LIKE ? COLLATE NOCASE OR owner_name LIKE ? COLLATE NOCASE
         ORDER BY name COLLATE NOCASE, id`,
        `%${search}%`,
        `%${search}%`,
      )
    : queryAll<PatientRow>(
        `SELECT ${patientColumns}
         FROM patients
         ORDER BY name COLLATE NOCASE, id`,
      );

  res.json(ListPatientsResponse.parse(patients));
});

router.post("/patients", (req, res): void => {
  const body = CreatePatientBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }

  const id = insert(
    `INSERT INTO patients (name, species, breed, age, sex, owner_name, owner_phone)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    body.data.name.trim(),
    body.data.species.trim(),
    body.data.breed.trim(),
    body.data.age,
    body.data.sex,
    body.data.ownerName.trim(),
    body.data.ownerPhone.trim(),
  );
  const patient = queryOne<PatientRow>(
    `SELECT ${patientColumns} FROM patients WHERE id = ?`,
    id,
  );

  if (!patient) {
    res.status(500).json({ error: "No fue posible guardar el paciente." });
    return;
  }

  res.status(201).json(CreatePatientResponse.parse(patient));
});

router.get("/patients/:id", (req, res): void => {
  const params = GetPatientParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const patient = queryOne<PatientRow>(
    `SELECT ${patientColumns} FROM patients WHERE id = ?`,
    params.data.id,
  );
  if (!patient) {
    res.status(404).json({ error: "Paciente no encontrado." });
    return;
  }

  res.json(GetPatientResponse.parse(patient));
});

router.put("/patients/:id", (req, res): void => {
  const params = UpdatePatientParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const body = UpdatePatientBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }

  const changed = execute(
    `UPDATE patients
     SET name = ?, species = ?, breed = ?, age = ?, sex = ?,
         owner_name = ?, owner_phone = ?
     WHERE id = ?`,
    body.data.name.trim(),
    body.data.species.trim(),
    body.data.breed.trim(),
    body.data.age,
    body.data.sex,
    body.data.ownerName.trim(),
    body.data.ownerPhone.trim(),
    params.data.id,
  );
  if (!changed) {
    res.status(404).json({ error: "Paciente no encontrado." });
    return;
  }

  const patient = queryOne<PatientRow>(
    `SELECT ${patientColumns} FROM patients WHERE id = ?`,
    params.data.id,
  );
  if (!patient) {
    res.status(404).json({ error: "Paciente no encontrado." });
    return;
  }

  res.json(UpdatePatientResponse.parse(patient));
});

router.delete("/patients/:id", (req, res): void => {
  const params = DeletePatientParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const deleted = execute("DELETE FROM patients WHERE id = ?", params.data.id);
  if (!deleted) {
    res.status(404).json({ error: "Paciente no encontrado." });
    return;
  }

  DeletePatientResponse.parse(undefined);
  res.sendStatus(204);
});

export default router;
