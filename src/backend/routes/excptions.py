from http.client import HTTPException


class EntityNotFound(HTTPException):
    def __init__(self, entity_name: str, entity_id: int):
        super().__init__(
            status_code=404,
            detail={
                "error": "entity_not_found",
                "message": f"Unable to find {entity_name} with id={entity_id}",
            }
        )
        
        
class ValidationError(HTTPException):
    def __init__(self, field_name: str, issue: str):
        super().__init__(
            status_code=400,
            detail={
                "error": "validation_error",
                "message": f"Validation failed for '{field_name}': {issue}",
            }
        )

class PermissionDenied(HTTPException):
    def __init__(self, action: str, resource: str):
        super().__init__(
            status_code=403,
            detail={
                "error": "permission_denied",
                "message": f"You do not have permission to {action} the {resource}.",
            }
        )

class DuplicateResource(HTTPException):
    def __init__(self, entity_name: str, entity_field: str, entity_value: str):
        super().__init__(
            status_code=409,
        
            detail={
                "error": "duplicate_resource",
                "message": f"{entity_name} with {entity_field} '{entity_value}' already exists."
            }
        )

class AuthenticationFailed(HTTPException):
    def __init__(self):
        super().__init__(
            status_code=401,
            detail={
                "error": "authentication_failed",
                "message": "Authentication credentials were invalid or missing.",
            }
        )

class RateLimitExceeded(HTTPException):
    def __init__(self, retry_after_seconds: int):
        super().__init__(
            status_code=429,
            detail={
                "error": "rate_limit_exceeded",
                "message": f"Rate limit exceeded. Try again after {retry_after_seconds} seconds.",
            }
        )