#!/usr/bin/env python3
"""
swap_gh_state.py

Swaps between CONGESTED and OPTIMIZED Grasshopper states based on slider value.
Keeps Emission Goal Tracker and PM2.5 Bar Chart in sync with pre-recorded Grasshopper video.

Usage:
    python swap_gh_state.py --state CONGESTED
    python swap_gh_state.py --state OPTIMIZED
    python swap_gh_state.py --tax 0     # Auto-selects CONGESTED (tax < 50)
    python swap_gh_state.py --tax 100   # Auto-selects OPTIMIZED (tax >= 50)
"""

import argparse
import shutil
import os
from pathlib import Path

# File paths
SCRIPT_DIR = Path(__file__).parent
CONGESTED_FILE = SCRIPT_DIR / "gh_state_CONGESTED.csv"
OPTIMIZED_FILE = SCRIPT_DIR / "gh_state_OPTIMIZED.csv"
OUTPUT_FILE = SCRIPT_DIR / "gh_input.csv"

# State thresholds
TAX_THRESHOLD = 50  # Below this = CONGESTED, at/above = OPTIMIZED


def swap_to_state(state: str) -> None:
    """
    Copy the appropriate state file to gh_input.csv

    Args:
        state: Either 'CONGESTED' or 'OPTIMIZED'
    """
    state = state.upper()

    if state == "CONGESTED":
        source = CONGESTED_FILE
        print(f"[CONGESTED] Switching to CONGESTED state (speed: 5.6 mph, PM2.5 radius: 75, risk: 0.9)")
    elif state == "OPTIMIZED":
        source = OPTIMIZED_FILE
        print(f"[OPTIMIZED] Switching to OPTIMIZED state (speed: 60 mph, PM2.5 radius: 30, risk: 0.2)")
    else:
        raise ValueError(f"Invalid state: {state}. Must be 'CONGESTED' or 'OPTIMIZED'")

    if not source.exists():
        raise FileNotFoundError(f"Source file not found: {source}")

    # Copy the file
    shutil.copy2(source, OUTPUT_FILE)
    print(f"[SUCCESS] Copied {source.name} -> {OUTPUT_FILE.name}")
    print(f"[SUCCESS] Grasshopper animation state updated!")


def swap_by_tax_amount(tax_amount: float) -> None:
    """
    Automatically select state based on tax amount slider value

    Args:
        tax_amount: Tax amount from slider (0-100)
    """
    if tax_amount < TAX_THRESHOLD:
        state = "CONGESTED"
    else:
        state = "OPTIMIZED"

    print(f"[TAX] Tax amount: ${tax_amount}")
    print(f"[TAX] Threshold: ${TAX_THRESHOLD} (below = CONGESTED, at/above = OPTIMIZED)")
    swap_to_state(state)


def main():
    parser = argparse.ArgumentParser(
        description="Swap Grasshopper CSV states based on dashboard slider",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python swap_gh_state.py --state CONGESTED
  python swap_gh_state.py --state OPTIMIZED
  python swap_gh_state.py --tax 0
  python swap_gh_state.py --tax 75
  python swap_gh_state.py --tax 100
        """
    )

    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument(
        "--state",
        choices=["CONGESTED", "OPTIMIZED", "congested", "optimized"],
        help="Explicitly set state (CONGESTED or OPTIMIZED)"
    )
    group.add_argument(
        "--tax",
        type=float,
        help=f"Tax amount from slider (0-100). Auto-selects state based on threshold ({TAX_THRESHOLD})"
    )

    args = parser.parse_args()

    try:
        if args.state:
            swap_to_state(args.state)
        elif args.tax is not None:
            if not 0 <= args.tax <= 100:
                parser.error("Tax amount must be between 0 and 100")
            swap_by_tax_amount(args.tax)
    except Exception as e:
        print(f"[ERROR] {e}")
        return 1

    return 0


if __name__ == "__main__":
    exit(main())
