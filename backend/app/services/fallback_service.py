"""Deterministic demo responses used when the Gemini API is not configured."""
import re
from app.schemas.schemas import (
    SafetyAnalysisResponse, SafetyViolation, CrackAnalysisResponse, ValuationResponse,
    PlanningResponse, ProjectPhase, BudgetItem, RiskItem, DailyAssistantResponse,
    WeatherInfo, ActivityAdvice, ChatResponse,
)


def generate_fallback_safety(prompt: str = "") -> SafetyAnalysisResponse:
    return SafetyAnalysisResponse(
        risk_level="HIGH", overall_score=48,
        violations=[
            SafetyViolation(category="PPE", description="Worker appears to be missing a safety helmet", location_in_image="foreground"),
            SafetyViolation(category="Scaffolding", description="Elevated platform guardrails should be inspected", location_in_image="scaffold perimeter"),
        ],
        missing_ppe=["Safety helmet", "High-visibility vest"],
        hazards_detected=["Potential fall hazard at elevated edge", "Materials near a walkway"],
        corrective_actions=["Require appropriate PPE", "Inspect and secure scaffold guardrails", "Clear the access path"],
        immediate_actions=["Restrict access to any unprotected edge until inspected"],
        summary="Demo-mode inspection found potential PPE and fall-protection issues. Confirm all findings on site before taking action.",
    )


def generate_fallback_crack(prompt: str = "") -> CrackAnalysisResponse:
    return CrackAnalysisResponse(
        crack_type="diagonal", severity="HIGH", width_estimate_mm="Visual estimate only",
        likely_causes=["Differential settlement", "Stress concentration near an opening"],
        structural_risk="Crack appearance alone cannot establish structural capacity or cause.",
        repair_recommendations=["Have a licensed structural engineer inspect the element", "Document and monitor crack movement", "Determine the cause before selecting a repair"],
        urgency="REPAIR_SOON",
        disclaimer="This AI analysis is preliminary and must be verified on site by a licensed structural engineer.",
        summary="A possible diagonal crack was noted in demo mode. Obtain an on-site engineering assessment.",
    )


def generate_fallback_valuation(prompt: str = "") -> ValuationResponse:
    area_match = re.search(r"Area:\s*([0-9.]+)", prompt) or re.search(r"([0-9.]+)\s*sq\s*ft", prompt, re.I)
    area = float(area_match.group(1)) if area_match else 1200.0
    loc_match = re.search(r"Location:\s*([^\n\r]+)", prompt)
    location = loc_match.group(1).strip() if loc_match else "location not specified"
    low, high = area * 6000 * 0.9, area * 6000 * 1.15
    return ValuationResponse(
        min_price_inr=round(low, -3), max_price_inr=round(high, -3),
        per_sqft_rate_inr=round((low + high) / (2 * area)),
        confidence="LOW", key_value_drivers=["Floor area supplied", "Location supplied"],
        negative_factors=["No verified comparable transactions available in demo mode"],
        comparable_properties=[], assumptions=["Illustrative default rate only", "Not a professional valuation"],
        market_trend="Not available in demo mode",
        summary=f"Illustrative demo estimate for {area:.0f} sq ft in {location}. Do not use as a transaction or lending valuation.",
    )


