"""Orchestrates ingestion and analysis for consumer reports."""

from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
from typing import Iterable, List, Sequence

from .analysis import (
    analyze_contaminants,
    analyze_coverage_benefits,
    analyze_programs,
)
from .data_models import (
    CoverageReport,
    EWGReport,
    Finding,
    Recommendation,
    Severity,
    UtilityReport,
)
from .ingestion import load_coverage_report, load_ewg_report, load_utility_report


@dataclass
class AnalysisBundle:
    """Collection of findings and recommendations for output."""

    findings: List[Finding]
    recommendations: List[Recommendation]
    ewg_report: EWGReport
    utility_reports: Sequence[UtilityReport]
    coverage_reports: Sequence[CoverageReport]


def load_inputs(
    ewg_path: Path,
    utility_paths: Iterable[Path],
    coverage_paths: Iterable[Path],
) -> tuple[EWGReport, List[UtilityReport], List[CoverageReport]]:
    """Load input documents from disk."""

    ewg_report = load_ewg_report(Path(ewg_path))
    utility_reports = [load_utility_report(Path(path)) for path in utility_paths]
    coverage_reports = [load_coverage_report(Path(path)) for path in coverage_paths]
    return ewg_report, utility_reports, coverage_reports


def run_analysis(
    ewg_report: EWGReport,
    utility_reports: Iterable[UtilityReport],
    coverage_reports: Iterable[CoverageReport],
) -> AnalysisBundle:
    """Generate findings and recommendations for provided reports."""

    findings: List[Finding] = []
    recommendations: List[Recommendation] = []

    for utility in utility_reports:
        findings.extend(analyze_contaminants(utility))
        recommendations.extend(analyze_programs(utility.programs))

    for coverage in coverage_reports:
        recommendations.extend(analyze_coverage_benefits(coverage.benefits))

    # De-duplicate recommendations by title + source to avoid repeats.
    unique: dict[tuple[str, str], Recommendation] = {}
    def _severity_rank(severity: Severity) -> int:
        return {Severity.LOW: 0, Severity.MEDIUM: 1, Severity.HIGH: 2}[severity]

    for recommendation in recommendations:
        key = (recommendation.title, recommendation.source)
        existing = unique.get(key)
        if existing is None:
            unique[key] = recommendation
        else:
            # Prefer higher potential value and urgency if duplicates exist.
            if (
                (recommendation.potential_value or 0)
                > (existing.potential_value or 0)
            ):
                unique[key] = recommendation
            elif _severity_rank(recommendation.urgency) > _severity_rank(
                existing.urgency
            ):
                unique[key] = recommendation

    return AnalysisBundle(
        findings=findings,
        recommendations=list(unique.values()),
        ewg_report=ewg_report,
        utility_reports=list(utility_reports),
        coverage_reports=list(coverage_reports),
    )
