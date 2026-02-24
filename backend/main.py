import random
import datetime
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Kavalan Sentinel API",
    description="Women's Bio-Safety Grid — Niral Thiruvizha Hackathon 2025",
    version="2.0.0",
)

# ─── CORS ─────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Sentinel user profiles (women's safety demographic) ──────────────────────
USERS = [
    {
        "user_id": "KVL-F-001",
        "profile": "Female - College Student (Night Transit)",
        "name": "Meena S.",
        "sector": "Chennai Tambaram — Night Bus Corridor",
        "base_lat": 12.9249,
        "base_lng": 80.1000,
        "risk_zone": "HIGH",
    },
    {
        "user_id": "KVL-F-002",
        "profile": "Female - Garment Worker (Vellore Sector)",
        "name": "Kavitha R.",
        "sector": "Vellore Industrial Zone — Early Shift",
        "base_lat": 12.9165,
        "base_lng": 79.1325,
        "risk_zone": "MEDIUM",
    },
    {
        "user_id": "KVL-F-003",
        "profile": "Female - IT Professional",
        "name": "Priya N.",
        "sector": "Chennai OMR Tech Corridor — Late Cab",
        "base_lat": 12.8406,
        "base_lng": 80.2286,
        "risk_zone": "MEDIUM",
    },
    {
        "user_id": "KVL-F-004",
        "profile": "Female - Domestic Worker (Remote Area)",
        "name": "Selvi K.",
        "sector": "Ambattur — Residential Dark Zone",
        "base_lat": 13.1143,
        "base_lng": 80.1548,
        "risk_zone": "HIGH",
    },
]


def generate_vitals(user: dict) -> dict:
    """Generate simulated bio-safety data for a Kavalan Sentinel user."""

    # ─── Realistic baseline readings ──────────────────────────────────────────
    heart_rate = random.randint(68, 92)
    gsr_fear_sweat_index = round(random.uniform(0.2, 1.8), 3)
    kinetic_struggle_g_force = round(random.uniform(0.1, 0.9), 3)

    # ~8% chance of ALERT — elevated stress (crowded bus, late night anxiety)
    if random.random() < 0.08:
        heart_rate = random.randint(100, 113)
        gsr_fear_sweat_index = round(random.uniform(2.2, 3.2), 3)
        kinetic_struggle_g_force = round(random.uniform(1.0, 1.8), 3)

    # ~2% chance of CRITICAL_SOS — both thresholds breached (assault / abduction attempt)
    elif random.random() < 0.02:
        heart_rate = random.randint(116, 138)
        gsr_fear_sweat_index = round(random.uniform(3.5, 5.0), 3)
        kinetic_struggle_g_force = round(random.uniform(2.1, 4.2), 3)

    # ─── AI Bio-Safety Logic ──────────────────────────────────────────────────
    if heart_rate > 115 and kinetic_struggle_g_force > 2.0:
        status = "CRITICAL_SOS"
        threat_level = "IMMEDIATE_RESPONSE"
        ai_assessment = "High-stress bio-signature detected. Kinetic struggle pattern matches known threat profiles."
    elif heart_rate > 100 or gsr_fear_sweat_index > 3.0:
        status = "ALERT"
        threat_level = "ELEVATED"
        ai_assessment = "Elevated fear-sweat index. Monitoring closely. Pre-emptive patrol advised."
    else:
        status = "SAFE"
        threat_level = "NOMINAL"
        ai_assessment = "Biometrics within normal transit range."

    lat_jitter = random.uniform(-0.006, 0.006)
    lng_jitter = random.uniform(-0.006, 0.006)

    return {
        "timestamp": datetime.datetime.utcnow().isoformat() + "Z",
        "user_id": user["user_id"],
        "profile": user["profile"],
        "name": user["name"],
        "sector": user["sector"],
        "risk_zone": user["risk_zone"],
        "location": {
            "lat": round(user["base_lat"] + lat_jitter, 6),
            "lng": round(user["base_lng"] + lng_jitter, 6),
        },
        "heart_rate": heart_rate,
        "gsr_fear_sweat_index": gsr_fear_sweat_index,
        "kinetic_struggle_g_force": kinetic_struggle_g_force,
        "status": status,
        "threat_level": threat_level,
        "ai_assessment": ai_assessment,
    }


# ─── Endpoints ────────────────────────────────────────────────────────────────

@app.get("/")
def root():
    return {
        "service": "Kavalan Sentinel API",
        "version": "2.0.0",
        "mission": "Women's Bio-Safety Grid — Zero Network Wearable SOS",
        "status": "operational",
        "endpoints": ["/api/vitals", "/api/vitals/{user_id}", "/api/users"],
    }


@app.get("/api/vitals")
def get_all_vitals():
    """Return live bio-safety vitals for all active Kavalan Sentinel users."""
    vitals = [generate_vitals(u) for u in USERS]
    any_critical = any(v["status"] == "CRITICAL_SOS" for v in vitals)
    return {
        "feed_status": "LIVE",
        "total_active": len(vitals),
        "critical_count": sum(1 for v in vitals if v["status"] == "CRITICAL_SOS"),
        "alert_count": sum(1 for v in vitals if v["status"] == "ALERT"),
        "status": "CRITICAL_SOS" if any_critical else "SAFE",
        "vitals": vitals,
    }


@app.get("/api/vitals/{user_id}")
def get_user_vitals(user_id: str):
    """Return live bio-safety vitals for a specific Sentinel user."""
    user = next((u for u in USERS if u["user_id"] == user_id), None)
    if not user:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail=f"User {user_id} not found")
    return generate_vitals(user)


@app.get("/api/users")
def get_users():
    """Return registered Kavalan Sentinel user profiles."""
    return {"users": [
        {"user_id": u["user_id"], "profile": u["profile"], "name": u["name"],
         "sector": u["sector"], "risk_zone": u["risk_zone"]}
        for u in USERS
    ]}
