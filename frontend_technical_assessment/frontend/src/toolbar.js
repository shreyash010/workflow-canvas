import { useState } from 'react';
import { 
  Rocket, Bot, Zap, RotateCcw, Database, Send,
  Search 
} from 'lucide-react';
import { DraggableNode } from './draggableNode';
import { nodeRegistry } from './nodes/nodesFactory';

const categoryIcons = {
  Start: Rocket,
  LLMs: Bot,
  Transform: Zap,
  Logic: RotateCcw,
  Data: Database,
  Output: Send,
};

const buildNodeCategories = () => {
  const categories = {};
  
  Object.entries(nodeRegistry).forEach(([nodeType, NodeClass]) => {
    // Create an instance to get the metadata
    const nodeInstance = new NodeClass(`temp-${nodeType}`);
    const {title , category, icon} = nodeInstance.getBasicNodeInfo();
    
    // Initialize category if it doesn't exist
    if (!categories[category]) {
      categories[category] = {
        icon: categoryIcons[category] || Bot, // Use centralized category icon
        nodes: []
      };
    }
    
    // Add node to category
    categories[category].nodes.push({
      type: nodeType,
      label: title,
      icon: icon
    });
  });
  
  return categories;
};

export const PipelineToolbar = () => {
  const [activeCategory, setActiveCategory] = useState('Start');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Build categories dynamically
  const nodeCategories = buildNodeCategories();

  const filteredNodes = searchTerm 
    ? Object.values(nodeCategories).flatMap(category => 
        category.nodes.filter(node => 
          node.label.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    : nodeCategories[activeCategory]?.nodes || [];

  return (
    <div className="bg-white rounded-lg p-4 m-4 shadow-sm border border-gray-200 w-95vw">
      {/* Search Bar and Category Tabs Row */}
      <div className="flex items-center gap-4 mb-4">
        {/* Search Bar */}
        <div className="relative w-48">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3" />
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-2 text-xs rounded-md border border-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>

        {/* Category Tabs */}
        {!searchTerm && (
          <div className="flex gap-1">
            {Object.entries(nodeCategories).map(([category, config]) => {
              const IconComponent = config.icon;
              const isActive = activeCategory === category;
              
              return (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`
                    flex items-center gap-1 px-3 py-2 rounded-md text-xs font-medium
                    transition-colors duration-150
                    ${isActive 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-600 hover:bg-gray-100'
                    }
                  `}
                >
                  <IconComponent className="w-3 h-3" />
                  {category}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Nodes Grid */}
      <div className="flex flex-wrap gap-2"> 
        {filteredNodes.map((node, index) => {
          return (
            <DraggableNode
              key={`${node.type}-${index}`}
              type={node.type}
              label={node.label}
              icon={node.icon}
            />
          );
        })}
      </div>
    </div>
  );
};