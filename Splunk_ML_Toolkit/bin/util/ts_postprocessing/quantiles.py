from __future__ import annotations

from decimal import Decimal, InvalidOperation


def mirror_quantile(q: float) -> float:
    """Return the complementary quantile using decimal-safe arithmetic."""
    try:
        quantile = Decimal(str(q))
    except InvalidOperation as err:
        raise ValueError(f"Invalid quantile value: {q!r}") from err
    if quantile <= 0 or quantile >= 1:
        raise ValueError(f"Quantile value must be in (0, 1), got {q!r}.")
    mirrored = Decimal("1") - quantile
    return float(mirrored.normalize())


def infer_paired_lower_quantile_field(upper_field: str) -> str:
    """Infer paired lower quantile field from an upper quantile field name."""
    prefix = "quantile_"
    if not upper_field.startswith(prefix):
        raise ValueError(
            f"Unable to infer lower quantile field from '{upper_field}'. "
            "Expected format: quantile_<q> (for example quantile_0_99)."
        )
    raw_q = upper_field[len(prefix) :].replace("_", ".")
    lower_q = mirror_quantile(float(raw_q))
    lower_str = format(Decimal(str(lower_q)).normalize(), "f")
    return f"{prefix}{lower_str.replace('.', '_')}"
