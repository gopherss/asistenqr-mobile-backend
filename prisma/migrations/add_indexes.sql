-- Índices para Asistencia
CREATE INDEX IF NOT EXISTS asistencias_empleado_fecha_idx ON asistencias (empleado_id, fecha);
CREATE INDEX IF NOT EXISTS asistencias_empresa_fecha_idx ON asistencias (empresa_id, fecha);
