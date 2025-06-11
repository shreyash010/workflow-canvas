import { useState } from 'react';
import { useStore } from './store';
import { ResultModal } from './components/ResultModal';

export const SubmitButton = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [result, setResult] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const { nodes, edges } = useStore((state) => ({
        nodes: state.nodes,
        edges: state.edges
    }));

    const handleSubmit = async () => {
        setIsModalOpen(true);
        setIsLoading(true);
        setError(null);
        setResult(null);

        try {
            // Prepare the pipeline data
            const pipelineData = {
                nodes: nodes,
                edges: edges
            };

            // Send data to backend
            const response = await fetch('http://localhost:8000/pipelines/parse', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(pipelineData),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const analysisResult = await response.json();
            setResult(analysisResult);

        } catch (err) {
            console.error('Error submitting pipeline:', err);
            setError('Failed to analyze pipeline. Please check your connection and try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setResult(null);
        setError(null);
    };

    return (
        <>
            <div className="flex items-center justify-center p-6 bg-white border-t border-gray-200">
                <button 
                    type="button"
                    onClick={handleSubmit}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-300"
                >
                    Submit
                </button>
            </div>

            <ResultModal
                isOpen={isModalOpen}
                onClose={closeModal}
                result={result}
                isLoading={isLoading}
                error={error}
            />
        </>
    );
}