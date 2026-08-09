class DevConnectError(Exception):
    """Base exception for the Python intelligence service."""


class ValidationError(DevConnectError):
    """Raised when an incoming request is invalid."""


class StorageError(DevConnectError):
    """Raised when local file storage fails."""
