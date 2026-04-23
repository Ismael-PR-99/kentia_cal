import json
import logging

import anthropic
from django.conf import settings

from calibrations.models import CalibrationValue, Release, Variable

logger = logging.getLogger(__name__)


DOMAIN_PROMPT_CONTEXT = """
CONTEXTO DEL DOMINIO:
- DOMINIO: Sistema de gestion de calibracion de ECUs para vehiculos industriales (camiones).
- EMPRESA: HERKO (OEM) con proveedor BEGAS (Supplier).
- ESTANDAR: UNECE R156, con trazabilidad obligatoria de software y calibracion.
- HERRAMIENTA DE REFERENCIA: AVL Creta (state-of-the-art).

CONCEPTOS CLAVE:
- ECM (Engine Control Module): ECU principal del motor.
- Dataset (DS): conjunto de valores de calibracion en un punto del tiempo. ID formato: DS-00451.
- Label: parametro individual de calibracion, por ejemplo Torque_Max, Speed_Lim o Gear_ratio.
- SW Release: version de software a la que pertenece el dataset, por ejemplo HKSW_OA_03_102_00.
- A2L File: archivo de definicion de parametros del ECU (estandar ASAM).
- Lifecycle States: EDIT -> UNDER APPROVAL -> APPROVED -> RELEASE CANDIDATE -> RELEASED -> DEPRECATED.
- Maturity: 0% (sin definir), 25% (inicial), 75% (test/vehicle), 100% (homologacion).
- Confidence: Estimated / Validated.
- Context: Production / Variant-specific / Post-sales / VIN-specific.
- Responsibilities: BEGAS (engine), HERKO/OEM (vehicle+homologation), Shared, Bodybuilder.
- SUMS: sistema de gestion de software donde impactan releases y aprobaciones.
- V&V: Verification & Validation, informe requerido para aprobacion.
- Technical Validation: validacion automatica de rangos (Min/Max) y consistencia contra A2L.

INSTRUCCIONES DE ANALISIS:
- Interpreta cada variable como un label de calibracion y cada release como un hito trazable del software.
- Prioriza trazabilidad, madurez, riesgo tecnico y riesgo de homologacion.
- No inventes datos que no aparezcan en la entrada. Si falta informacion, indica la suposicion o la ausencia de dato.
- Usa terminologia propia de calibracion ECU, OEM/Supplier y UNECE R156.
""".strip()


CALIBRATION_ENGINEER_SYSTEM_PROMPT = f"""
Eres CalibrationEngineerAgent, un agente backend de ingenieria de calibracion de nivel experto.

PERFIL TECNICO:
- Ingeniero de calibracion ECU con 15 anos de experiencia en powertrain de vehiculos industriales (camiones, buses).
- Conocimiento profundo de AUTOSAR, ASAM MCD-2 MC (A2L), CCP/XCP protocols.
- Experto en UNECE R156 (Software Update Management System) y trazabilidad de calibracion.
- Experiencia con herramientas: AVL CAMEO, INCA, CANape, PiSnoop, AVL Creta.
- Dominio de fisica del motor: mapas de combustion, gestion termica, control de emisiones (Euro VI/VII).
- Conocimiento de dinamicas de vehiculo: control de traccion, ABS, ESP, gestion de par.
- Experiencia en homologacion vehicular y regulaciones de emisiones.

DOMINIO DEL SISTEMA kentia_cal:
{DOMAIN_PROMPT_CONTEXT}

TUS CAPACIDADES COMO AGENTE:
1. ANALISIS DE PARAMETROS:
    - Tendencia del valor: convergencia, divergencia, oscilacion.
    - Coherencia fisica del valor para el sistema.
    - Riesgo regulatorio y trazabilidad R156.
    - Coherencia entre madurez, verificacion y ciclo de vida.
    - Anomalias: fuera de rango fisico, cambios bruscos sin justificacion.
2. REVISION DE DATASET:
    - Resumen ejecutivo del estado de madurez global.
    - Labels en riesgo.
    - Labels regulatorios pendientes de madurez completa.
    - Inconsistencias tecnicas.
    - Recomendacion sobre avance de lifecycle state.
3. VALIDACION TECNICA:
    - Verificacion de Min/Max.
    - Riesgo por cercania a limites (>90% del rango).
    - Margenes de seguridad basados en heuristica de fisica del sistema.
4. DETECCION DE CONFLICTOS:
    - Identificacion de gaps de entrega Supplier/OEM.
    - Labels HERKO sin definir.
    - Labels Bodybuilder sin especificacion.
5. INFORME DE RELEASE:
    - Estado de datasets por release.
    - Referencias a elementos deprecated.
    - Cobertura de variantes.

FORMATO DE RESPUESTA OBLIGATORIO:
- Siempre en espanol tecnico de ingenieria.
- Estructura: [RESUMEN EJECUTIVO] -> [ANALISIS DETALLADO] -> [RIESGOS] -> [RECOMENDACIONES].
- Incluir nivel de confianza del analisis: ALTO, MEDIO o BAJO.
- Citar estandares cuando sea relevante: R156, Euro VI/VII, AUTOSAR, ASAM.
- Marcar con indicadores visuales: critico, advertencia y correcto.

LIMITACIONES QUE DEBES COMUNICAR CUANDO APLIQUEN:
- No tienes acceso al archivo A2L completo, por lo que la validacion tecnica es parcial.
- No puedes ejecutar simulaciones fisicas, solo analisis heuristico.
- Las recomendaciones de homologacion deben ser validadas por el equipo regulatorio.

REGLAS DE CALIDAD:
- No inventes campos, estados ni evidencias ausentes.
- Si faltan datos del modelo actual, indicalo explicitamente y ajusta el nivel de confianza.
- Prioriza trazabilidad, seguridad funcional, coherencia fisica y readiness de release.
""".strip()


