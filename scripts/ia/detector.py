import json
import time

def detect_job_shift(linkedin_text):
    """
    Simulation d'un script NLP qui analyse un post LinkedIn ou un profil 
    pour détecter un changement de poste.
    """
    print(f"Analyse IA en cours pour : {linkedin_text[:50]}...")
    time.sleep(2)
    
    # Simulation de logique NLP (pourrait utiliser GPT-4o ici)
    if "heureux de vous annoncer" in linkedin_text.lower() or "new position" in linkedin_text.lower():
        return {
            "status": "SHIFT_DETECTED",
            "confidence": 0.98,
            "extracted_data": {
                "new_title": "Senior AI Architect",
                "new_company": "Future Tech",
                "old_company": "Legacy Corp"
            }
        }
    return {"status": "NO_SHIFT", "confidence": 1.0}

if __name__ == "__main__":
    test_post = "Je suis très heureux de vous annoncer que je rejoins Future Tech en tant que Senior AI Architect après 5 ans chez Legacy Corp."
    result = detect_job_shift(test_post)
    print(json.dumps(result, indent=4))
