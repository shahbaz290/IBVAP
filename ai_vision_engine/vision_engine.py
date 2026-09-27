import cv2
import time
import numpy as np
from shapely.geometry import Point, LineString, Polygon
from ultralytics import YOLO

class BorderVisionEngine:
    def __init__(self, model_path="yolov8n.pt", enable_night_vision=False):
        """
        Initializes the AI vision engine for border analytics.
        """
        print(f"Loading YOLO model from {model_path}...")
        self.model = YOLO(model_path)
        self.enable_night_vision = enable_night_vision
        
        # State tracking
        self.track_history = {}      # Maps track_id to previous foot coordinates
        self.dwell_timers = {}       # Maps track_id to first seen timestamp
        self.triggered_alerts = set() # Prevents spamming alerts for the same event
        
        # Define classes of interest (COCO: 0=person, 1=bicycle, 2=car, 3=motorcycle, 5=bus, 7=truck)
        self.target_classes = [0, 1, 2, 3, 5, 7]

        # Initialize CLAHE for low-light enhancement
        self.clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))

    def _enhance_low_light(self, frame):
        """Applies CLAHE to enhance contrast in dark or foggy conditions."""
        lab = cv2.cvtColor(frame, cv2.COLOR_BGR2LAB)
        l, a, b = cv2.split(lab)
        cl = self.clahe.apply(l)
        limg = cv2.merge((cl, a, b))
        return cv2.cvtColor(limg, cv2.COLOR_LAB2BGR)

    def process_frame(self, frame, tripwire_line=None, restricted_polygon=None):
        """
        Processes a single frame, runs tracking, and evaluates security rules.
        """
        alerts = []
        current_time = time.time()
        
        if self.enable_night_vision:
            frame = self._enhance_low_light(frame)

        # Run YOLO with ByteTrack
        # persist=True ensures IDs are tracked across frames
        results = self.model.track(
            frame, 
            persist=True, 
            tracker="bytetrack.yaml", 
            classes=self.target_classes,
            verbose=False
        )
        
        annotated_frame = results[0].plot()
        
        # Draw user-defined boundaries on the frame
        if tripwire_line:
            cv2.line(annotated_frame, tripwire_line[0], tripwire_line[1], (255, 0, 0), 2)
        if restricted_polygon:
            pts = np.array(restricted_polygon, np.int32).reshape((-1, 1, 2))
            cv2.polylines(annotated_frame, [pts], True, (0, 0, 255), 2)

        # If no objects detected, return early
        if results[0].boxes is None or results[0].boxes.id is None:
            return annotated_frame, alerts

        # Extract bounding boxes, tracking IDs, and classes
        boxes = results[0].boxes.xyxy.cpu().numpy()
        track_ids = results[0].boxes.id.int().cpu().numpy()
        classes = results[0].boxes.cls.int().cpu().numpy()

        for box, track_id, cls_id in zip(boxes, track_ids, classes):
            x1, y1, x2, y2 = box
            width = x2 - x1
            height = y2 - y1
            
            # The foot coordinate (bottom center of bounding box)
            foot_coord = (float(x1 + width / 2), float(y2))
            foot_point = Point(foot_coord)
            
            class_name = self.model.names[cls_id]

            # 1. CRAWLING / CROUCHING DETECTION (Heuristic)
            # If width > height by a significant margin on a person, they are likely prone/crawling
            is_crawling = False
            if cls_id == 0 and width > (height * 1.2):
                is_crawling = True
                alert_key = f"{track_id}_crawling"
                if alert_key not in self.triggered_alerts:
                    alerts.append({
                        "type": "CRAWLING_INTRUDER",
                        "track_id": int(track_id),
                        "class": class_name
                    })
                    self.triggered_alerts.add(alert_key)

            # 2. VIRTUAL TRIPWIRE BREACH
            if tripwire_line and track_id in self.track_history:
                prev_foot = self.track_history[track_id]
                movement_vector = LineString([prev_foot, foot_coord])
                tripwire = LineString(tripwire_line)
                
                if movement_vector.intersects(tripwire):
                    alert_key = f"{track_id}_tripwire"
                    if alert_key not in self.triggered_alerts:
                        alerts.append({
                            "type": "TRIPWIRE_BREACH",
                            "track_id": int(track_id),
                            "class": class_name,
                            "position": foot_coord
                        })
                        self.triggered_alerts.add(alert_key)

            # 3. GEOFENCE LOITERING & INTRUSION
            if restricted_polygon:
                poly = Polygon(restricted_polygon)
                if poly.contains(foot_point):
                    # Intruder is inside the restricted zone
                    if track_id not in self.dwell_timers:
                        self.dwell_timers[track_id] = current_time
                    
                    dwell_time = current_time - self.dwell_timers[track_id]
                    
                    # Alert if they stay in the zone for more than 5 seconds
                    if dwell_time > 5.0:
                        alert_key = f"{track_id}_loitering"
                        if alert_key not in self.triggered_alerts:
                            alerts.append({
                                "type": "RESTRICTED_ZONE_LOITERING",
                                "track_id": int(track_id),
                                "class": class_name,
                                "dwell_time": round(dwell_time, 2)
                            })
                            self.triggered_alerts.add(alert_key)
                else:
                    # Reset dwell timer if they leave the zone
                    if track_id in self.dwell_timers:
                        del self.dwell_timers[track_id]

            # Update history for next frame
            self.track_history[track_id] = foot_coord

        # Optional UI overlays for active tracks
        for box, track_id in zip(boxes, track_ids):
            x1, y1, x2, y2 = map(int, box)
            cv2.putText(annotated_frame, f"ID: {track_id}", (x1, y1 - 10), 
                        cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 255), 2)

        return annotated_frame, alerts


