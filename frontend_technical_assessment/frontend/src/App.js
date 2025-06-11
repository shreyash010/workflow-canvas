import { PipelineToolbar } from './toolbar';
import { PipelineUI } from './ui';
import { SubmitButton } from './submit';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col overflow-hidden">
      {/* Toolbar */}
      <div className="flex-shrink-0">
        <PipelineToolbar />
      </div>
      
      {/* Main Canvas */}
      <div className="flex-1 overflow-hidden">
        <PipelineUI />
      </div>
      
      {/* Submit Button */}
      <div className="flex-shrink-0">
        <SubmitButton />
      </div>
    </div>
  );
}

export default App;