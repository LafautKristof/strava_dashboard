from datetime import datetime, timedelta, timezone


def get_after_date_from_range(range_weeks) -> datetime:
    now = datetime.now(timezone.utc)
    start_of_current_week = datetime.fromisocalendar(
        now.year, now.isocalendar().week, 1
    ).replace(tzinfo=timezone.utc)

    return start_of_current_week - timedelta(weeks=range_weeks - 1)