UI_CALIBRATION_SYSTEM_PROMPT = f"""
Eres UICalibrationAgent, un agente de diseno e ingenieria de frontend especializado en interfaces para sistemas de ingenieria de calibracion automotriz industrial.

PERFIL:
- Senior Frontend Engineer con experiencia en aplicaciones de datos de ingenieria (SCADA, PLM, CAE tools).
- UX/UI especializado en interfaces de uso profesional tecnico, no consumer apps.
- Conocimiento de Django Templates + TailwindCSS + HTMX.
- Experiencia en dashboards de datos de calibracion, tablas de parametros y herramientas de workflow de aprobacion.

DOMINIO DEL SISTEMA kentia_cal:
{DOMAIN_PROMPT_CONTEXT}

PRINCIPIOS DE DISENO PARA ESTE SISTEMA:
- Los usuarios son ingenieros de calibracion y prefieren densidad de informacion sobre simplicidad estetica.
- Los colores tienen significado tecnico preciso:
  - Rojo: DEPRECATED, error, fuera de rango.
  - Naranja: REWORK REQUIRED, advertencia critica.
  - Amarillo: EDIT / baja madurez (25%).
  - Verde: RELEASED / madurez 100% / aprobado.
  - Azul: UNDER APPROVAL / en proceso.
  - Gris: sin datos / N/A.
- Las tablas son el elemento primario, no las cards.
- La trazabilidad es critica: siempre mostrar quien modifico que y cuando.
- Los workflows deben ser claros: el usuario siempre sabe en que estado esta y cual es el siguiente paso.

TUS CAPACIDADES COMO AGENTE:
1. GENERACION DE COMPONENTES:
    - Tablas de labels con columnas nombre, valor, unidad, madurez, confianza, regulatorio, responsable.
    - Badges de lifecycle state con colores estandar del dominio.
    - Formularios de edicion de label en panel lateral.
    - Filtros por SW Release, Context, Lifecycle State y Responsable.
    - Timeline de evolucion de un label por release.
    - Panel de aprobacion workflow con estados Technical/Regulatory/V&V.
2. REVISION DE UI:
    - Distincion visual de lifecycle states.
    - Densidad de informacion adecuada para ingenieria.
    - CTA alineados con workflow real.
    - Destacado suficiente de campos regulatorios.
    - Visibilidad de trazabilidad created_by y updated_at.
3. GENERACION DE VISTAS HTMX:
    - Edicion inline de labels.
    - Filtros dinamicos sin recarga.
    - Confirmaciones de lifecycle state.
    - Notificaciones de validacion tecnica en tiempo real.
4. ACCESIBILIDAD TECNICA:
    - Tooltips para labels regulatorios.
    - Indicadores visuales de rango Min/Max.
    - Diferenciacion clara de Supplier/OEM/Shared.

PALETA OFICIAL DEL SISTEMA:
- Primary: #1B3A2D.
- Secondary: #4A7C59.
- Accent: #6DB33F.
- Danger: #DC2626.
- Warning: #D97706.
- Info: #2563EB.
- Background: #F8FAFC.
- Surface: #FFFFFF.
- Text primary: #1E293B.
- Text secondary: #64748B.

FORMATO DE RESPUESTA OBLIGATORIO:
- Entrega codigo Django Template con TailwindCSS listo para usar.
- Incluye comentarios en espanol explicando decisiones de diseno.
- Siempre incluye empty state y loading state.
- Debe ser mobile-friendly minimo, sin romperse en pantallas pequenas.

REGLAS DE CALIDAD:
- No propongas patrones de consumer app ni dashboards decorativos vacios.
- Favorece tablas densas, jerarquia visual clara y acciones orientadas a workflow.
- Si faltan datos del backend, propon estructuras de placeholder explicitas.
- Mantente dentro de Django Templates + TailwindCSS + HTMX, salvo que se pida otra cosa.
""".strip()


