# Technical Context: Construction AI Proposal

## System Architecture (KG-Centered)

The proposal uses a **Knowledge Graph-centered architecture** where:
1. Plan facts are extracted from drawings (PDF/CAD/images)
2. Facts are stored in Neo4j with provenance and confidence
3. LLM-driven agents query the KG to infer assemblies and validate compliance
4. Deterministic optimizers compute cut lists with waste minimization
5. Outputs include BOM, cut lists, fastener lists, and build instructions

### Core Components

| Component | Technology | Status |
|-----------|------------|--------|
| Plan Parsing | PyMuPDF, ezdxf, LibreDWG | Complete |
| Object Detection | YOLOv8 (ultralytics) | Partial |
| Scale Detection | Google Gemini Vision | Complete |
| Knowledge Graph | Neo4j | **New** |
| Agent Orchestration | LangChain + Claude/GPT-4 | **New** |
| Cut Optimization | OR-Tools / PuLP | **New** |
| Web Interface | React + FastAPI | Complete |
| Database | PostgreSQL | Complete |

### Knowledge Graph Schema

```
Project ─hasSheet─► PlanSheet
PlanSheet ─mentions─► PlanFact (with provenance)
PlanFact ─instantiates─► AssemblyIntent
AssemblyIntent ─composedOf─► Component
Component ─builtFrom─► StockItem
StockItem ─cutInto─► CutPiece
Component ─requiresFastener─► FastenerRule
Component ─constrainedBy─► CodeRule
Project ─usesSupplierMapping─► SupplierCatalogItem
```

### Agent Workflow

1. **Extraction QA Agent** - Validates geometry/text, flags low-confidence items
2. **Component Inference Agent** - Maps plan facts to assemblies using KG rules
3. **Code & Compliance Agent** - Checks against IRC/IBC codes with citations
4. **Procurement & Cut Agent** - Selects stock and calls optimizer
5. **Instruction Generation Agent** - Generates build instructions with code refs

## Technologies and Frameworks

### AI/ML Technologies

#### Computer Vision
- **Object Detection**: YOLO, Detectron2 for PPE/hazard detection
- **Image Segmentation**: For progress monitoring and defect detection
- **Video Analytics**: Real-time processing for safety monitoring
- **Drone Integration**: Automated site surveys and progress capture

#### Natural Language Processing
- **Document Processing**: OCR + LLM for contract/spec extraction
- **Named Entity Recognition**: For extracting key project data
- **Semantic Search**: Vector embeddings for document retrieval
- **LLMs**: GPT-4, Claude for analysis and summarization

#### Predictive Analytics
- **Time Series Forecasting**: For schedule and cost prediction
- **Classification Models**: Risk categorization
- **Regression Models**: Cost estimation
- **Ensemble Methods**: Improved prediction accuracy

### Integration Points

#### Common Construction Software
- **BIM Platforms**: Autodesk Revit, Navisworks, Bentley
- **Project Management**: Procore, PlanGrid, Bluebeam
- **ERP Systems**: SAP, Oracle, Viewpoint
- **Scheduling**: Primavera P6, Microsoft Project
- **Document Management**: Aconex, SharePoint

#### Data Sources
- **IoT Sensors**: Environmental, equipment, wearables
- **Cameras/Drones**: Site imagery and video
- **Project Documents**: Contracts, drawings, RFIs, submittals
- **Historical Data**: Past project performance
- **External Data**: Weather, market rates, regulations

### Infrastructure Considerations

#### Cloud Platforms
- **AWS**: SageMaker, Rekognition, Comprehend
- **Google Cloud**: Vertex AI, Vision AI, Document AI
- **Azure**: Azure ML, Cognitive Services
- **Hybrid**: On-premise + cloud for sensitive data

#### Edge Computing
- Site-based processing for real-time applications
- Reduced latency for safety-critical systems
- Offline capability for remote sites
- Data preprocessing before cloud upload

## Development Environment

### Recommended Stack
```
AI/ML Development:
- Python 3.10+
- PyTorch / TensorFlow
- Hugging Face Transformers
- LangChain / LlamaIndex
- OpenCV for vision tasks

Data Processing:
- Pandas, NumPy
- Apache Spark (for large datasets)
- PostgreSQL / TimescaleDB

API Development:
- FastAPI / Flask
- GraphQL for complex queries

Deployment:
- Docker / Kubernetes
- CI/CD pipelines
- Model versioning (MLflow, Weights & Biases)
```

### Code Patterns and Conventions

#### Model Development
```python
# Example pattern for construction AI model
class SafetyMonitor:
    def __init__(self, model_path: str):
        self.model = load_model(model_path)
        self.confidence_threshold = 0.85

    def detect_hazards(self, image: np.ndarray) -> List[Hazard]:
        """Detect safety hazards in construction site image."""
        predictions = self.model.predict(image)
        return self._filter_by_confidence(predictions)
```

