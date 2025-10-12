"""Text rendering helpers for analysis output."""

from __future__ import annotations

from typing import Iterable

from .data_models import Finding, Recommendation, Severity


def format_findings(findings: Iterable[Finding]) -> str:
    """Format findings as bullet points."""

    lines = []
    for finding in findings:
        prefix = {
            Severity.HIGH: "!",
            Severity.MEDIUM: "-",
            Severity.LOW: "·",
        }[finding.severity]
        detail = f"{finding.message}"
        if finding.recommended_action:
            detail += f" Action: {finding.recommended_action}"
        lines.append(f"  {prefix} {finding.source}: {detail}")
    if not lines:
        return "  · No urgent contaminant findings."
    return "\n".join(lines)


def format_recommendations(recommendations: Iterable[Recommendation]) -> str:
    """Format recommendations for console display."""

    lines = []
    for recommendation in recommendations:
        prefix = {
            Severity.HIGH: "(High)",
            Severity.MEDIUM: "(Medium)",
            Severity.LOW: "(Low)",
        }[recommendation.urgency]
        value = (
            f" Potential value: ${recommendation.potential_value:,.0f}."
            if recommendation.potential_value
            else ""
        )
        links = f" More info: {', '.join(recommendation.links)}." if recommendation.links else ""
        lines.append(
            f"  - {prefix} {recommendation.title} — {recommendation.description}{value}{links}"
        )
    if not lines:
        return "  - No new programs or benefits identified."
    return "\n".join(lines)
