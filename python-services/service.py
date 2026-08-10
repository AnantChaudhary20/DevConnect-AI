import json
import os
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

from analyzer import ResumeAnalyzer
from exceptions import DevConnectError, ValidationError
from file_handler import JsonFileStore
from recommender import RecommendationEngine
from algorithms import binary_search, knapsack_select, longest_common_subsequence, merge_sort


BASE_DIR = Path(__file__).resolve().parent
history = JsonFileStore(BASE_DIR / "data" / "analysis_history.json")
analyzer = ResumeAnalyzer(history)
recommender = RecommendationEngine()


def json_response(handler, status, payload):
    body = json.dumps(payload).encode("utf-8")
    handler.send_response(status)
    handler.send_header("Content-Type", "application/json")
    handler.send_header("Access-Control-Allow-Origin", "*")
    handler.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")
    handler.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
    handler.end_headers()
    handler.wfile.write(body)


class IntelligenceHandler(BaseHTTPRequestHandler):
    def log_message(self, format_string, *args):
        print(f"[Python] {self.address_string()} - {format_string % args}")

    def do_OPTIONS(self):
        json_response(self, 204, {})

    def do_GET(self):
        if self.path == "/health":
            return json_response(self, 200, {
                "success": True,
                "service": "DevConnect AI Python Intelligence",
                "status": "healthy",
            })

        if self.path == "/":
            return json_response(self, 200, {
                "success": True,
                "message": "DevConnect AI Python service",
            })

        return json_response(self, 404, {"success": False, "message": "Route not found"})

    def do_POST(self):
        try:
            content_length = int(self.headers.get("Content-Length", "0"))
            if content_length > 2_000_000:
                raise ValidationError("Request body is too large.")

            raw_body = self.rfile.read(content_length)
            payload = json.loads(raw_body.decode("utf-8") or "{}")

            if self.path == "/analyze-resume":
                result = analyzer.analyze(
                    payload.get("resumeText", ""),
                    payload.get("targetRole", "full stack developer"),
                )
                return json_response(self, 200, {"success": True, "analysis": result})

            if self.path == "/recommend":
                result = recommender.recommend(
                    payload.get("skills", []),
                    payload.get("candidates", []),
                    payload.get("limit", 5),
                )
                return json_response(self, 200, {"success": True, "recommendations": result})

            if self.path == "/algorithm-demo":
                numbers = payload.get("numbers", [])
                target = payload.get("target")
                sorted_numbers = merge_sort(numbers)
                search_index = (
                    binary_search(sorted_numbers, target)
                    if target is not None
                    else -1
                )
                return json_response(self, 200, {
                    "success": True,
                    "sorted": sorted_numbers,
                    "targetIndex": search_index,
                    "lcsExample": longest_common_subsequence(
                        str(payload.get("first", "")),
                        str(payload.get("second", "")),
                    ),
                    "knapsackExample": knapsack_select(
                        payload.get("items", []),
                        payload.get("capacity", 10),
                    ),
                })

            return json_response(self, 404, {"success": False, "message": "Route not found"})

        except (json.JSONDecodeError, UnicodeDecodeError):
            return json_response(self, 400, {"success": False, "message": "Invalid JSON request."})
        except ValidationError as exc:
            return json_response(self, 400, {"success": False, "message": str(exc)})
        except DevConnectError as exc:
            return json_response(self, 500, {"success": False, "message": str(exc)})
        except (ValueError, TypeError) as exc:
            return json_response(self, 400, {"success": False, "message": str(exc)})
        except Exception as exc:
            print("[Python] Unexpected error:", exc)
            return json_response(self, 500, {"success": False, "message": "Python service error."})


def run():
    host = os.getenv("PYTHON_HOST", "0.0.0.0")
    port = int(os.getenv("PORT", os.getenv("PYTHON_PORT", "8000")))

    server = ThreadingHTTPServer((host, port), IntelligenceHandler)

    print(f"DevConnect AI Python service running at http://{host}:{port}")

    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nStopping Python service...")
    finally:
        server.server_close()

if __name__ == "__main__":
    run()
