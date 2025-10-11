"""Parsing utilities for municipal water quality reports."""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any, Dict, List

from ..data_models import Contaminant, ProgramOpportunity, UtilityReport


def _parse_contaminant(payload: Dict[str, Any]) -> Contaminant:
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


def _parse_program(payload: Dict[str, Any]) -> ProgramOpportunity:
    return ProgramOpportunity(
        name=str(payload["name"]),
        description=str(payload.get("description", "")),
        category=str(payload.get("category", "general")),
        estimated_value=float(payload["estimated_value"])
        if payload.get("estimated_value") is not None
        else None,
        enrollment_deadline=payload.get("enrollment_deadline"),
        url=payload.get("url"),
        status=payload.get("status"),
        eligibility=payload.get("eligibility"),
    )


def load_utility_report(path: Path) -> UtilityReport:
    """Load a utility report from JSON."""

    data = json.loads(Path(path).read_text(encoding="utf-8"))
    contaminants: List[Contaminant] = [
        _parse_contaminant(item) for item in data.get("contaminants", [])
    ]
    programs: List[ProgramOpportunity] = [
        _parse_program(item) for item in data.get("programs", [])
    ]
    return UtilityReport(
        utility=data.get("utility", "Unknown Utility"),
        contaminants=contaminants,
        programs=programs,
        report_year=data.get("report_year"),
        customer_support_url=data.get("customer_support_url"),
    )


__all__ = ["load_utility_report"]
