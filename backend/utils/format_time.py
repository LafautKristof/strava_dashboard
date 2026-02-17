def format_time(seconds: float) -> str:
    """Formateer seconden naar m:ss of h:mm:ss."""
    if not seconds or seconds <= 0:
        return "-"
    h, m, s = int(seconds // 3600), int((seconds % 3600) // 60), int(seconds % 60)
    return f"{h}:{m:02d}:{s:02d}" if h else f"{m}:{s:02d}"
