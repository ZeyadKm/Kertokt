"""Generate findings and recommendations from report data."""

from __future__ import annotations

from typing import Iterable, List

from ..data_models import (
    CoverageBenefit,
    Finding,
    ProgramOpportunity,
    Recommendation,
    Severity,
    UtilityReport,
)


def analyze_contaminants(
    utility_report: UtilityReport,
    guideline_multiplier_high: float = 3.0,
    guideline_multiplier_medium: float = 1.5,
) -> List[Finding]:
    """Flag contaminants that exceed health guidelines or legal limits."""

    findings: List[Finding] = []
    for contaminant in utility_report.contaminants:
        severity = None
        message_parts: List[str] = []
        action = None

        if (
            contaminant.health_guideline_ppb is not None
            and contaminant.level_ppb > contaminant.health_guideline_ppb
        ):
            ratio = contaminant.level_ppb / contaminant.health_guideline_ppb
            if ratio >= guideline_multiplier_high:
                severity = Severity.HIGH
            elif ratio >= guideline_multiplier_medium:
                severity = Severity.MEDIUM
            else:
                severity = Severity.LOW
            message_parts.append(
                f"{contaminant.name} measured at {contaminant.level_ppb:.2f} ppb "
                f"vs. guideline {contaminant.health_guideline_ppb:.2f} ppb"
            )
            action = (
                "Request a utility follow-up test and consider installing a certified"
                " filter designed to remove the contaminant."
            )

        if (
            contaminant.legal_limit_ppb is not None
            and contaminant.level_ppb > contaminant.legal_limit_ppb
        ):
            severity = Severity.HIGH
            message_parts.append(
                f"Exceeds legal limit of {contaminant.legal_limit_ppb:.2f} ppb"
            )
            action = (
                "Document the exceedance and file a compliance inquiry with the utility"
                " or state regulator."
            )

        if severity is None:
            continue

        findings.append(
            Finding(
                source=f"{utility_report.utility} water quality",
                message="; ".join(message_parts),
                severity=severity,
                metric=contaminant.name,
                recommended_action=action,
            )
        )

    return findings


def analyze_programs(programs: Iterable[ProgramOpportunity]) -> List[Recommendation]:
    """Suggest actions for utility or warranty programs."""

    recommendations: List[Recommendation] = []
    for program in programs:
        if program.status and program.status.lower() not in {"open", "active"}:
            continue
        description = program.description or "Benefit available"
        if program.eligibility:
            description += f" Eligibility: {program.eligibility}."
        links = [program.url] if program.url else []
        recommendations.append(
            Recommendation(
                title=program.name,
                description=description,
                source="Utility program",
                potential_value=program.estimated_value,
                urgency=Severity.MEDIUM,
                links=links,
            )
        )
    return recommendations


def analyze_coverage_benefits(benefits: Iterable[CoverageBenefit]) -> List[Recommendation]:
    """Convert coverage benefits into actionable recommendations."""

    recommendations: List[Recommendation] = []
    for benefit in benefits:
        description = benefit.description
        if benefit.requirements:
            description += f" Requirements: {benefit.requirements}."
        links = [benefit.contact_url] if benefit.contact_url else []
        recommendations.append(
            Recommendation(
                title=f"Claim {benefit.name}",
                description=description,
                source=f"{benefit.provider} {benefit.plan_name} ({benefit.category})",
                potential_value=benefit.annual_value,
                urgency=Severity.LOW,
                links=links,
            )
        )
    return recommendations


__all__ = [
    "analyze_contaminants",
    "analyze_programs",
    "analyze_coverage_benefits",
]
