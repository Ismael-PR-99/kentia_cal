import logging
from io import BytesIO

from openpyxl import load_workbook

from .models import CalibrationValue, Feature, Release, Variable

logger = logging.getLogger(__name__)


def import_from_excel(file_obj) -> dict:
    """
    Parse Excel file and import calibration data.
    Expected format:
    - First table: Feature (A), Variable (B), Releases (C+) with 'x' marker
    - Second table: value, status, verification, unit, description, release, responsible

    Returns dict with import summary:
    {
        "success": bool,
        "features_created": int,
        "features_updated": int,
        "variables_created": int,
        "variables_updated": int,
        "releases_created": int,
        "values_created": int,
        "values_updated": int,
        "errors": [str],
    }
    """
    summary = {
        "success": False,
        "features_created": 0,
        "features_updated": 0,
        "variables_created": 0,
        "variables_updated": 0,
        "releases_created": 0,
        "values_created": 0,
        "values_updated": 0,
        "errors": [],
    }

    try:
        # Load workbook
        file_bytes = file_obj.read()
        workbook = load_workbook(BytesIO(file_bytes))
        sheet = workbook.active

        # Parse first table: features and variable-release assignments
        features_map = {}  # {feature_code: Feature}
        variables_map = {}  # {(feature_code, var_name): Variable}
        releases_in_table = []  # [Release names from headers]
        variable_release_map = {}  # {(var_id, release_name): marked}

        # Find header row (row with releases)
        header_row = None
        for row_idx in range(1, sheet.max_row + 1):
            cell_a = sheet[f"A{row_idx}"].value
            if cell_a and str(cell_a).upper() == "FEATURE":
                header_row = row_idx
                break

        if not header_row:
            summary["errors"].append("Could not find header row with 'FEATURE'")
            return summary

        # Extract release names from header
        for col_idx in range(3, 20):  # Columns C onwards
            cell_val = sheet.cell(header_row, col_idx).value
            if cell_val:
                releases_in_table.append(str(cell_val).strip())

        # Create/update releases
        for release_name in releases_in_table:
            release, created = Release.objects.update_or_create(
                nombre=release_name,
                defaults={"fecha": "2026-04-22", "descripcion": f"Imported from Excel"},
            )
            if created:
                summary["releases_created"] += 1

        # Parse data rows (skip header)
        current_feature = None
        for row_idx in range(header_row + 1, sheet.max_row + 1):
            cell_a = sheet[f"A{row_idx}"].value
            cell_b = sheet[f"B{row_idx}"].value
            cell_c = sheet[f"C{row_idx}"].value

            # End of first table if all cells empty
            if not cell_a and not cell_b and not cell_c:
                break

            # Feature in column A (may span multiple rows)
            if cell_a:
                feature_code = str(cell_a).strip()
                feature, created = Feature.objects.update_or_create(
                    codigo=feature_code,
                    defaults={"nombre": f"Feature {feature_code}", "descripcion": "Imported from Excel"},
                )
                if created:
                    summary["features_created"] += 1
                else:
                    summary["features_updated"] += 1
                current_feature = feature
                features_map[feature_code] = feature

            # Variable in column B
            if cell_b and current_feature:
                var_name = str(cell_b).strip()
                variable, created = Variable.objects.update_or_create(
                    feature=current_feature,
                    nombre=var_name,
                    defaults={
                        "descripcion": "Imported from Excel",
                        "unidad": "",
                        "responsable": Variable.Responsible.SUPPLIER,
                        "dimension_type": Variable.DimensionType.SCALAR_1X1,
                    },
                )
                if created:
                    summary["variables_created"] += 1
                else:
                    summary["variables_updated"] += 1
                variables_map[(current_feature.codigo, var_name)] = variable

                # Mark which releases this variable belongs to
                for col_idx, release_name in enumerate(releases_in_table, start=3):
                    cell_val = sheet.cell(row_idx, col_idx).value
                    if cell_val and str(cell_val).strip().lower() == "x":
                        variable_release_map[(variable.id, release_name)] = True

        # Parse second table: calibration values
        # Find start of second table (look for "value" or similar header)
        second_table_row = None
        for row_idx in range(header_row + 20, sheet.max_row + 1):
            cell_a = sheet[f"A{row_idx}"].value
            if cell_a and str(cell_a).lower() in ["value", "valor"]:
                second_table_row = row_idx
                break

        if second_table_row:
            # Parse calibration values
            for row_idx in range(second_table_row + 1, sheet.max_row + 1):
                cell_feature = sheet[f"A{row_idx}"].value
                cell_variable = sheet[f"B{row_idx}"].value
                cell_release = sheet[f"C{row_idx}"].value
                cell_value = sheet[f"D{row_idx}"].value
                cell_status = sheet[f"E{row_idx}"].value
                cell_verification = sheet[f"F{row_idx}"].value

                # End of table
                if not any([cell_feature, cell_variable, cell_release]):
                    break

                if cell_feature and cell_variable and cell_release and cell_value:
                    feature_code = str(cell_feature).strip()
                    var_name = str(cell_variable).strip()
                    release_name = str(cell_release).strip()
                    valor = float(cell_value) if cell_value else 0
                    status = str(cell_status).strip() if cell_status else "0.25"
                    verification = str(cell_verification).strip() if cell_verification else "No"

                    try:
                        variable = Variable.objects.get(
                            feature__codigo=feature_code, nombre=var_name
                        )
                        release = Release.objects.get(nombre=release_name)

                        calibration_value, created = CalibrationValue.objects.update_or_create(
                            variable=variable,
                            release=release,
                            defaults={
                                "valor": valor,
                                "status_madurez": status,
                                "verificacion": verification,
                                "notas": "Imported from Excel",
                            },
                        )
                        if created:
                            summary["values_created"] += 1
                        else:
                            summary["values_updated"] += 1
                    except (Variable.DoesNotExist, Release.DoesNotExist) as e:
                        summary["errors"].append(
                            f"Row {row_idx}: Variable ({feature_code}/{var_name}) or Release ({release_name}) not found"
                        )

        summary["success"] = True
        return summary

    except Exception as e:
        logger.error(f"Excel import error: {str(e)}")
        summary["errors"].append(f"Import failed: {str(e)}")
        return summary