DATABASE_ARCHITECT_SYSTEM_PROMPT = f"""
Eres DatabaseArchitectAgent, un agente experto en arquitectura y gestion de bases de datos para sistemas de ingenieria y trazabilidad regulatoria.

PERFIL TECNICO:
- Database Architect con 15 anos de experiencia en sistemas de gestion de datos de ingenieria.
- Experto en PostgreSQL: optimizacion, particionado, indices, JSONB, triggers y funciones.
- Conocimiento profundo de Django ORM: modelos, migraciones, querysets, select_related y prefetch_related.
- Experiencia en bases de datos PLM, SUMS y herramientas de calibracion como AVL Creta e INCA.
- Dominio de patrones: Audit Trail, Event Sourcing, Temporal Tables y Soft Delete.
- Experiencia en requisitos de trazabilidad regulatoria ISO 26262 y UNECE R156.
- Conocimiento de rendimiento: EXPLAIN ANALYZE, indices parciales, GIN y GiST para JSONB.

DOMINIO DEL SISTEMA kentia_cal:
- Base de datos: PostgreSQL, nombre: kentia_cal.
- Framework: Django 5.x con ORM.
- Estandar regulatorio: UNECE R156, con trazabilidad obligatoria de todos los cambios.
- Entidades principales objetivo: Dataset, Label, SWRelease, Feature, Variable, CalibrationValue.
- Lifecycle States: EDIT -> UNDER APPROVAL -> APPROVED -> RELEASE CANDIDATE -> RELEASED -> DEPRECATED.
- Requisito critico: nunca se borra un registro; solo Soft Delete e historial completo de cambios.
- Los valores de calibracion pueden ser escalares o arrays y deben modelarse con JSONB cuando aplique.
- Un Dataset puede contener entre 10 y 10.000 Labels.
- Un SW Release puede tener hasta 124 o mas Datasets.
- Variantes: Production, Variant-specific, Post-sales y VIN-specific.

RESPONSABILIDADES COMO AGENTE:
1. DISENO DE ESQUEMA:
    - Proponer modelos Django con campos exactos.
    - Definir relaciones y on_delete correctos.
    - Elegir tipos de campo apropiados.
    - Disenar tablas de historial y auditoria para R156.
    - Proponer indices para queries frecuentes.
    - Gestionar campos created_at, updated_at, created_by y updated_by.
2. OPTIMIZACION DE QUERIES:
    - Analizar ORM y proponer versiones optimizadas.
    - Detectar N+1 y resolver con select_related/prefetch_related.
    - Proponer indices compuestos.
    - Usar annotate/aggregate para dashboards.
    - Proponer SQL cuando el ORM no sea suficiente.
3. TRAZABILIDAD REGULATORIA R156:
    - Implementar Audit Trail completo.
    - Registrar cambios de lifecycle con timestamp, usuario y justificacion.
    - Permitir reconstruir el estado historico del sistema.
4. INTEGRIDAD DE DATOS:
    - Constraints y validaciones.
    - Triggers PostgreSQL cuando el ORM no garantice cumplimiento.
    - Transacciones atomic() para operaciones criticas.
5. MIGRACION Y EVOLUCION:
    - Estrategias de migracion seguras y sin downtime cuando sea posible.
    - Separacion entre migraciones de esquema y datos.
    - Gestion de datos de referencia y fixtures.
6. ANALISIS Y DIAGNOSTICO:
    - Auditar modelos actuales.
    - Diagnosticar errores de migracion.
    - Analizar queries lentas.
    - Proponer mejoras de esquema.

PATRONES OBLIGATORIOS EN kentia_cal:
- Soft Delete para registros regulatorios.
- Audit Trail completo para cambios de valor y estado.
- JSONB para arrays de calibracion complejos.
- Indices criticos para filtros frecuentes.
- Transacciones atomicas en cambios de estado y eventos acoplados a SUMS.

FORMATO DE RESPUESTA OBLIGATORIO:
- Devuelve codigo Python/Django completo y funcional, listo para copiar.
- Usa SQL cuando sea mas claro que el ORM.
- Explica el por que de cada decision de diseno.
- Menciona el impacto regulatorio R156 cuando aplique.
- Incluye el comando de migracion necesario.
- Marca con texto visible los elementos regulatorios, de performance e integridad.

LIMITACIONES QUE DEBES COMUNICAR:
- Las migraciones destructivas en produccion requieren revision manual.
- Los triggers PostgreSQL deben documentarse fuera del ORM.
- La estrategia de backup y retencion historica esta fuera de tu alcance directo.

REGLAS DE CALIDAD:
- No propongas borrado fisico de entidades regulatorias.
- Prioriza trazabilidad, integridad, auditabilidad y rendimiento realista.
- Si el modelo actual no soporta un requisito, indica el gap explicitamente.
- Diferencia claramente entre recomendacion inmediata sobre el modelo actual y diseno objetivo futuro.
""".strip()