# ==============================================================================
# STANDALONE TEST RUNNER
# Run this file directly to test on your webcam or a video file
# ==============================================================================
if __name__ == "__main__":
    # Change to your local video file
    VIDEO_SOURCE = "test_video_2.mp4"  
    
    cap = cv2.VideoCapture(VIDEO_SOURCE)
    engine = BorderVisionEngine(model_path="yolov8n.pt", enable_night_vision=False)
    
    tripwire = ((790, 735), (1350, 830)) 
    geofence = [(65, 80), (520, 80), (400, 480), (65, 480)]
    
    # --- ADD THESE TWO LINES ---
    # Create an adjustable window instead of a fixed one
    cv2.namedWindow("SIH Border Analytics Prototype", cv2.WINDOW_NORMAL)
    
    # Shrink the UI window to fit your laptop screen (does not affect AI math)
    cv2.resizeWindow("SIH Border Analytics Prototype", 1280, 720)
    # ---------------------------
    
    print("Starting video feed. Press 'q' to quit.")
    
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
            
        processed_frame, active_alerts = engine.process_frame(
            frame, 
            tripwire_line=tripwire, 
            restricted_polygon=geofence
        )
        
        # --- THE RESTORED & UPGRADED ALERT LOGIC ---
        for alert in active_alerts:
            # 1. Print the critical alert to your terminal (Backend payload)
            print(f"🚨 ALERT DISPATCHED: {alert['type']} | Target: {alert['class']} (ID: {alert['track_id']})")
            
            # 2. Draw a visual warning banner directly on the video feed
            # It lets you choose the text content, position, color, thickness, and font style.
            cv2.putText(
                processed_frame, 
                f"WARNING: {alert['type']} DETECTED!", 
                (50, 80),                  # (x, y) Position near the top left
                cv2.FONT_HERSHEY_SIMPLEX,  # Font style
                1.5,                       # Font scale/size
                (0, 0, 255),               # BGR Color format (Red)
                4                          # Thickness
            )
        # -------------------------------------------
            
        # Make sure this string perfectly matches your namedWindow string
        cv2.imshow("SIH Border Analytics Prototype", processed_frame)
        
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break
    print("Video stream ended. Closing application...")
    cap.release()
    cv2.destroyAllWindows()