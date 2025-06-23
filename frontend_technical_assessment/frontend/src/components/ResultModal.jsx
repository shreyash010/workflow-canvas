import { CheckCircle, XCircle, Network, GitBranch, Loader } from 'lucide-react';

export const ResultModal = ({ isOpen, onClose, result, isLoading, error }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all duration-300 scale-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Network className="w-6 h-6" />
              <h2 className="text-xl font-bold">Pipeline Analysis</h2>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors duration-200"
            >
              <XCircle className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <Loader className="w-8 h-8 animate-spin text-blue-500" />
              <span className="ml-3 text-gray-600">Analyzing pipeline...</span>
            </div>
          )}

          {error && (
            <div className="flex items-center space-x-3 p-4 bg-red-50 rounded-lg border border-red-200">
              <XCircle className="w-8 h-8 text-red-500 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-red-800">Error</h3>
                <p className="text-red-600 text-sm mt-1">{error}</p>
              </div>
            </div>
          )}

          {result && !isLoading && !error && (
            <div className="space-y-4">
              {/* Success/Warning indicator */}
              <div className={`flex items-center space-x-3 p-4 rounded-lg border ${
                result.is_dag 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-yellow-50 border-yellow-200'
              }`}>
                {result.is_dag ? (
                  <CheckCircle className="w-8 h-8 text-green-500 flex-shrink-0" />
                ) : (
                  <XCircle className="w-8 h-8 text-yellow-500 flex-shrink-0" />
                )}
                <div>
                  <h3 className={`font-semibold ${
                    result.is_dag ? 'text-green-800' : 'text-yellow-800'
                  }`}>
                    {result.is_dag ? 'Valid Pipeline' : 'Invalid Pipeline'}
                  </h3>
                  <p className={`text-sm mt-1 ${
                    result.is_dag ? 'text-green-600' : 'text-yellow-600'
                  }`}>
                    {result.is_dag 
                      ? 'Your pipeline forms a valid directed acyclic graph'
                      : 'Your pipeline contains cycles and is not a valid DAG'
                    }
                  </p>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-blue-700 font-medium">Nodes</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-800 mt-1">{result.num_nodes}</p>
                </div>
                
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <div className="flex items-center space-x-2">
                    <GitBranch className="w-3 h-3 text-purple-500" />
                    <span className="text-purple-700 font-medium">Connections</span>
                  </div>
                  <p className="text-2xl font-bold text-purple-800 mt-1">{result.num_edges}</p>
                </div>
              </div>

              {/* Additional info */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h4 className="font-medium text-gray-800 mb-2">Pipeline Summary</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>• Total components: {result.num_nodes}</p>
                  <p>• Data connections: {result.num_edges}</p>
                  <p>• Structure: {result.is_dag ? 'Acyclic (✓)' : 'Contains cycles (⚠)'}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 rounded-b-2xl">
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};