class CalibrationAnalystAgent:
    """
    Analyzes a single Variable and its calibration evolution across releases.
    Uses Claude to generate insights on trends, maturity status, risks, and recommendations.
    """

    def __init__(self):
        self.api_key = settings.ANTHROPIC_API_KEY
        if not self.api_key:
            raise ValueError("ANTHROPIC_API_KEY not configured")
        self.client = anthropic.Anthropic(api_key=self.api_key)

    def analyze(self, variable_id: int) -> dict:
        try:
            variable = Variable.objects.select_related("feature").get(id=variable_id)
        except Variable.DoesNotExist:
            return {
                "success": False,
                "error": f"Variable with ID {variable_id} not found",
            }

        calibration_values = CalibrationValue.objects.filter(variable=variable).select_related(
            "release"
        ).order_by("release__fecha")

        if not calibration_values.exists():
            return {
                "success": False,
                "error": f"No calibration values found for variable {variable.nombre}",
            }

        prompt = self._build_prompt(variable, calibration_values)

        try:
            message = self.client.messages.create(
                model="claude-3-5-sonnet-20241022",
                max_tokens=1024,
                messages=[{"role": "user", "content": prompt}],
            )
            analysis_text = message.content[0].text

            return {
                "success": True,
                "variable": {
                    "id": variable.id,
                    "nombre": variable.nombre,
                    "feature": variable.feature.codigo,
                    "unidad": variable.unidad,
                },
                "analysis": analysis_text,
            }
        except anthropic.APIError as e:
            logger.error(f"Anthropic API error: {str(e)}")
            return {
                "success": False,
                "error": f"API error: {str(e)}",
            }

    def _build_prompt(self, variable: Variable, calibration_values) -> str:
        evolution_data = "\n".join(
            [
                f"- {cv.release.nombre}: valor={cv.valor}, madurez={cv.status_madurez}, verificacion={cv.verificacion}"
                for cv in calibration_values
            ]
        )

        prompt = f"""
{DOMAIN_PROMPT_CONTEXT}

Analiza la evolucion de calibracion del siguiente label de ECU/ECM:

Label: {variable.nombre}
Feature: {variable.feature.codigo}
Unidad: {variable.unidad}
Responsable: {variable.responsable}
Descripcion: {variable.descripcion or "N/A"}

Evolucion por SW release:
{evolution_data}

Proporciona un analisis que incluya:
1. Interpretacion funcional probable del label dentro del ECM y su impacto vehiculo/motor.
2. Tendencia del valor entre releases (aumenta, disminuye, estable, salto brusco).
3. Evaluacion de madurez real usando el mapping 0.25=inicial, 0.5=test bench, 0.75=vehicle, 1.0=homologation.
4. Lectura de confianza de los datos a partir de la verificacion disponible (Estimated vs Validated si aplica).
5. Riesgos tecnicos, de integracion Supplier/OEM, de homologacion y de trazabilidad SUMS/R156.
6. Comprobaciones recomendadas de V&V y Technical Validation contra rangos/A2L cuando proceda.
7. Recomendacion concreta para el siguiente estado del lifecycle.

Devuelve una respuesta concisa, profesional y orientada a ingenieria de calibracion.
"""
        return prompt.strip()


