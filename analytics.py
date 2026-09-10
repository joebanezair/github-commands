from statistics import mean

TICKETS = [
    {"id": 1, "priority": "medium", "status": "open", "resolution_minutes": None},
    {"id": 2, "priority": "high", "status": "resolved", "resolution_minutes": 42},
    {"id": 3, "priority": "low", "status": "resolved", "resolution_minutes": 18},
]


def build_report(tickets):
    resolved_times = [
        ticket["resolution_minutes"]
        for ticket in tickets
        if ticket["status"] == "resolved" and ticket["resolution_minutes"] is not None
    ]

    return {
        "total_tickets": len(tickets),
        "open_tickets": sum(ticket["status"] == "open" for ticket in tickets),
        "resolved_tickets": sum(ticket["status"] == "resolved" for ticket in tickets),
        "high_priority_tickets": sum(
            ticket["priority"] in {"high", "critical"} for ticket in tickets
        ),
        "average_resolution_minutes": round(mean(resolved_times), 1) if resolved_times else 0,
    }


def print_report(report):
    print("SupportOps Daily Report")
    print("=" * 24)
    for key, value in report.items():
        label = key.replace("_", " ").title()
        print(f"{label}: {value}")


if __name__ == "__main__":
    print_report(build_report(TICKETS))
