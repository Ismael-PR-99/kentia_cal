from django import forms


class ExcelImportForm(forms.Form):
    file = forms.FileField(
        label="Excel file (.xlsx)",
        required=True,
        widget=forms.FileInput(attrs={"accept": ".xlsx", "class": "form-control"}),
    )

    def clean_file(self):
        file_obj = self.cleaned_data["file"]
        if not file_obj.name.endswith(".xlsx"):
            raise forms.ValidationError("Please upload a .xlsx file")
        return file_obj
