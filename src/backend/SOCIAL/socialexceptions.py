from fastapi import HTTPException

class InvalidFileType(HTTPException):
    status_code = 400
    default_detail = "File type not accepted"

    def __init__(self, entity_mime_type: str):
        detail = f"file with MIME type {entity_mime_type} not accepted"
        super().__init__(status_code=self.status_code, detail=detail)

class InvalidFileTypeFormat(HTTPException):
    status_code = 400
    default_detail = "File format not accepted"

    def __init__(self, entity_format_type: str):
        detail = f"file with format {entity_format_type} not accepted"
        super().__init__(status_code=self.status_code, detail=detail)