"""Analysis helpers that transform raw data into insights."""

from .recommendations import (
    analyze_contaminants,
    analyze_programs,
    analyze_coverage_benefits,
)

__all__ = [
    "analyze_contaminants",
    "analyze_programs",
    "analyze_coverage_benefits",
]
