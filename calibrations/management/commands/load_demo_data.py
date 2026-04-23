from datetime import date

from django.core.management.base import BaseCommand
from django.db import transaction

from calibrations.models import CalibrationValue, Feature, Release, Variable


class Command(BaseCommand):
    help = "Load demo data for calibration management domain."

    @transaction.atomic
    def handle(self, *args, **options):
        features = self._load_features()
        variables = self._load_variables(features)
        releases = self._load_releases()
        self._load_calibration_values(variables, releases)

        self.stdout.write(self.style.SUCCESS("Demo data loaded successfully."))

    def _load_features(self):
        feature_payload = [
            ("F1", "Feature F1", "Parametros base del feature F1"),
            ("F2", "Feature F2", "Parametros base del feature F2"),
            ("F3", "Feature F3", "Parametros base del feature F3"),
        ]

        created = {}
        for codigo, nombre, descripcion in feature_payload:
            feature, _ = Feature.objects.update_or_create(
                codigo=codigo,
                defaults={
                    "nombre": nombre,
                    "descripcion": descripcion,
                },
            )
            created[codigo] = feature
        return created

    def _load_variables(self, features):
        variable_payload = [
            ("F1", "var1", "Engine speed target", "rpm", Variable.Responsible.SUPPLIER),
            ("F1", "var2", "Idle speed minimum", "rpm", Variable.Responsible.SUPPLIER),
            ("F1", "var3", "Idle speed maximum", "rpm", Variable.Responsible.SUPPLIER),
            ("F2", "var4", "Turbo spool threshold", "rpm", Variable.Responsible.SUPPLIER),
            ("F2", "var5", "Rev limiter threshold", "rpm", Variable.Responsible.SUPPLIER),
            ("F3", "var6", "Torque request map", "Nm", Variable.Responsible.OEM),
            ("F3", "var7", "Ignition advance map", "deg", Variable.Responsible.OEM),
            ("F3", "var8", "Fuel correction table", "ms", Variable.Responsible.OEM),
        ]

        created = {}
        for feature_code, nombre, descripcion, unidad, responsable in variable_payload:
            variable, _ = Variable.objects.update_or_create(
                feature=features[feature_code],
                nombre=nombre,
                defaults={
                    "descripcion": descripcion,
                    "unidad": unidad,
                    "responsable": responsable,
                    "dimension_type": Variable.DimensionType.SCALAR_1X1,
                },
            )
            created[nombre] = variable
        return created

    def _load_releases(self):
        release_payload = [
            ("Release1", date(2026, 1, 10), "Initial calibration baseline"),
            ("Release2", date(2026, 2, 14), "Bench validated update"),
            ("Release3", date(2026, 3, 20), "Vehicle validation update"),
            ("Release4", date(2026, 4, 15), "Homologation candidate"),
        ]

        created = {}
        for nombre, fecha, descripcion in release_payload:
            release, _ = Release.objects.update_or_create(
                nombre=nombre,
                defaults={
                    "fecha": fecha,
                    "descripcion": descripcion,
                },
            )
            created[nombre] = release
        return created

    def _load_calibration_values(self, variables, releases):
        demo_values = {
            "var1": [
                ("Release1", 1500, CalibrationValue.MaturityStatus.INITIAL, CalibrationValue.VerificationType.NONE),
                ("Release2", 1500, CalibrationValue.MaturityStatus.TEST_BENCH, CalibrationValue.VerificationType.TEST_BENCH),
                ("Release3", 1550, CalibrationValue.MaturityStatus.VEHICLE, CalibrationValue.VerificationType.VEHICLE),
                ("Release4", 1550, CalibrationValue.MaturityStatus.HOMOLOGATION, CalibrationValue.VerificationType.HOMOLOGATION),
            ],
            "var2": [
                ("Release1", 780, CalibrationValue.MaturityStatus.INITIAL, CalibrationValue.VerificationType.NONE),
                ("Release2", 800, CalibrationValue.MaturityStatus.TEST_BENCH, CalibrationValue.VerificationType.TEST_BENCH),
                ("Release3", 810, CalibrationValue.MaturityStatus.VEHICLE, CalibrationValue.VerificationType.VEHICLE),
                ("Release4", 820, CalibrationValue.MaturityStatus.HOMOLOGATION, CalibrationValue.VerificationType.HOMOLOGATION),
            ],
            "var3": [
                ("Release1", 1050, CalibrationValue.MaturityStatus.INITIAL, CalibrationValue.VerificationType.NONE),
                ("Release2", 1080, CalibrationValue.MaturityStatus.TEST_BENCH, CalibrationValue.VerificationType.TEST_BENCH),
                ("Release3", 1100, CalibrationValue.MaturityStatus.VEHICLE, CalibrationValue.VerificationType.VEHICLE),
                ("Release4", 1120, CalibrationValue.MaturityStatus.HOMOLOGATION, CalibrationValue.VerificationType.HOMOLOGATION),
            ],
            "var4": [
                ("Release1", 1800, CalibrationValue.MaturityStatus.INITIAL, CalibrationValue.VerificationType.NONE),
                ("Release2", 1850, CalibrationValue.MaturityStatus.TEST_BENCH, CalibrationValue.VerificationType.TEST_BENCH),
                ("Release3", 1875, CalibrationValue.MaturityStatus.VEHICLE, CalibrationValue.VerificationType.VEHICLE),
                ("Release4", 1900, CalibrationValue.MaturityStatus.HOMOLOGATION, CalibrationValue.VerificationType.HOMOLOGATION),
            ],
            "var5": [
                ("Release1", 6200, CalibrationValue.MaturityStatus.INITIAL, CalibrationValue.VerificationType.NONE),
                ("Release2", 6300, CalibrationValue.MaturityStatus.TEST_BENCH, CalibrationValue.VerificationType.TEST_BENCH),
                ("Release3", 6400, CalibrationValue.MaturityStatus.VEHICLE, CalibrationValue.VerificationType.VEHICLE),
                ("Release4", 6500, CalibrationValue.MaturityStatus.HOMOLOGATION, CalibrationValue.VerificationType.HOMOLOGATION),
            ],
            "var6": [
                ("Release1", 220, CalibrationValue.MaturityStatus.INITIAL, CalibrationValue.VerificationType.NONE),
                ("Release2", 240, CalibrationValue.MaturityStatus.TEST_BENCH, CalibrationValue.VerificationType.TEST_BENCH),
                ("Release3", 250, CalibrationValue.MaturityStatus.VEHICLE, CalibrationValue.VerificationType.VEHICLE),
                ("Release4", 255, CalibrationValue.MaturityStatus.HOMOLOGATION, CalibrationValue.VerificationType.HOMOLOGATION),
            ],
            "var7": [
                ("Release1", 8.0, CalibrationValue.MaturityStatus.INITIAL, CalibrationValue.VerificationType.NONE),
                ("Release2", 9.5, CalibrationValue.MaturityStatus.TEST_BENCH, CalibrationValue.VerificationType.TEST_BENCH),
                ("Release3", 10.0, CalibrationValue.MaturityStatus.VEHICLE, CalibrationValue.VerificationType.VEHICLE),
                ("Release4", 10.5, CalibrationValue.MaturityStatus.HOMOLOGATION, CalibrationValue.VerificationType.HOMOLOGATION),
            ],
            "var8": [
                ("Release1", 3.1, CalibrationValue.MaturityStatus.INITIAL, CalibrationValue.VerificationType.NONE),
                ("Release2", 3.0, CalibrationValue.MaturityStatus.TEST_BENCH, CalibrationValue.VerificationType.TEST_BENCH),
                ("Release3", 2.95, CalibrationValue.MaturityStatus.VEHICLE, CalibrationValue.VerificationType.VEHICLE),
                ("Release4", 2.9, CalibrationValue.MaturityStatus.HOMOLOGATION, CalibrationValue.VerificationType.HOMOLOGATION),
            ],
        }

        for variable_name, rows in demo_values.items():
            variable = variables[variable_name]
            for release_name, valor, status_madurez, verificacion in rows:
                CalibrationValue.objects.update_or_create(
                    variable=variable,
                    release=releases[release_name],
                    defaults={
                        "valor": valor,
                        "status_madurez": status_madurez,
                        "verificacion": verificacion,
                        "notas": "Demo data",
                    },
                )
