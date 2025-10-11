"""Kertokt consumer report analysis toolkit."""

from importlib import metadata


def get_version() -> str:
    """Return the installed package version."""
    try:
        return metadata.version("kertokt")
    except metadata.PackageNotFoundError:  # pragma: no cover - fallback for editable usage
        return "0.0.0"


__all__ = ["get_version"]
