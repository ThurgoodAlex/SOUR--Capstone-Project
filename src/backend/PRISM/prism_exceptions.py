from fastapi import HTTPException

class DuplicateUserRegistration(HTTPException):
    status_code = 409
    default_detail = "Entity already exists."
    def __init__(self, entity_name: str, entity_field: str, entity_value: str):
        self.entity_name = entity_name
        self.entity_field = entity_field
        self.entity_value = entity_value
        detail = f"{entity_name} with {entity_field} '{entity_value}' already exists."
        super().__init__(status_code=self.status_code, detail=detail)

class AuthException(HTTPException):
    def __init__(self, error: str, description: str):
        super().__init__(
            status_code=401,
            detail={
                "error": error,
                "error_description": description
            },
        )

class InvalidCredentials(AuthException):
    def __init__(self):
        super().__init__(
            error="invalid_client",
            description="invalid username or password",
        )

class InvalidToken(AuthException):
    def __init__(self):
        super().__init__(
            error="invalid_client",
            description="invalid access token",
        )


class ExpiredToken(AuthException):
    def __init__(self):
        super().__init__(
            error="invalid_client",
            description="expired access token",
        )
