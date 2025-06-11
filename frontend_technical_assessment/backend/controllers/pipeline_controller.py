from typing import List, Dict, Any
from collections import defaultdict, deque
from models.pipeline_models import Node, Edge, PipelineData


class PipelineController:
    """
    Controller class to handle pipeline-related business logic
    """
    
    @staticmethod
    def is_dag(nodes: List[Node], edges: List[Edge]) -> bool:
        """
        Check if the graph formed by nodes and edges is a Directed Acyclic Graph (DAG)
        using Kahn's algorithm (topological sort)
        """
        if not nodes:
            return True
        
        # Build adjacency list and in-degree count
        graph = defaultdict(list)
        in_degree = defaultdict(int)
        
        # Initialize all nodes with in-degree 0
        node_ids = {node.id for node in nodes}
        for node_id in node_ids:
            in_degree[node_id] = 0
        
        # Build the graph
        for edge in edges:
            if edge.source in node_ids and edge.target in node_ids:
                graph[edge.source].append(edge.target)
                in_degree[edge.target] += 1
        
        # Kahn's algorithm
        queue = deque([node_id for node_id in node_ids if in_degree[node_id] == 0])
        processed_count = 0
        
        while queue:
            current = queue.popleft()
            processed_count += 1
            
            # Reduce in-degree for all neighbors
            for neighbor in graph[current]:
                in_degree[neighbor] -= 1
                if in_degree[neighbor] == 0:
                    queue.append(neighbor)
        
        # If we processed all nodes, it's a DAG
        return processed_count == len(node_ids)
    
    @staticmethod
    def analyze_pipeline(pipeline_data: PipelineData) -> Dict[str, Any]:
        """
        Analyze the pipeline and return comprehensive results
        """
        nodes = pipeline_data.nodes
        edges = pipeline_data.edges
        
        num_nodes = len(nodes)
        num_edges = len(edges)
        is_dag_result = PipelineController.is_dag(nodes, edges)
        
        return {
            "num_nodes": num_nodes,
            "num_edges": num_edges,
            "is_dag": is_dag_result
        }