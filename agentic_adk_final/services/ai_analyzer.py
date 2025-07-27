import asyncio
from typing import List, Dict, Any
import base64
from pathlib import Path
import os
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from datetime import datetime
import textwrap


# Try to import Google GenerativeAI
try:
    import google.generativeai as genai
    from google.generativeai.types import HarmCategory, HarmBlockThreshold
    GENAI_AVAILABLE = True
except ImportError:
    print("Warning: Google GenerativeAI not available. AI analysis will be limited.")
    GENAI_AVAILABLE = False

class AIAnalyzer:
    def __init__(self):
        self.model = None
        if GENAI_AVAILABLE:
            api_key = os.getenv("GOOGLE_API_KEY")
            if api_key:
                genai.configure(api_key=api_key)
                self.model = genai.GenerativeModel("gemini-2.0-flash")
            else:
                print("Warning: GOOGLE_API_KEY not found")
        else:
            print("Using fallback AI analysis")
        
    async def analyze_frames(self, frame_paths: List[str]) -> List[Dict[str, Any]]:
        """Analyze frames for distress, crowd crush, or safety issues"""
        results = []
        
        for i, frame_path in enumerate(frame_paths):
            try:
                result = await self._analyze_single_frame(frame_path, i)
                results.append(result)
                
                # Add small delay to avoid rate limiting
                await asyncio.sleep(0.1)
                
            except Exception as e:
                results.append({
                    "frame_index": i,
                    "frame_path": frame_path,
                    "status": "error",
                    "error": str(e),
                    "anomaly_detected": False
                })
        
        return results

    async def _analyze_single_frame(self, frame_path: str, frame_index: int) -> Dict[str, Any]:
        """Analyze a single frame for safety issues"""
        try:
            # Read and encode image
            with open(frame_path, "rb") as image_file:
                image_data = image_file.read()
            
            # Create image part for Gemini
            image_part = {
                "mime_type": "image/jpeg",
                "data": image_data
            }
            
            prompt = """
            Analyze this image for any signs of distress, crowd crush, emergency situations, or safety concerns in a crowded public place.

            Look for:
            1. People in distress or calling for help
            2. Overcrowding or dangerous crowd density
            3. People falling or being pushed
            4. Panic or chaotic behavior
            5. Emergency situations (fire, medical emergency, etc.)
            6. Suspicious or dangerous activities
            7. Blocked emergency exits
            8. Any other safety concerns

            Respond in JSON format with:
            {
                "anomaly_detected": true/false,
                "severity": "low/medium/high/critical",
                "description": "detailed description of what you see",
                "safety_concerns": ["list of specific concerns"],
                "recommended_actions": ["list of recommended immediate actions"],
                "coordinates": {"x": approximate_x, "y": approximate_y} // if specific location in image
            }

            If no safety concerns are found, set anomaly_detected to false and provide a brief description of the normal scene.
            """
            
            # Generate response
            response = await asyncio.to_thread(
                self.model.generate_content,
                [prompt, image_part],
                safety_settings={
                    HarmCategory.HARM_CATEGORY_HATE_SPEECH: HarmBlockThreshold.BLOCK_NONE,
                    HarmCategory.HARM_CATEGORY_HARASSMENT: HarmBlockThreshold.BLOCK_NONE,
                    HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT: HarmBlockThreshold.BLOCK_NONE,
                    HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT: HarmBlockThreshold.BLOCK_NONE,
                }
            )
            
            # Parse JSON response
            import json
            try:
                analysis = json.loads(response.text)
            except json.JSONDecodeError:
                # Fallback if response is not valid JSON
                analysis = {
                    "anomaly_detected": "distress" in response.text.lower() or "emergency" in response.text.lower(),
                    "severity": "medium" if "distress" in response.text.lower() else "low",
                    "description": response.text,
                    "safety_concerns": [],
                    "recommended_actions": []
                }
            
            return {
                "frame_index": frame_index,
                "frame_path": frame_path,
                "status": "success",
                "analysis": analysis,
                "anomaly_detected": analysis.get("anomaly_detected", False),
                "severity": analysis.get("severity", "low"),
                "raw_response": response.text
            }
            
        except Exception as e:
            return {
                "frame_index": frame_index,
                "frame_path": frame_path,
                "status": "error",
                "error": str(e),
                "anomaly_detected": False
            }

    async def generate_summary(self, analysis_results: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Generate summary of all frame analyses"""
        try:
            # Count anomalies and severity levels
            total_frames = len(analysis_results)
            anomalies = [r for r in analysis_results if r.get("anomaly_detected", False)]
            
            severity_counts = {}
            all_concerns = []
            all_actions = []
            
            for result in anomalies:
                if result.get("status") == "success":
                    analysis = result.get("analysis", {})
                    severity = analysis.get("severity", "low")
                    severity_counts[severity] = severity_counts.get(severity, 0) + 1
                    
                    concerns = analysis.get("safety_concerns", [])
                    actions = analysis.get("recommended_actions", [])
                    
                    all_concerns.extend(concerns)
                    all_actions.extend(actions)
            
            # Generate AI summary
            summary_prompt = f"""
            Based on the analysis of {total_frames} video frames from a crowded public place surveillance system:

            - Total frames analyzed: {total_frames}
            - Anomalies detected: {len(anomalies)}
            - Severity breakdown: {severity_counts}
            - Safety concerns identified: {list(set(all_concerns))}
            - Recommended actions: {list(set(all_actions))}

            Generate a comprehensive summary report including:
            1. Overall safety assessment
            2. Key findings and concerns
            3. Risk level evaluation
            4. Immediate action recommendations
            5. Preventive measures for future

            Format as a professional incident report.
            """
            
            summary_response = await asyncio.to_thread(
                self.model.generate_content,
                summary_prompt
            )
            
            return {
                "total_frames": total_frames,
                "anomalies_detected": len(anomalies),
                "severity_breakdown": severity_counts,
                "unique_concerns": list(set(all_concerns)),
                "recommended_actions": list(set(all_actions)),
                "ai_summary": summary_response.text,
                "risk_level": self._calculate_risk_level(severity_counts),
                "timestamp": asyncio.get_event_loop().time()
            }
            
        except Exception as e:
            return {
                "status": "error",
                "error": str(e),
                "total_frames": len(analysis_results),
                "anomalies_detected": len([r for r in analysis_results if r.get("anomaly_detected", False)])
            }


    def save_summary_to_pdf(self, summary: Dict[str, Any], output_path: str = "summary_report.pdf") -> str:
        """Save AI summary report to a PDF file"""
        c = canvas.Canvas(output_path, pagesize=A4)
        width, height = A4
        y = height - 50
        left_margin = 50
        right_margin = 50
        max_line_width = width - left_margin - right_margin

        def draw_line(text, font_size=12, bold=False, indent=0):
            nonlocal y
            if bold:
                c.setFont("Helvetica-Bold", font_size)
            else:
                c.setFont("Helvetica", font_size)

            # Wrap the text to fit the page
            wrapper = textwrap.TextWrapper(width=int(max_line_width // (font_size * 0.6)))
            wrapped_lines = wrapper.wrap(text=str(text))

            for wrapped_line in wrapped_lines:
                if y < 60:
                    c.showPage()
                    y = height - 50
                    c.setFont("Helvetica-Bold" if bold else "Helvetica", font_size)
                c.drawString(left_margin + indent, y, wrapped_line)
                y -= font_size + 5

        # Header
        draw_line("Drone Surveillance Summary Report", font_size=16, bold=True)
        draw_line(f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        draw_line("")

        # Summary stats
        draw_line("Summary Statistics:", bold=True)
        draw_line(f"Total Frames Analyzed: {summary.get('total_frames', '-')}", indent=10)
        draw_line(f"Anomalies Detected: {summary.get('anomalies_detected', '-')}", indent=10)
        draw_line(f"Risk Level: {summary.get('risk_level', '-')}", indent=10)

        # Severity breakdown
        draw_line("Severity Breakdown:", bold=True)
        for level, count in summary.get("severity_breakdown", {}).items():
            draw_line(f"{level.capitalize()}: {count}", indent=10)

        # Safety concerns
        draw_line("Identified Safety Concerns:", bold=True)
        for concern in summary.get("unique_concerns", []):
            draw_line(f"- {concern}", indent=10)

        # Actions
        draw_line("Recommended Actions:", bold=True)
        for action in summary.get("recommended_actions", []):
            draw_line(f"- {action}", indent=10)

        # AI Summary
        draw_line("AI Generated Summary Report:", bold=True)
        summary_lines = summary.get("ai_summary", "").split("\n")
        for line in summary_lines:
            draw_line(line.strip(), indent=10)

        c.save()
        return output_path

    def _calculate_risk_level(self, severity_counts: Dict[str, int]) -> str:
        """Calculate overall risk level based on severity counts"""
        if severity_counts.get("critical", 0) > 0:
            return "CRITICAL"
        elif severity_counts.get("high", 0) > 0:
            return "HIGH"
        elif severity_counts.get("medium", 0) > 2:
            return "HIGH"
        elif severity_counts.get("medium", 0) > 0:
            return "MEDIUM"
        elif severity_counts.get("low", 0) > 5:
            return "MEDIUM"
        else:
            return "LOW"