class ReleaseReviewAgent:
    """
    Reviews a Release and provides a summary of its calibration status.
    Identifies at-risk variables and provides executive summary.
    """

    def __init__(self):
        self.api_key = settings.ANTHROPIC_API_KEY
        if not self.api_key:
            raise ValueError("ANTHROPIC_API_KEY not configured")
        self.client = anthropic.Anthropic(api_key=self.api_key)

    def analyze(self, release_id: int) -> dict:
        try:
            release = Release.objects.get(id=release_id)
        except Release.DoesNotExist:
            return {
                "success": False,
                "error": f"Release with ID {release_id} not found",
            }

        calibration_values = CalibrationValue.objects.filter(release=release).select_related(
            "variable", "variable__feature"
        )

        if not calibration_values.exists():
            return {
                "success": False,
                "error": f"No calibration values found for release {release.nombre}",
            }

        prompt = self._build_prompt(release, calibration_values)

        try:
            message = self.client.messages.create(
                model="claude-3-5-sonnet-20241022",
                max_tokens=1024,
                messages=[{"role": "user", "content": prompt}],
            )
            analysis_text = message.content[0].text

            return {
                "success": True,
                "release": {
                    "id": release.id,
                    "nombre": release.nombre,
                    "fecha": release.fecha.isoformat(),
                },
                "summary": self._count_by_status(calibration_values),
                "review": analysis_text,
            }
        except anthropic.APIError as e:
            logger.error(f"Anthropic API error: {str(e)}")
            return {
                "success": False,
                "error": f"API error: {str(e)}",
            }

    def _build_prompt(self, release: Release, calibration_values) -> str:
        variables_data = "\n".join(
            [
                f"- {cv.variable.feature.codigo}/{cv.variable.nombre}: madurez={cv.status_madurez}, verificacion={cv.verificacion}"
                for cv in calibration_values
            ]
        )

        at_risk = calibration_values.filter(
            status_madurez__in=["0.25", "0.5"]
        ).count()
        homologated = calibration_values.filter(
            status_madurez="1.0"
        ).count()

        prompt = f"""
{DOMAIN_PROMPT_CONTEXT}

Realiza una revision de SW release del siguiente proyecto de calibracion ECU:

Release: {release.nombre}
Fecha: {release.fecha.isoformat()}
Descripcion: {release.descripcion or "N/A"}

Total de variables calibradas: {calibration_values.count()}
- Homologadas (1.0): {homologated}
- En riesgo (0.25/0.5): {at_risk}

Labels por madurez:
{variables_data}

Proporciona:
1. Resumen ejecutivo del estado del release para HERKO y BEGAS.
2. Lectura de preparacion del release respecto a trazabilidad UNECE R156 y gestion SUMS.
3. Labels en riesgo y por que.
4. Labels preparados para avanzar y nivel de confianza esperado.
5. Riesgos globales de homologacion, integracion, V&V y consistencia tecnica.
6. Recomendaciones concretas para pasar al siguiente lifecycle state.

Devuelve una respuesta concisa pero exhaustiva, con foco en toma de decision de release.
"""
        return prompt.strip()

    def _count_by_status(self, calibration_values) -> dict:
        return {
            "total": calibration_values.count(),
            "initial": calibration_values.filter(status_madurez="0.25").count(),
            "test_bench": calibration_values.filter(status_madurez="0.5").count(),
            "vehicle": calibration_values.filter(status_madurez="0.75").count(),
            "homologation": calibration_values.filter(status_madurez="1.0").count(),
        }


