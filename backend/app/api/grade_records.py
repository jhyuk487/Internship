from fastapi import APIRouter, Depends
from datetime import datetime
from app.auth.router import get_current_user
from app.database.models import GradeRecord, GradeCourseEntry
from app.models.schemas import GradeRecordUpdate, GradeRecordResponse, GradeCourseSchema

router = APIRouter()

def normalize_terms(raw_terms):
    if not isinstance(raw_terms, dict):
        return {}
    terms = {}
    for term, entries in raw_terms.items():
        normalized = []
        for entry in entries or []:
            if entry is None:
                continue
            if isinstance(entry, GradeCourseEntry):
                data = entry.model_dump() if hasattr(entry, "model_dump") else entry.dict()
            elif isinstance(entry, dict):
                data = entry
            else:
                # Skip invalid entry shapes
                continue
            if data.get("credits") is None:
                data["credits"] = 0
            if data.get("grade") is None:
                data["grade"] = "A"
            try:
                normalized.append(GradeCourseEntry(**data))
            except Exception:
                continue
        terms[term] = normalized
    return terms

def serialize_terms(raw_terms):
    terms = {}
    for term, entries in (raw_terms or {}).items():
        serialized = []
        for entry in entries or []:
            if entry is None:
                continue
            if isinstance(entry, GradeCourseEntry):
                data = entry.model_dump() if hasattr(entry, "model_dump") else entry.dict()
            elif isinstance(entry, dict):
                data = entry
            else:
                continue
            serialized.append(GradeCourseSchema(**data))
        terms[term] = serialized
    return terms


@router.get("/me", response_model=GradeRecordResponse)
async def get_my_grade_record(current_user: str = Depends(get_current_user)):
    record = await GradeRecord.find_one(GradeRecord.user_id == current_user)
    if record:
        terms = serialize_terms(record.terms)
        return GradeRecordResponse(
            user_id=record.user_id,
            terms=terms,
            updated_at=record.updated_at
        )
    return GradeRecordResponse(user_id=current_user, terms={}, updated_at=datetime.utcnow())


@router.put("/me", response_model=GradeRecordResponse)
async def upsert_my_grade_record(
    payload: GradeRecordUpdate,
    current_user: str = Depends(get_current_user)
):
    payload_dict = payload.model_dump() if hasattr(payload, "model_dump") else payload.dict()
    raw_terms = payload_dict.get("terms", {})
    terms = normalize_terms(raw_terms)
    record = await GradeRecord.find_one(GradeRecord.user_id == current_user)
    if record:
        record.terms = terms
        record.updated_at = datetime.utcnow()
        await record.save()
    else:
        record = GradeRecord(
            user_id=current_user,
            terms=terms,
            updated_at=datetime.utcnow()
        )
        await record.insert()

    return GradeRecordResponse(
        user_id=record.user_id,
        terms=serialize_terms(record.terms),
        updated_at=record.updated_at
    )
