"""Command-line interface for the Kertokt consumer report analyzer."""

from __future__ import annotations

import argparse
from pathlib import Path
from typing import Iterable, List

from . import get_version
from .pipeline import AnalysisBundle, load_inputs, run_analysis
from .summaries import format_findings, format_recommendations

SAMPLE_DIR = Path(__file__).resolve().parents[2] / "data" / "sample_reports"


class CLIError(Exception):
    """Raised when CLI input is invalid."""


def _coerce_paths(values: Iterable[str]) -> List[Path]:
    return [Path(value).expanduser().resolve() for value in values]


def _load_sample_paths() -> tuple[Path, List[Path], List[Path]]:
    ewg = SAMPLE_DIR / "ewg_denver.json"
    utilities = [SAMPLE_DIR / "utility_denver.json"]
    coverage = [SAMPLE_DIR / "coverage_benefits.json"]
    return ewg, utilities, coverage


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="Analyze water-quality, utility, and coverage reports.",
    )
    parser.add_argument(
        "--ewg",
        type=Path,
        help="Path to an EWG-style JSON export.",
    )
    parser.add_argument(
        "--utility",
        nargs="*",
        default=[],
        type=Path,
        help="One or more utility report JSON files.",
    )
    parser.add_argument(
        "--coverage",
        nargs="*",
        default=[],
        type=Path,
        help="Coverage/benefit JSON files (insurance, warranty, etc.).",
    )
    parser.add_argument(
        "--sample",
        action="store_true",
        help="Use bundled sample data instead of providing file paths.",
    )
    parser.add_argument(
        "--version",
        action="version",
        version=f"kertokt {get_version()}",
    )
    return parser


def _validate_inputs(args: argparse.Namespace) -> tuple[Path, List[Path], List[Path]]:
    if args.sample:
        return _load_sample_paths()

    if args.ewg is None:
        raise CLIError("An --ewg path is required unless --sample is provided.")

    ewg_path = args.ewg.expanduser().resolve()
    utility_paths = _coerce_paths(args.utility) if args.utility else []
    coverage_paths = _coerce_paths(args.coverage) if args.coverage else []

    if not utility_paths:
        raise CLIError("Provide at least one --utility report or use --sample.")

    return ewg_path, utility_paths, coverage_paths


def _render(bundle: AnalysisBundle) -> str:
    summary_lines = [
        "=== Water Quality Findings ===",
        format_findings(bundle.findings),
        "",
        "=== Programs & Coverage Recommendations ===",
        format_recommendations(bundle.recommendations),
    ]
    return "\n".join(summary_lines)


def main(argv: Iterable[str] | None = None) -> int:
    parser = build_parser()
    args = parser.parse_args(list(argv) if argv is not None else None)

    try:
        ewg_path, utility_paths, coverage_paths = _validate_inputs(args)
    except CLIError as exc:  # pragma: no cover - CLI behavior
        parser.error(str(exc))

    ewg_report, utility_reports, coverage_reports = load_inputs(
        ewg_path,
        utility_paths,
        coverage_paths,
    )
    bundle = run_analysis(ewg_report, utility_reports, coverage_reports)
    print(_render(bundle))  # pragma: no cover - console output
    return 0


if __name__ == "__main__":  # pragma: no cover - CLI entry point
    raise SystemExit(main())