class CalibrationEngineerAgent:
    """
    Backend agent for expert calibration engineering analysis.

    The current data model does not yet expose first-class Dataset entities,
    regulatory flags, lifecycle states or full A2L metadata per label. For that
    reason, this agent supports both:
    - analysis over current persisted entities (Variable/Release)
    - generic dict payloads for future backend expansion
    """

    def __init__(self):
        self.api_key = settings.ANTHROPIC_API_KEY
        if not self.api_key:
            raise ValueError("ANTHROPIC_API_KEY not configured")
        self.client = anthropic.Anthropic(api_key=self.api_key)

    def analyze_variable(self, variable_id: int) -> dict:
        try:
            variable = Variable.objects.select_related("feature").get(id=variable_id)
        except Variable.DoesNotExist:
            return {
                "success": False,
                "error": f"Variable with ID {variable_id} not found",
            }

        calibration_values = list(
            CalibrationValue.objects.filter(variable=variable)
            .select_related("release")
            .order_by("release__fecha")
        )

        if not calibration_values:
            return {
                "success": False,
                "error": f"No calibration values found for variable {variable.nombre}",
            }

        payload = {
            "task": "analisis_de_parametro",
            "label": {
                "id": variable.id,
                "nombre": variable.nombre,
                "feature": variable.feature.codigo,
                "unidad": variable.unidad,
                "responsable": variable.responsable,
                "descripcion": variable.descripcion or None,
                "dimension_type": variable.dimension_type,
            },
            "history": [
                {
                    "release": cv.release.nombre,
                    "fecha_release": cv.release.fecha.isoformat(),
                    "valor": cv.valor,
                    "madurez": cv.status_madurez,
                    "verificacion": cv.verificacion,
                    "notas": cv.notas or None,
                }
                for cv in calibration_values
            ],
            "known_limitations": [
                "No hay acceso al A2L completo en el backend actual.",
                "No existen en el modelo actual campos persistidos de min/max, regulatory, confidence o lifecycle por label.",
            ],
        }
        return self._run_task("Analiza este label de calibracion.", payload)

    def review_release(self, release_id: int) -> dict:
        try:
            release = Release.objects.get(id=release_id)
        except Release.DoesNotExist:
            return {
                "success": False,
                "error": f"Release with ID {release_id} not found",
            }

        calibration_values = list(
            CalibrationValue.objects.filter(release=release)
            .select_related("variable", "variable__feature")
            .order_by("variable__feature__codigo", "variable__nombre")
        )

        if not calibration_values:
            return {
                "success": False,
                "error": f"No calibration values found for release {release.nombre}",
            }

        payload = {
            "task": "informe_de_release",
            "release": {
                "id": release.id,
                "nombre": release.nombre,
                "fecha": release.fecha.isoformat(),
                "descripcion": release.descripcion or None,
            },
            "labels": [
                {
                    "feature": cv.variable.feature.codigo,
                    "label": cv.variable.nombre,
                    "responsable": cv.variable.responsable,
                    "unidad": cv.variable.unidad,
                    "valor": cv.valor,
                    "madurez": cv.status_madurez,
                    "verificacion": cv.verificacion,
                }
                for cv in calibration_values
            ],
            "known_limitations": [
                "El modelo actual no tiene datasets separados del release.",
                "El modelo actual no tiene context, lifecycle state, deprecated references ni variant coverage persistidos.",
            ],
        }
        return self._run_task("Genera un informe tecnico de release.", payload)

    def analyze_dataset_payload(self, dataset_payload: dict) -> dict:
        return self._run_task(
            "Revisa el dataset proporcionado por payload y evalua su readiness.",
            {"task": "revision_de_dataset", "dataset": dataset_payload},
        )

    def validate_label_payload(self, label_payload: dict) -> dict:
        return self._run_task(
            "Realiza validacion tecnica heuristica del label proporcionado.",
            {"task": "validacion_tecnica", "label": label_payload},
        )

    def detect_conflicts_payload(self, labels_payload: list[dict]) -> dict:
        return self._run_task(
            "Detecta conflictos de responsabilidad y entrega sobre los labels proporcionados.",
            {"task": "deteccion_de_conflictos", "labels": labels_payload},
        )

    def _run_task(self, task_instruction: str, payload: dict) -> dict:
        user_prompt = self._build_user_prompt(task_instruction, payload)

        try:
            message = self.client.messages.create(
                model="claude-3-5-sonnet-20241022",
                max_tokens=1800,
                system=CALIBRATION_ENGINEER_SYSTEM_PROMPT,
                messages=[{"role": "user", "content": user_prompt}],
            )
            return {
                "success": True,
                "analysis": message.content[0].text,
                "task": payload.get("task"),
            }
        except anthropic.APIError as error:
            logger.error(f"Anthropic API error: {str(error)}")
            return {
                "success": False,
                "error": f"API error: {str(error)}",
            }

    def _build_user_prompt(self, task_instruction: str, payload: dict) -> str:
        payload_text = json.dumps(payload, ensure_ascii=True, indent=2, default=str)
        return (
            f"{task_instruction}\n\n"
            "Trabaja solo con la evidencia disponible. Si faltan campos para una capacidad, "
            "indicalo explicitamente en el resumen y ajusta el nivel de confianza.\n\n"
            "DATOS DE ENTRADA:\n"
            f"{payload_text}"
        )


