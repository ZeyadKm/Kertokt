"""Utilities for parsing Environmental Working Group reports."""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any, Dict, List

from ..data_models import Contaminant, EWGReport


def _parse_contaminant(payload: Dict[str, Any]) -> Contaminant:
    """Create a :class:`Contaminant` instance from raw payload data."""

    return Contaminant(
        name=str(payload["name"]),
        level_ppb=float(payload["level_ppb"]),
        health_guideline_ppb=float(payload["health_guideline_ppb"])
        if payload.get("health_guideline_ppb") is not None
        else None,
        legal_limit_ppb=float(payload["legal_limit_ppb"])
        if payload.get("legal_limit_ppb") is not None
        else None,
        detected_in=payload.get("detected_in"),
        notes=payload.get("notes"),
    )


def load_ewg_report(path: Path) -> EWGReport:
    """Load an EWG report from a JSON file."""

    data = json.loads(Path(path).read_text(encoding="utf-8"))
    contaminants: List[Contaminant] = [
        _parse_contaminant(item) for item in data.get("contaminants", [])
    ]
    if not contaminants:
        raise ValueError("EWG report must include at least one contaminant entry")

    return EWGReport(
        utility=data.get("utility", "Unknown Utility"),
        contaminants=contaminants,
        year=data.get("year"),
    )


__all__ = ["load_ewg_report"]
