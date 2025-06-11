import { create } from "zustand";
import {
    addEdge,
    applyNodeChanges,
    applyEdgeChanges,
    MarkerType,
  } from 'reactflow';

export const useStore = create((set, get) => ({
    nodes: [],
    edges: [],
    nodeIDs: {},
    usedIDs: new Set(), // Track all used IDs
    
    getNodeID: (type) => {
        const state = get();
        const usedIDs = state.usedIDs;
        
        // Find the lowest available number for this type
        let counter = 1;
        let newID;
        
        do {
            newID = `${type}-${counter}`;
            counter++;
        } while (usedIDs.has(newID));
        
        // Add the new ID to used IDs
        const newUsedIDs = new Set(usedIDs);
        newUsedIDs.add(newID);
        
        set({ usedIDs: newUsedIDs });
        return newID;
    },
    
    addNode: (node) => {
        set({
            nodes: [...get().nodes, node]
        });
    },
    
    onNodesChange: (changes) => {
      set({
        nodes: applyNodeChanges(changes, get().nodes),
      });
    },
    
    onEdgesChange: (changes) => {
      set({
        edges: applyEdgeChanges(changes, get().edges),
      });
    },
    
    onConnect: (connection) => {
      set({
        edges: addEdge({
          ...connection, 
          type: 'smoothstep', 
          animated: true, 
          markerEnd: {type: MarkerType.Arrow, height: '20px', width: '20px'}
        }, get().edges),
      });
    },
    
    updateNodeField: (nodeId, fieldName, fieldValue) => {
      set({
        nodes: get().nodes.map((node) => {
          if (node.id === nodeId) {
            node.data = { ...node.data, [fieldName]: fieldValue };
          }
          return node;
        }),
      });
    },
    
    removeNode: (nodeId) => {
      const { nodes, edges, usedIDs } = get();

      const filteredNodes = nodes.filter((node) => node.id !== nodeId);
      const filteredEdges = edges.filter((edge) => edge.source !== nodeId && edge.target !== nodeId);
      
      // Remove the ID from used IDs so it can be reused
      const newUsedIDs = new Set(usedIDs);
      newUsedIDs.delete(nodeId);

      set({
        nodes: filteredNodes,
        edges: filteredEdges,
        usedIDs: newUsedIDs
      });
    },
    
    removeEdge: (edgeId) => {
      const { edges } = get();
      const filteredEdges = edges.filter(edge => edge.id !== edgeId);
      
      set({
        edges: filteredEdges
      });
    },
    
    // Method to update node name/ID
    updateNodeName: (oldNodeId, newNodeId) => {
      const { nodes, edges, usedIDs } = get();
      
      // Check if new ID is already used
      if (usedIDs.has(newNodeId) && newNodeId !== oldNodeId) {
        return false; // Name already exists
      }
      
      // Update usedIDs
      const newUsedIDs = new Set(usedIDs);
      newUsedIDs.delete(oldNodeId);
      newUsedIDs.add(newNodeId);
      
      // Update nodes
      const updatedNodes = nodes.map(node => {
        if (node.id === oldNodeId) {
          return { ...node, id: newNodeId, data: { ...node.data, id: newNodeId } };
        }
        return node;
      });
      
      // Update edges
      const updatedEdges = edges.map(edge => {
        const newEdge = { ...edge };
        if (edge.source === oldNodeId) {
          newEdge.source = newNodeId;
          newEdge.sourceHandle = edge.sourceHandle?.replace(oldNodeId, newNodeId);
        }
        if (edge.target === oldNodeId) {
          newEdge.target = newNodeId;
          newEdge.targetHandle = edge.targetHandle?.replace(oldNodeId, newNodeId);
        }
        return newEdge;
      });
      
      set({
        nodes: updatedNodes,
        edges: updatedEdges,
        usedIDs: newUsedIDs
      });
      
      return true; // Success
    }
  }));