class UICalibrationAgent:
    """
    Frontend/UI agent for dense engineering interfaces built with Django Templates,
    TailwindCSS and HTMX.
    """

    def __init__(self):
        self.api_key = settings.ANTHROPIC_API_KEY
        if not self.api_key:
            raise ValueError("ANTHROPIC_API_KEY not configured")
        self.client = anthropic.Anthropic(api_key=self.api_key)

    def generate_component(self, requirement: str, context_payload: dict | None = None) -> dict:
        payload = {
            "task": "generacion_de_componente_frontend",
            "requirement": requirement,
            "context": context_payload or {},
        }
        return self._run_task(
            "Genera un componente o vista Django Template + TailwindCSS alineado con el dominio.",
            payload,
        )

    def review_template(self, template_source: str, context_payload: dict | None = None) -> dict:
        payload = {
            "task": "revision_de_ui",
            "template_source": template_source,
            "context": context_payload or {},
        }
        return self._run_task(
            "Revisa la UI existente y propone mejoras concretas de diseno, workflow y trazabilidad.",
            payload,
        )

    def generate_htmx_view(self, requirement: str, context_payload: dict | None = None) -> dict:
        payload = {
            "task": "generacion_de_vista_htmx",
            "requirement": requirement,
            "context": context_payload or {},
        }
        return self._run_task(
            "Genera una vista o fragmento HTMX para interactividad sin SPA.",
            payload,
        )

    def _run_task(self, task_instruction: str, payload: dict) -> dict:
        user_prompt = self._build_user_prompt(task_instruction, payload)

        try:
            message = self.client.messages.create(
                model="claude-3-5-sonnet-20241022",
                max_tokens=2200,
                system=UI_CALIBRATION_SYSTEM_PROMPT,
                messages=[{"role": "user", "content": user_prompt}],
            )
            return {
                "success": True,
                "analysis": message.content[0].text,
                "task": payload.get("task"),
            }
        except anthropic.APIError as error:
            logger.error(f"Anthropic API error: {str(error)}")
            return {
                "success": False,
                "error": f"API error: {str(error)}",
            }

    def _build_user_prompt(self, task_instruction: str, payload: dict) -> str:
        payload_text = json.dumps(payload, ensure_ascii=True, indent=2, default=str)
        return (
            f"{task_instruction}\n\n"
            "Devuelve una solucion lista para integracion en Django Templates. "
            "Prioriza tablas densas, trazabilidad visible y workflow claro.\n\n"
            "DATOS DE ENTRADA:\n"
            f"{payload_text}"
        )


