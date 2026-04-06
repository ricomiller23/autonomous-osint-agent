from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field, HttpUrl
from datetime import datetime
from uuid import UUID, uuid4

class Source(BaseModel):
    id: UUID = Field(default_factory=uuid4)
    url: Optional[HttpUrl] = None
    title: Optional[str] = None
    reliability_score: float = Field(default=0.5, ge=0, le=1.0)
    timestamp: datetime = Field(default_factory=datetime.now)
    content_hash: Optional[str] = None

class Entity(BaseModel):
    id: UUID = Field(default_factory=uuid4)
    name: str
    type: str  # e.g., "Company", "Person", "Domain", "Technology"
    normalized_name: str
    metadata: Dict[str, Any] = Field(default_factory=dict)
    confidence: float = Field(default=0.0, ge=0, le=1.0)
    source_ids: List[UUID] = Field(default_factory=list)

class Relationship(BaseModel):
    id: UUID = Field(default_factory=uuid4)
    source_entity_id: UUID
    target_entity_id: UUID
    type: str  # e.g., "OWNS", "EMPLOYED_BY", "AFFILIATED_WITH"
    confidence: float = Field(default=0.0, ge=0, le=1.0)
    metadata: Dict[str, Any] = Field(default_factory=dict)
    source_ids: List[UUID] = Field(default_factory=list)

class Event(BaseModel):
    id: UUID = Field(default_factory=uuid4)
    entity_id: UUID
    event_type: str
    description: str
    timestamp: datetime
    source_ids: List[UUID] = Field(default_factory=list)

class Contradiction(BaseModel):
    claim: str
    source_a: str
    source_b: str
    resolution_status: str = "Unresolved"
    severity: str = "Medium"

class IntelligenceReport(BaseModel):
    id: UUID = Field(default_factory=uuid4)
    target: str
    entity_summary: Dict[str, Any]
    key_entities: List[Entity]
    relationships: List[Relationship]
    timeline: List[Event]
    risks: List[Dict[str, Any]]
    opportunities: List[Dict[str, Any]]
    contradictions: List[Contradiction]
    confidence_summary: Dict[str, Any]
    recommended_next_actions: List[str]
    created_at: datetime = Field(default_factory=datetime.now)