def generate_fallback_planning(prompt: str = "") -> PlanningResponse:
    budget_match = re.search(r"Budget:\s*₹?([0-9,.]+)", prompt)
    budget = float(budget_match.group(1).replace(",", "")) if budget_match else 7500000.0
    weeks_match = re.search(r"Deadline:\s*([0-9]+)", prompt)
    weeks = (int(weeks_match.group(1)) if weeks_match else 18) * 4
    percentages = [("Civil and structure", .45), ("Finishes", .22), ("MEP", .15), ("Labor and management", .12), ("Contingency", .06)]
    return PlanningResponse(
        total_duration_weeks=weeks,
        phases=[
            ProjectPhase(phase_name="Site preparation and foundation", duration_weeks=max(1, round(weeks*.2)), start_week=1, end_week=max(1, round(weeks*.2)), key_activities=["Site survey", "Excavation", "Foundation works"], milestones=["Foundation inspected"]),
            ProjectPhase(phase_name="Structure and enclosure", duration_weeks=max(1, round(weeks*.45)), start_week=max(1, round(weeks*.2)+1), end_week=max(2, round(weeks*.65)), key_activities=["Frame and slab works", "Masonry", "Roof and waterproofing"], milestones=["Structure complete"]),
            ProjectPhase(phase_name="MEP, finishes and handover", duration_weeks=max(1, weeks-round(weeks*.65)), start_week=max(2, round(weeks*.65)+1), end_week=weeks, key_activities=["MEP installation", "Interior finishes", "Testing and handover"], milestones=["Final inspections complete"]),
        ],
        material_estimates=[{"material":"Concrete (preliminary)", "quantity":"Engineer to quantify", "estimated_cost_inr":round(budget*.3)}],
        labor_breakdown=[{"trade":"Multi-trade workforce", "count":0, "duration_weeks":weeks, "cost_inr":round(budget*.12)}],
        risk_register=[RiskItem(risk="Weather delays", probability="MEDIUM", impact="MEDIUM", mitigation="Add schedule contingency and protect exposed work"), RiskItem(risk="Material price volatility", probability="MEDIUM", impact="MEDIUM", mitigation="Obtain supplier quotations and review regularly")],
        budget_breakdown=[BudgetItem(category=name, amount_inr=round(budget*pct), percentage=pct*100) for name,pct in percentages],
        critical_path=["Foundation", "Structure", "Enclosure", "MEP and finishes", "Inspection and handover"],
        recommendations=["Have a qualified engineer verify quantities and structural design", "Track schedule, quality and costs weekly"],
        summary="Illustrative demo plan only. Quantities, costs, and structural requirements require professional review.",
    )


def generate_fallback_daily(prompt: str = "") -> DailyAssistantResponse:
    weather = WeatherInfo(temperature_c=29.5, wind_speed_kmh=16.0, precipitation_mm=0.0, humidity_percent=62.0, condition="Demo weather")
    return DailyAssistantResponse(
        weather=weather, overall_site_status="CAUTION",
        activity_advice=[
            ActivityAdvice(activity="Concrete pouring", recommendation="PROCEED_WITH_CAUTION", reason="Verify current weather, mix, formwork and curing arrangements before proceeding."),
            ActivityAdvice(activity="Scaffolding erection", recommendation="PROCEED_WITH_CAUTION", reason="Check footing, ties, guardrails and weather limits before use."),
            ActivityAdvice(activity="Electrical work", recommendation="PROCEED_WITH_CAUTION", reason="Use qualified personnel and confirm isolation and protective devices."),
        ],
        safety_briefing=["Review site hazards during a toolbox talk", "Check PPE and emergency access", "Stop work where conditions are unsafe"],
        daily_precautions=["Verify live weather at the job site", "Follow approved method statements and local requirements"],
        summary="Demo advisory only. Confirm current conditions and consult the responsible site professional before work decisions.",
    )


def generate_fallback_chat(prompt: str = "") -> ChatResponse:
    p = prompt.lower()
    if "cover" in p:
        reply = "Concrete cover requirements depend on exposure, member type, fire resistance and the applicable code edition. Check IS 456 and the project drawings; have the engineer of record verify the value for your case."
        refs = ["IS 456:2000", "Project structural drawings"]
    elif "crack" in p:
        reply = "Crack assessment depends on width, movement, location, exposure and structural function. Photograph and monitor it, and consult a licensed structural engineer for potentially structural cracks."
        refs = ["IS 456:2000", "ACI 224R"]
    elif "seismic" in p or "earthquake" in p or "1893" in p:
        reply = "Seismic design in India should follow the applicable editions of IS 1893, IS 13920 and relevant building-code provisions. A qualified structural engineer must determine site zone, design forces and ductile detailing."
        refs = ["IS 1893", "IS 13920", "NBC 2016"]
    else:
        reply = "Use the applicable Indian Standards, approved drawings, method statements and site-specific risk assessment. Safety-critical and structural decisions should be verified by a qualified professional."
        refs = ["NBC 2016", "Applicable IS standards"]
    return ChatResponse(reply=reply, references=refs, follow_up_questions=["Which member or construction activity are you asking about?", "Which code edition and exposure conditions apply?"])
