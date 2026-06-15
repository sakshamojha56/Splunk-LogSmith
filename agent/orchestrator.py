"""
Orchestrator — the core agent loop.
Takes a raw log sample, uses MCP to get real examples from Splunk,
uses Gemini to propose + iteratively refine extraction regexes,
and returns a validated field map ready for TA generation.
"""
import asyncio
from rich.console import Console
from rich.progress import Progress, SpinnerColumn, TextColumn, BarColumn
from rich.table import Table
from rich import print as rprint

from agent.mcp_client import get_raw_events, test_rex_extraction
from agent.regex_proposer import propose_regex, refine_regex, classify_pii_fields

console = Console()

MAX_ITERATIONS = 5
TARGET_MATCH_RATE = 0.95


async def run_agent(
    log_sample: str,
    index: str = "main",
    search_terms: str = "*",
    on_progress=None,   # optional callback(step: str, data: dict)
) -> dict:
    """
    Main agent loop. Returns:
    {
      "fields": [
        {
          "name": str,
          "regex": str,
          "match_rate": float,
          "matched": int,
          "total": int,
          "is_pii": bool,
          "pii_type": str | None,
          "description": str,
          "iterations": int,
        }
      ],
      "index": str,
      "log_sample": str,
    }
    """
    def emit(step: str, data: dict):
        if on_progress:
            on_progress(step, data)

    # ── Step 1: Fetch real examples from Splunk via MCP ──────────────────────
    emit("fetching", {"message": "Fetching real log examples from Splunk via MCP..."})
    console.print("\n[bold cyan]Step 1:[/bold cyan] Fetching real examples from Splunk index...")

    real_examples = await get_raw_events(index=index, search_terms=search_terms, max_results=100)

    if not real_examples:
        console.print("[yellow]Warning:[/yellow] No real examples found. Using provided log sample only.")
        real_examples = [log_sample]
    else:
        console.print(f"[green]✓[/green] Fetched {len(real_examples)} real log events from index '{index}'")

    emit("fetched", {"count": len(real_examples)})

    # ── Step 2: Propose initial regexes via Gemini ────────────────────────────
    emit("proposing", {"message": "Asking Gemini to propose field extraction regexes..."})
    console.print("\n[bold cyan]Step 2:[/bold cyan] Asking Gemini to propose field extraction regexes...")

    proposed_fields = await propose_regex(log_sample, real_examples)
    console.print(f"[green]✓[/green] Proposed {len(proposed_fields)} fields: {[f['name'] for f in proposed_fields]}")
    emit("proposed", {"fields": [f["name"] for f in proposed_fields]})

    # ── Step 3: Iteratively validate & refine each regex ─────────────────────
    console.print(f"\n[bold cyan]Step 3:[/bold cyan] Validating regexes against Splunk (target: {TARGET_MATCH_RATE:.0%} match rate)...")

    results = []

    for field in proposed_fields:
        field_name = field["name"]
        regex = field["regex"]
        iterations = 0

        console.print(f"\n  [bold]Field:[/bold] {field_name}")

        while iterations < MAX_ITERATIONS:
            iterations += 1
            emit("testing", {"field": field_name, "iteration": iterations, "regex": regex})

            validation = await test_rex_extraction(
                index=index,
                regex=regex,
                field_name=field_name,
                search_terms=search_terms,
            )
            await asyncio.sleep(1.5) # Artificial delay for realistic UI streaming

            match_rate = validation["match_rate"]
            matched = validation["matched"]
            total = validation["total"]

            # Color-coded match rate display
            rate_color = "green" if match_rate >= 0.95 else "yellow" if match_rate >= 0.7 else "red"
            console.print(
                f"    Iteration {iterations}: [{rate_color}]{match_rate:.1%}[/{rate_color}] "
                f"({matched}/{total} events matched)"
            )

            emit("tested", {
                "field": field_name,
                "iteration": iterations,
                "match_rate": match_rate,
                "matched": matched,
                "total": total,
            })

            if match_rate >= TARGET_MATCH_RATE or total == 0:
                console.print(f"    [green]✓ Field '{field_name}' validated![/green]")
                break

            # Refine if not meeting target
            if iterations < MAX_ITERATIONS:
                console.print(f"    [yellow]Refining regex (iteration {iterations})...[/yellow]")
                emit("refining", {"field": field_name, "iteration": iterations})
                regex = await refine_regex(
                    original_regex=regex,
                    field_name=field_name,
                    unmatched_samples=validation["unmatched_samples"],
                    match_rate=match_rate,
                )

        results.append({
            "name": field_name,
            "regex": regex,
            "match_rate": validation.get("match_rate", 0.0),
            "matched": validation.get("matched", 0),
            "total": validation.get("total", 0),
            "description": field.get("description", ""),
            "iterations": iterations,
            "is_pii": False,
            "pii_type": None,
        })

    # ── Step 4: PII Classification ────────────────────────────────────────────
    emit("classifying", {"message": "Classifying fields for PII..."})
    console.print("\n[bold cyan]Step 4:[/bold cyan] Classifying fields for PII/sensitive data...")

    results = await classify_pii_fields(results)

    pii_count = sum(1 for f in results if f.get("is_pii"))
    console.print(f"[green]✓[/green] {pii_count} PII fields identified")

    # ── Step 5: Print summary table ───────────────────────────────────────────
    table = Table(title="Extraction Results", show_header=True, header_style="bold magenta")
    table.add_column("Field", style="cyan")
    table.add_column("Match Rate", justify="right")
    table.add_column("Matched/Total", justify="right")
    table.add_column("Iterations", justify="center")
    table.add_column("PII", justify="center")

    for f in results:
        rate = f["match_rate"]
        rate_str = f"{rate:.1%}"
        rate_style = "green" if rate >= 0.95 else "yellow" if rate >= 0.7 else "red"
        pii_badge = f"[red]⚠ {f['pii_type']}[/red]" if f.get("is_pii") else "[dim]no[/dim]"
        table.add_row(
            f["name"],
            f"[{rate_style}]{rate_str}[/{rate_style}]",
            f"{f['matched']}/{f['total']}",
            str(f["iterations"]),
            pii_badge,
        )

    console.print("\n")
    console.print(table)

    emit("done", {"fields": results})

    return {
        "fields": results,
        "index": index,
        "log_sample": log_sample,
    }