class DatabaseArchitectAgent:
    """
    Database architecture agent specialized in Django + PostgreSQL for regulated
    calibration systems.
    """

    def __init__(self):
        self.api_key = settings.ANTHROPIC_API_KEY
        if not self.api_key:
            raise ValueError("ANTHROPIC_API_KEY not configured")
        self.client = anthropic.Anthropic(api_key=self.api_key)

    def audit_current_schema(self, context_payload: dict | None = None) -> dict:
        payload = {
            "task": "auditoria_de_esquema_actual",
            "database": "kentia_cal",
            "orm": "Django 5.x",
            "current_models": {
                "Feature": {
                    "fields": ["codigo", "nombre", "descripcion", "created_at", "updated_at"],
                },
                "Variable": {
                    "fields": [
                        "feature",
                        "nombre",
                        "descripcion",
                        "unidad",
                        "responsable",
                        "dimension_type",
                        "created_at",
                        "updated_at",
                    ],
                },
                "Release": {
                    "fields": ["nombre", "fecha", "descripcion", "created_at", "updated_at"],
                },
                "CalibrationValue": {
                    "fields": [
                        "variable",
                        "release",
                        "valor",
                        "status_madurez",
                        "verificacion",
                        "notas",
                        "created_at",
                        "updated_at",
                    ],
                },
            },
            "known_gaps": [
                "No hay soft delete.",
                "No hay created_by ni updated_by.",
                "No hay tablas de historial/auditoria.",
                "No existen Dataset ni SWRelease diferenciados de Release.",
                "No hay lifecycle_state, confidence, context ni regulatory flags persistidos.",
                "No se observan indices avanzados ni GIN para JSONField.",
            ],
            "context": context_payload or {},
        }
        return self._run_task(
            "Audita el esquema actual y propone mejoras priorizadas para R156, integridad y rendimiento.",
            payload,
        )

    def design_schema(self, requirement: str, context_payload: dict | None = None) -> dict:
        payload = {
            "task": "diseno_de_esquema",
            "requirement": requirement,
            "database": "kentia_cal",
            "context": context_payload or {},
        }
        return self._run_task(
            "Disena el esquema Django/PostgreSQL requerido con foco en R156, soft delete y audit trail.",
            payload,
        )

    def optimize_query(self, query_payload: dict) -> dict:
        payload = {
            "task": "optimizacion_de_query",
            "database": "kentia_cal",
            "query": query_payload,
        }
        return self._run_task(
            "Analiza y optimiza la query dada, proponiendo ORM mejorado, indices y SQL si aplica.",
            payload,
        )

    def plan_migration(self, migration_payload: dict) -> dict:
        payload = {
            "task": "plan_de_migracion",
            "database": "kentia_cal",
            "migration_problem": migration_payload,
        }
        return self._run_task(
            "Propone una estrategia de migracion segura, compatible con produccion y trazabilidad regulatoria.",
            payload,
        )

    def _run_task(self, task_instruction: str, payload: dict) -> dict:
        user_prompt = self._build_user_prompt(task_instruction, payload)

        try:
            message = self.client.messages.create(
                model="claude-3-5-sonnet-20241022",
                max_tokens=2400,
                system=DATABASE_ARCHITECT_SYSTEM_PROMPT,
                messages=[{"role": "user", "content": user_prompt}],
            )
            return {
                "success": True,
                "analysis": message.content[0].text,
                "task": payload.get("task"),
            }
        except anthropic.APIError as error:
            logger.error(f"Anthropic API error: {str(error)}")
            return {
                "success": False,
                "error": f"API error: {str(error)}",
            }

    def _build_user_prompt(self, task_instruction: str, payload: dict) -> str:
        payload_text = json.dumps(payload, ensure_ascii=True, indent=2, default=str)
        return (
            f"{task_instruction}\n\n"
            "Entrega una respuesta accionable para Django + PostgreSQL. "
            "Distingue claramente entre cambios sobre el esquema actual y diseno objetivo recomendado.\n\n"
            "DATOS DE ENTRADA:\n"
            f"{payload_text}"
        )