#### Integration Pattern
```python
# Example BIM integration pattern
class BIMConnector:
    def __init__(self, config: BIMConfig):
        self.client = create_bim_client(config)

    def sync_progress(self, progress_data: ProgressData):
        """Sync AI-detected progress with BIM model."""
        elements = self.client.get_elements(progress_data.zone)
        for element in elements:
            if progress_data.has_update(element.id):
                self.client.update_status(element, progress_data.status)
```

## Common Issues and Solutions

### Issue: Data Quality in Construction
**Challenge:** Construction data is often unstructured, inconsistent, and scattered
**Solutions:**
- Implement data validation pipelines
- Standardize data collection processes
- Use ML for data cleaning and normalization
- Create data governance policies

### Issue: Integration Complexity
**Challenge:** Many legacy systems with different APIs and data formats
**Solutions:**
- Build abstraction layers for system integration
- Use middleware/integration platforms
- Implement data transformation pipelines
- Consider phased integration approach

### Issue: Real-time Processing Requirements
**Challenge:** Safety applications need sub-second response times
**Solutions:**
- Edge computing for latency-critical applications
- Model optimization (quantization, pruning)
- Efficient inference pipelines
- Fallback mechanisms for system failures

### Issue: Model Accuracy in Field Conditions
**Challenge:** Varying lighting, weather, camera angles affect CV models
**Solutions:**
- Diverse training data including field conditions
- Domain adaptation techniques
- Regular model retraining with new data
- Human-in-the-loop validation

### Issue: User Adoption
**Challenge:** Construction workforce may resist new technology
**Solutions:**
- Focus on tools that augment, not replace
- Simple, intuitive interfaces
- Mobile-first design for field use
- Clear demonstration of value/time savings

## Security Considerations

### Data Protection
- Encryption at rest and in transit
- Role-based access control
- Audit logging for compliance
- Data retention policies

### Model Security
- Input validation to prevent adversarial attacks
- Model versioning and rollback capabilities
- Access controls for model updates
- Monitoring for model drift

### Compliance
- GDPR/CCPA for personal data (worker images)
- Industry-specific regulations (OSHA, local codes)
- Data residency requirements
- Audit trail maintenance

## Dependencies

### External Services
- Cloud AI services (vision, NLP)
- Weather APIs
- Material pricing databases
- Regulatory databases

### Hardware
- Site cameras and drones
- Edge computing devices
- IoT sensors
- Mobile devices for field workers

## Platform Notes

- **Primary deployment**: Cloud-based with edge components
- **Mobile support**: iOS and Android for field applications
- **Offline capability**: Essential for remote sites
- **API design**: RESTful + WebSocket for real-time features

## Agent Infrastructure

### Overview

The project uses a specialized agent system (`.claude/agents/`) for systematic project management, code review, and documentation maintenance.

### Available Agents

#### Core Agents

| Agent | Purpose | Tools |
|-------|---------|-------|
| `construction-agent` | Design-first workflow management, sprint planning | Read, Write, Edit, Glob, Grep, Bash |
| `memory-agent` | Memory-bank maintenance, context synchronization | Read, Write, Edit, Glob, Grep, Bash |

#### Code Review System

| Agent | Purpose | Tools |
|-------|---------|-------|
| `code-review-agent` | Orchestrates comprehensive reviews | Read, Glob, Grep, Bash |
| `architecture-reviewer` | SOLID principles, design patterns | Read, Grep, Glob |
| `docs-reviewer` | Documentation completeness | Read, Grep, Glob |
| `performance-reviewer` | Algorithm efficiency, resource usage | Read, Grep, Glob |
| `quality-reviewer` | Code quality, maintainability | Read, Grep, Glob |
| `security-reviewer` | Vulnerability detection | Read, Grep, Glob |
| `test-reviewer` | Test coverage analysis | Read, Grep, Glob, Bash |
| `test-generator` | Pytest suite generation | Read, Write, Glob, Grep |
| `review-reader` | Deep issue investigation | Read, Grep, Glob |
| `review-suggester` | Multi-pass fix generation | Read, Grep, Glob |
| `review-applier` | Safe change application | Read, Write, Edit, Glob, Grep, Bash |

### Agent Usage

Invoke agents using `@agent-name command`:

```
@construction-agent design <feature>
@memory-agent update
@code-review-agent review <files>
```

### Key Workflows

1. **Design-First Development**: Use `construction-agent` to create design docs before implementation
2. **Memory Maintenance**: Use `memory-agent` to keep documentation synchronized
3. **Code Review**: Use `code-review-agent` for comprehensive pre-merge reviews
