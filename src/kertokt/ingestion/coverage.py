"""Parse insurance, warranty, and related coverage benefits."""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any, Dict, Iterable, List

from ..data_models import CoverageBenefit, CoverageReport


def _parse_benefit(plan: Dict[str, Any], benefit: Dict[str, Any]) -> CoverageBenefit:
    """Create a :class:`CoverageBenefit` from a coverage plan item."""

    return CoverageBenefit(
        provider=str(plan.get("provider", "Unknown Provider")),
        plan_name=str(plan.get("plan_name", "Unknown Plan")),
        category=str(plan.get("category", "general")),
        name=str(benefit.get("name", "Unnamed Benefit")),
        description=str(benefit.get("description", "")),
        annual_value=float(benefit["annual_value"]) if benefit.get("annual_value") is not None else None,
        requirements=benefit.get("requirements"),
        contact_url=benefit.get("contact_url"),
    )


def load_coverage_report(path: Path) -> CoverageReport:
    """Load a coverage report from a JSON file."""

    data = json.loads(Path(path).read_text(encoding="utf-8"))
    plans: Iterable[Dict[str, Any]] = data.get("plans", [])
    benefits: List[CoverageBenefit] = []
    for plan in plans:
        for benefit in plan.get("benefits", []):
            benefits.append(_parse_benefit(plan, benefit))

    return CoverageReport(benefits=benefits)


__all__ = ["load_coverage_report"]
