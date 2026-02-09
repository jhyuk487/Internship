import argparse
import asyncio
import json
import os
from datetime import datetime, time, timezone

from bson import json_util
from motor.motor_asyncio import AsyncIOMotorClient


def parse_date(value: str, end: bool = False) -> datetime:
    if "T" in value:
        return datetime.fromisoformat(value)
    date_only = datetime.fromisoformat(value)
    if end:
        return datetime.combine(date_only.date(), time(23, 59, 59, 999999))
    return datetime.combine(date_only.date(), time(0, 0, 0))


def build_output_path(fmt: str) -> str:
    ts = datetime.now(timezone.utc).strftime("%Y%m%d_%H%M%S")
    output_dir = os.path.join(os.path.dirname(__file__), "..", "exports")
    os.makedirs(output_dir, exist_ok=True)
    return os.path.join(output_dir, f"chat_feedback_{ts}.{fmt}")


async def export_feedback(args: argparse.Namespace) -> None:
    db_host = os.getenv("DB_HOST", "localhost")
    db_port = int(os.getenv("DB_PORT", 27017))
    db_name = os.getenv("DATABASE_NAME", "teamB")
    mongo_url = f"mongodb://{db_host}:{db_port}"

    client = AsyncIOMotorClient(mongo_url)
    db = client[db_name]

    query = {}
    if args.rating:
        query["rating"] = args.rating
    if args.model_name:
        query["model_name"] = args.model_name
    if args.start or args.end:
        created_at = {}
        if args.start:
            created_at["$gte"] = parse_date(args.start, end=False)
        if args.end:
            created_at["$lte"] = parse_date(args.end, end=True)
        query["created_at"] = created_at

    cursor = db["chat_feedback"].find(query).sort("created_at", 1)
    documents = await cursor.to_list(length=None)

    output_path = args.out or build_output_path(args.format)

    if args.format == "jsonl":
        with open(output_path, "w", encoding="utf-8") as f:
            for doc in documents:
                f.write(json_util.dumps(doc, ensure_ascii=False))
                f.write("\n")
    else:
        import csv

        fieldnames = [
            "id",
            "user_id",
            "chat_id",
            "message_index",
            "user_query",
            "ai_response",
            "rating",
            "feedback_text",
            "model_name",
            "prompt_version",
            "context_sources",
            "context_snippet",
            "response_hash",
            "session_id",
            "created_at",
        ]

        with open(output_path, "w", encoding="utf-8", newline="") as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            writer.writeheader()
            for doc in documents:
                writer.writerow(
                    {
                        "id": str(doc.get("_id")),
                        "user_id": doc.get("user_id"),
                        "chat_id": doc.get("chat_id"),
                        "message_index": doc.get("message_index"),
                        "user_query": doc.get("user_query"),
                        "ai_response": doc.get("ai_response"),
                        "rating": doc.get("rating"),
                        "feedback_text": doc.get("feedback_text"),
                        "model_name": doc.get("model_name"),
                        "prompt_version": doc.get("prompt_version"),
                        "context_sources": json.dumps(
                            doc.get("context_sources"), ensure_ascii=False
                        ),
                        "context_snippet": doc.get("context_snippet"),
                        "response_hash": doc.get("response_hash"),
                        "session_id": doc.get("session_id"),
                        "created_at": doc.get("created_at").isoformat()
                        if doc.get("created_at")
                        else "",
                    }
                )

    print(f"Exported {len(documents)} records to {output_path}")


def main() -> None:
    parser = argparse.ArgumentParser(description="Export chat feedback data.")
    parser.add_argument("--format", choices=["jsonl", "csv"], default="jsonl")
    parser.add_argument("--out", help="Output file path")
    parser.add_argument("--rating", choices=["like", "dislike"])
    parser.add_argument("--model-name", dest="model_name", help="Filter by model_name")
    parser.add_argument("--start", help="Start date (YYYY-MM-DD or ISO)")
    parser.add_argument("--end", help="End date (YYYY-MM-DD or ISO)")
    args = parser.parse_args()

    asyncio.run(export_feedback(args))


if __name__ == "__main__":
    main()
