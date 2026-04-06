import asyncio
from typing import Dict, Any, List
from backend.agents.implementations import ResearcherAgent, AnalystAgent, SkepticAgent, SynthesizerAgent
from backend.models.models import IntelligenceReport

class OSINTWorkflow:
    def __init__(self):
        self.researcher = ResearcherAgent("Researcher")
        self.analyst = AnalystAgent("Analyst")
        self.skeptic = SkepticAgent("Skeptic")
        self.synthesizer = SynthesizerAgent("Synthesizer")
        self.state: Dict[str, Any] = {}

    async def run(self, target: str) -> IntelligenceReport:
        # Step 1: Research
        research_results = await self.researcher.process(target)
        self.state["research"] = research_results
        
        # Step 2: Analysis
        analysis_results = await self.analyst.process(research_results)
        self.state["analysis"] = analysis_results
        
        # Step 3: Audit (Skeptic)
        audit_results = await self.skeptic.process(analysis_results)
        self.state["audit"] = audit_results
        
        # Step 4: Synthesis
        final_summary = await self.synthesizer.process(audit_results)
        self.state["synthesis"] = final_summary
        
        # Construct and return final report
        return self._build_report(target, final_summary)

    def _build_report(self, target: str, final_summary: Dict[str, Any]) -> IntelligenceReport:
        # Map state to Pydantic IntelligenceReport model
        data = final_summary["data"]
        return IntelligenceReport(
            target=target,
            entity_summary={"description": final_summary["summary"]},
            key_entities=data["verified_entities"],
            relationships=data["verified_relationships"],
            timeline=[], # Timeline building logic would go here
            risks=[],
            opportunities=[],
            contradictions=data["contradictions"],
            confidence_summary={
                "score": final_summary["confidence_score"],
                "status": "Validated" if data["audit_passed"] else "Warning"
            },
            recommended_next_actions=["Monitor social media for target", "Deep dive into financial records"]
        )
