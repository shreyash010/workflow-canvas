from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from controllers.pipeline_controller import PipelineController
from models.pipeline_models import PipelineData

app = FastAPI(title="Pipeline API", version="1.0.0")

# Add CORS middleware to allow frontend connections
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get('/')
def read_root():
    return {'Ping': 'Pong'}


@app.post('/pipelines/parse')
def parse_pipeline(pipeline_data: PipelineData):
    """
    Parse the pipeline and return analysis results
    """
    try:
        result = PipelineController.analyze_pipeline(pipeline_data)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing pipeline: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)