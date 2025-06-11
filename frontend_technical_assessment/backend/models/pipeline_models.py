from pydantic import BaseModel
from typing import List, Dict, Any


class Node(BaseModel):
    id: str
    type: str
    position: Dict[str, float]
    data: Dict[str, Any]


class Edge(BaseModel):
    id: str
    source: str
    target: str
    type: str = None
    animated: bool = None
    markerEnd: Dict[str, Any] = None


class PipelineData(BaseModel):
    nodes: List[Node]
    edges: List[Edge]