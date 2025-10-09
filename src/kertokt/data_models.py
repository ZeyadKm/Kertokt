"""Dataclasses that describe report inputs and actionable insights."""

from __future__ import annotations

from dataclasses import dataclass, field
from enum import Enum
from typing import List, Optional


class Severity(str, Enum):
    """Severity levels for findings and recommendations."""

    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"


@dataclass
class Contaminant:
    """Represents a contaminant measurement."""

    name: str
    level_ppb: float
    health_guideline_ppb: Optional[float] = None
    legal_limit_ppb: Optional[float] = None
    detected_in: Optional[str] = None
    notes: Optional[str] = None


@dataclass
class ProgramOpportunity:
    """Utility or warranty program that a customer can leverage."""

    name: str
    description: str
    category: str
    estimated_value: Optional[float] = None
    enrollment_deadline: Optional[str] = None
    url: Optional[str] = None
    status: Optional[str] = None
    eligibility: Optional[str] = None


@dataclass
class CoverageBenefit:
    """Benefit that may exist in insurance or warranty coverage."""

    provider: str
    plan_name: str
    category: str
    name: str
    description: str
    annual_value: Optional[float] = None
    requirements: Optional[str] = None
    contact_url: Optional[str] = None


@dataclass
class EWGReport:
    """Data parsed from an Environmental Working Group report."""

    utility: str
    contaminants: List[Contaminant]
    year: Optional[int] = None


@dataclass
class UtilityReport:
    """Data parsed from a municipal utility report."""

    utility: str
    contaminants: List[Contaminant]
    programs: List[ProgramOpportunity] = field(default_factory=list)
    report_year: Optional[int] = None
    customer_support_url: Optional[str] = None


@dataclass
class CoverageReport:
    """Aggregated coverage benefits."""

    benefits: List[CoverageBenefit]


@dataclass
class Finding:
    """An insight derived from raw report data."""

    source: str
    message: str
    severity: Severity
    metric: Optional[str] = None
    recommended_action: Optional[str] = None
    estimated_value: Optional[float] = None


@dataclass
class Recommendation:
    """Actionable suggestion for the customer."""

    title: str
    description: str
    source: str
    potential_value: Optional[float] = None
    urgency: Severity = Severity.MEDIUM
    links: List[str] = field(default_factory=list)
