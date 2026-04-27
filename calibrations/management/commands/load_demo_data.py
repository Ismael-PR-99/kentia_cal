from datetime import date

from django.core.management.base import BaseCommand
from django.db import transaction

from calibrations.models import CalibrationValue, Feature, Release, Variable


class Command(BaseCommand):
    help = "Load demo data for calibration management domain."

    @transaction.atomic
    def handle(self, *args, **options):
        # Limpia datos existentes para recarga limpia
        CalibrationValue.objects.all().delete()
        Variable.objects.all().delete()
        Release.objects.all().delete()
        Feature.objects.all().delete()

        features = self._load_features()
        releases = self._load_releases()
        variables = self._load_variables(features)
        self._load_calibration_values(variables, releases)

        self.stdout.write(self.style.SUCCESS("Demo data loaded successfully."))

    # ─────────────────────────────────────────────
    # Features
    # ─────────────────────────────────────────────
    def _load_features(self):
        payload = [
            ("F1", "Engine Control",    "Parametros de control del motor"),
            ("F2", "Fuel System",       "Parametros del sistema de combustible"),
            ("F3", "Torque Management", "Parametros de gestion del par motor"),
        ]
        created = {}
        for codigo, nombre, descripcion in payload:
            f, _ = Feature.objects.update_or_create(
                codigo=codigo,
                defaults={"nombre": nombre, "descripcion": descripcion},
            )
            created[codigo] = f
        return created

    # ─────────────────────────────────────────────
    # Releases
    # ─────────────────────────────────────────────
    def _load_releases(self):
        payload = [
            ("Release1", date(2026, 1, 10), "Initial calibration baseline"),
            ("Release2", date(2026, 2, 14), "Bench validated update"),
            ("Release3", date(2026, 3, 20), "Vehicle validation update"),
            ("Release4", date(2026, 4, 15), "Homologation candidate"),
        ]
        created = {}
        for nombre, fecha, descripcion in payload:
            r, _ = Release.objects.update_or_create(
                nombre=nombre,
                defaults={"fecha": fecha, "descripcion": descripcion},
            )
            created[nombre] = r
        return created

    # ─────────────────────────────────────────────
    # Variables escalares + mapas
    # ─────────────────────────────────────────────
    def _load_variables(self, features):
        # (feature_code, nombre, descripcion, unidad, responsable, dim, map_type, ax, ay, ax_vals, ay_vals)
        scalar = Variable.DimensionType.SCALAR_1X1
        nxn    = Variable.DimensionType.ARRAY_NXN
        S      = Variable.Responsible.SUPPLIER
        O      = Variable.Responsible.OEM

        RPM_AXIS = [800, 1000, 1200, 1500, 2000, 2500, 3000, 3500]

        payload = [
            # ── ESCALARES ──────────────────────────────────────────────────
            ("F1", "var1", "Engine speed target",   "rpm", S, scalar, "", "", "", None, None),
            ("F1", "var2", "Idle speed minimum",    "rpm", S, scalar, "", "", "", None, None),
            ("F1", "var3", "Idle speed maximum",    "rpm", S, scalar, "", "", "", None, None),
            ("F2", "var4", "Turbo spool threshold", "rpm", S, scalar, "", "", "", None, None),
            ("F2", "var5", "Rev limiter threshold", "rpm", S, scalar, "", "", "", None, None),
            ("F3", "var6", "Torque request base",   "Nm",  O, scalar, "", "", "", None, None),
            ("F3", "var7", "Ignition advance base", "deg", O, scalar, "", "", "", None, None),
            ("F3", "var8", "Fuel correction base",  "ms",  O, scalar, "", "", "", None, None),
            # ── MAPAS ──────────────────────────────────────────────────────
            (
                "F1", "SparkAdvanceMap",
                "Mapa de avance de encendido",
                "deg BTDC", S, nxn,
                "spark_advance",
                "Engine Speed (rpm)",
                "Engine Load (%)",
                RPM_AXIS,
                [10, 20, 30, 40, 50, 60, 75, 100],
            ),
            (
                "F2", "FuelMap",
                "Mapa de tiempo de inyeccion",
                "ms", S, nxn,
                "fuel_map",
                "Engine Speed (rpm)",
                "Manifold Pressure (kPa)",
                RPM_AXIS,
                [40, 60, 80, 100, 120, 140, 160, 180],
            ),
            (
                "F3", "TorqueMap",
                "Mapa de par motor",
                "Nm", O, nxn,
                "torque_map",
                "Engine Speed (rpm)",
                "Accelerator Position (%)",
                RPM_AXIS,
                [0, 10, 20, 30, 40, 60, 80, 100],
            ),
        ]

        created = {}
        for (fc, nombre, desc, unidad, resp, dim, mtype, axl, ayl, axv, ayv) in payload:
            v, _ = Variable.objects.update_or_create(
                feature=features[fc],
                nombre=nombre,
                defaults={
                    "descripcion":    desc,
                    "unidad":         unidad,
                    "responsable":    resp,
                    "dimension_type": dim,
                    "map_type":       mtype,
                    "axis_x_label":   axl,
                    "axis_y_label":   ayl,
                    "axis_x_values":  axv,
                    "axis_y_values":  ayv,
                },
            )
            created[nombre] = v
        return created

    # ─────────────────────────────────────────────
    # CalibrationValues
    # ─────────────────────────────────────────────
    def _load_calibration_values(self, variables, releases):
        M = CalibrationValue.MaturityStatus
        V = CalibrationValue.VerificationType

        # ── Valores escalares ────────────────────────────────────────────
        scalar_data = {
            "var1": [(1500, M.INITIAL, V.NONE), (1500, M.TEST_BENCH, V.TEST_BENCH),
                     (1550, M.VEHICLE, V.VEHICLE), (1550, M.HOMOLOGATION, V.HOMOLOGATION)],
            "var2": [(780, M.INITIAL, V.NONE), (800, M.TEST_BENCH, V.TEST_BENCH),
                     (810, M.VEHICLE, V.VEHICLE), (820, M.HOMOLOGATION, V.HOMOLOGATION)],
            "var3": [(1050, M.INITIAL, V.NONE), (1080, M.TEST_BENCH, V.TEST_BENCH),
                     (1100, M.VEHICLE, V.VEHICLE), (1120, M.HOMOLOGATION, V.HOMOLOGATION)],
            "var4": [(1800, M.INITIAL, V.NONE), (1850, M.TEST_BENCH, V.TEST_BENCH),
                     (1875, M.VEHICLE, V.VEHICLE), (1900, M.HOMOLOGATION, V.HOMOLOGATION)],
            "var5": [(6200, M.INITIAL, V.NONE), (6300, M.TEST_BENCH, V.TEST_BENCH),
                     (6400, M.VEHICLE, V.VEHICLE), (6500, M.HOMOLOGATION, V.HOMOLOGATION)],
            "var6": [(220, M.INITIAL, V.NONE), (240, M.TEST_BENCH, V.TEST_BENCH),
                     (250, M.VEHICLE, V.VEHICLE), (255, M.HOMOLOGATION, V.HOMOLOGATION)],
            "var7": [(8.0, M.INITIAL, V.NONE), (9.5, M.TEST_BENCH, V.TEST_BENCH),
                     (10.0, M.VEHICLE, V.VEHICLE), (10.5, M.HOMOLOGATION, V.HOMOLOGATION)],
            "var8": [(3.1, M.INITIAL, V.NONE), (3.0, M.TEST_BENCH, V.TEST_BENCH),
                     (2.95, M.VEHICLE, V.VEHICLE), (2.9, M.HOMOLOGATION, V.HOMOLOGATION)],
        }
        release_order = ["Release1", "Release2", "Release3", "Release4"]
        for vname, rows in scalar_data.items():
            var = variables[vname]
            for rname, (valor, madurez, verif) in zip(release_order, rows):
                CalibrationValue.objects.update_or_create(
                    variable=var,
                    release=releases[rname],
                    defaults={"valor": valor, "status_madurez": madurez,
                              "verificacion": verif, "notas": "Demo data"},
                )

        # ── SparkAdvanceMap (deg BTDC, 8x8) ─────────────────────────────
        spark_r1 = [
            [30, 32, 35, 34, 28, 22, 18, 14],
            [28, 31, 34, 33, 27, 21, 17, 13],
            [25, 29, 32, 31, 25, 20, 16, 12],
            [22, 26, 29, 28, 23, 18, 14, 10],
            [18, 22, 25, 24, 20, 15, 12,  8],
            [14, 18, 21, 20, 16, 12,  9,  6],
            [10, 14, 17, 16, 13,  9,  7,  4],
            [ 6, 10, 13, 12, 10,  7,  5,  3],
        ]
        spark_r2 = [
            [31, 33, 36, 35, 29, 23, 18, 14],
            [29, 32, 35, 35, 28, 22, 17, 13],
            [26, 30, 33, 33, 27, 21, 16, 12],
            [23, 27, 30, 30, 24, 19, 14, 10],
            [19, 23, 26, 25, 21, 16, 12,  8],
            [15, 19, 22, 21, 17, 13,  9,  6],
            [11, 15, 18, 17, 14, 10,  7,  4],
            [ 7, 11, 14, 13, 11,  8,  5,  3],
        ]
        spark_r3 = [
            [31, 33, 36, 35, 29, 23, 19, 15],
            [29, 32, 35, 35, 28, 22, 18, 14],
            [26, 30, 33, 33, 27, 21, 17, 13],
            [23, 27, 31, 30, 25, 19, 15, 11],
            [19, 23, 26, 25, 21, 16, 13,  9],
            [15, 19, 22, 21, 17, 13, 10,  7],
            [11, 15, 18, 17, 14, 10,  8,  5],
            [ 7, 11, 14, 13, 11,  8,  6,  4],
        ]
        spark_r4 = [
            [31, 33, 36, 35, 29, 23, 19, 15],
            [29, 32, 35, 35, 28, 22, 18, 14],
            [26, 30, 34, 33, 27, 21, 17, 13],
            [23, 27, 31, 30, 25, 19, 15, 11],
            [19, 23, 27, 26, 21, 16, 13,  9],
            [15, 19, 23, 22, 17, 13, 10,  7],
            [11, 15, 19, 18, 14, 10,  8,  5],
            [ 7, 11, 15, 14, 11,  8,  6,  4],
        ]
        spark_matrices = [
            ("Release1", spark_r1, M.INITIAL,      V.NONE),
            ("Release2", spark_r2, M.TEST_BENCH,   V.TEST_BENCH),
            ("Release3", spark_r3, M.VEHICLE,      V.VEHICLE),
            ("Release4", spark_r4, M.HOMOLOGATION, V.HOMOLOGATION),
        ]
        spark_var = variables["SparkAdvanceMap"]
        for rname, matrix, madurez, verif in spark_matrices:
            CalibrationValue.objects.update_or_create(
                variable=spark_var,
                release=releases[rname],
                defaults={"valor": matrix, "status_madurez": madurez,
                          "verificacion": verif, "notas": "Demo data"},
            )

        # ── FuelMap (ms, 8x8) ────────────────────────────────────────────
        fuel_r1 = [
            [ 2.1,  2.5,  3.0,  3.8,  5.0,  6.5,  8.0,  9.5],
            [ 2.8,  3.3,  4.0,  5.0,  6.5,  8.2, 10.0, 12.0],
            [ 3.5,  4.2,  5.0,  6.3,  8.0, 10.0, 12.5, 14.5],
            [ 4.5,  5.4,  6.5,  8.0, 10.2, 12.5, 15.5, 17.5],
            [ 5.5,  6.6,  8.0,  9.8, 12.5, 15.0, 18.0, 20.0],
            [ 6.5,  7.8,  9.5, 11.5, 14.5, 17.5, 20.5, 22.0],
            [ 7.0,  8.5, 10.2, 12.5, 15.5, 18.5, 21.0, 22.5],
            [ 7.2,  8.8, 10.5, 12.8, 16.0, 19.0, 21.5, 23.0],
        ]
        fuel_r2 = [
            [ 2.1,  2.5,  3.0,  3.8,  5.0,  6.4,  7.9,  9.4],
            [ 2.8,  3.3,  4.0,  5.0,  6.5,  8.1,  9.9, 11.9],
            [ 3.5,  4.2,  5.0,  6.2,  7.9,  9.9, 12.4, 14.4],
            [ 4.5,  5.4,  6.4,  7.9, 10.1, 12.4, 15.4, 17.4],
            [ 5.5,  6.5,  7.9,  9.7, 12.4, 14.9, 17.9, 19.9],
            [ 6.5,  7.8,  9.4, 11.4, 14.4, 17.4, 20.4, 21.9],
            [ 7.0,  8.4, 10.1, 12.4, 15.4, 18.4, 20.9, 22.4],
            [ 7.2,  8.7, 10.4, 12.7, 15.9, 18.9, 21.4, 22.9],
        ]
        fuel_r3 = [
            [ 2.0,  2.4,  2.9,  3.7,  5.0,  6.4,  7.9,  9.4],
            [ 2.7,  3.2,  3.9,  4.9,  6.4,  8.1,  9.9, 11.8],
            [ 3.4,  4.1,  4.9,  6.1,  7.8,  9.9, 12.3, 14.3],
            [ 4.4,  5.3,  6.3,  7.8, 10.0, 12.3, 15.3, 17.3],
            [ 5.4,  6.4,  7.8,  9.6, 12.3, 14.8, 17.8, 19.8],
            [ 6.4,  7.7,  9.3, 11.3, 14.3, 17.3, 20.3, 21.8],
            [ 6.9,  8.3, 10.0, 12.3, 15.3, 18.3, 20.8, 22.3],
            [ 7.1,  8.6, 10.3, 12.6, 15.8, 18.8, 21.3, 22.8],
        ]
        fuel_r4 = [
            [ 2.0,  2.4,  2.9,  3.7,  4.9,  6.3,  7.8,  9.3],
            [ 2.7,  3.2,  3.8,  4.8,  6.3,  8.0,  9.8, 11.7],
            [ 3.4,  4.1,  4.8,  6.0,  7.7,  9.8, 12.2, 14.2],
            [ 4.3,  5.2,  6.2,  7.7,  9.9, 12.2, 15.2, 17.2],
            [ 5.3,  6.3,  7.7,  9.5, 12.2, 14.7, 17.7, 19.7],
            [ 6.3,  7.6,  9.2, 11.2, 14.2, 17.2, 20.2, 21.7],
            [ 6.8,  8.2,  9.9, 12.2, 15.2, 18.2, 20.7, 22.2],
            [ 7.0,  8.5, 10.2, 12.5, 15.7, 18.7, 21.2, 22.7],
        ]
        fuel_matrices = [
            ("Release1", fuel_r1, M.INITIAL,      V.NONE),
            ("Release2", fuel_r2, M.TEST_BENCH,   V.TEST_BENCH),
            ("Release3", fuel_r3, M.VEHICLE,      V.VEHICLE),
            ("Release4", fuel_r4, M.HOMOLOGATION, V.HOMOLOGATION),
        ]
        fuel_var = variables["FuelMap"]
        for rname, matrix, madurez, verif in fuel_matrices:
            CalibrationValue.objects.update_or_create(
                variable=fuel_var,
                release=releases[rname],
                defaults={"valor": matrix, "status_madurez": madurez,
                          "verificacion": verif, "notas": "Demo data"},
            )

        # ── TorqueMap (Nm, 8x8 — camion pesado diesel) ───────────────────
        torque_r1 = [
            [  0,  45,  90, 135, 180, 270, 360, 420],
            [  0,  60, 120, 180, 240, 380, 500, 580],
            [  0,  75, 150, 230, 310, 490, 650, 750],
            [  0,  85, 170, 260, 360, 560, 750, 870],
            [  0,  80, 165, 250, 345, 540, 720, 840],
            [  0,  72, 148, 228, 315, 495, 660, 770],
            [  0,  62, 128, 198, 275, 430, 575, 670],
            [  0,  50, 105, 163, 228, 358, 478, 560],
        ]
        torque_r2 = [
            [  0,  47,  93, 140, 185, 275, 365, 425],
            [  0,  62, 124, 186, 247, 387, 508, 590],
            [  0,  77, 155, 236, 316, 497, 658, 760],
            [  0,  88, 175, 266, 368, 568, 758, 878],
            [  0,  83, 170, 256, 352, 550, 730, 851],
            [  0,  74, 153, 234, 322, 504, 669, 780],
            [  0,  64, 132, 203, 281, 438, 583, 679],
            [  0,  52, 108, 167, 232, 364, 484, 567],
        ]
        torque_r3 = [
            [  0,  47,  94, 141, 187, 278, 368, 428],
            [  0,  63, 125, 188, 250, 391, 513, 595],
            [  0,  78, 156, 238, 319, 501, 663, 766],
            [  0,  89, 177, 268, 371, 572, 763, 884],
            [  0,  84, 171, 258, 355, 554, 736, 857],
            [  0,  75, 154, 236, 325, 508, 674, 785],
            [  0,  65, 133, 205, 284, 442, 588, 685],
            [  0,  53, 109, 169, 235, 368, 489, 572],
        ]
        torque_r4 = [
            [  0,  48,  95, 142, 188, 280, 370, 430],
            [  0,  64, 127, 190, 253, 394, 517, 600],
            [  0,  80, 158, 240, 322, 505, 667, 770],
            [  0,  90, 179, 270, 374, 576, 768, 890],
            [  0,  85, 173, 260, 358, 558, 740, 862],
            [  0,  76, 156, 238, 328, 512, 678, 790],
            [  0,  66, 135, 207, 287, 446, 592, 690],
            [  0,  54, 111, 171, 237, 371, 493, 576],
        ]
        torque_matrices = [
            ("Release1", torque_r1, M.INITIAL,      V.NONE),
            ("Release2", torque_r2, M.TEST_BENCH,   V.TEST_BENCH),
            ("Release3", torque_r3, M.VEHICLE,      V.VEHICLE),
            ("Release4", torque_r4, M.HOMOLOGATION, V.HOMOLOGATION),
        ]
        torque_var = variables["TorqueMap"]
        for rname, matrix, madurez, verif in torque_matrices:
            CalibrationValue.objects.update_or_create(
                variable=torque_var,
                release=releases[rname],
                defaults={"valor": matrix, "status_madurez": madurez,
                          "verificacion": verif, "notas": "Demo data"},
            )
