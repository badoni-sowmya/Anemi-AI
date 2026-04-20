from flask import Flask, request, jsonify, send_file
import tensorflow as tf
import numpy as np
import pickle
from flask_cors import CORS
from pymongo import MongoClient
import bcrypt
from ultralytics import YOLO
import cv2
import base64
from io import BytesIO
from PIL import Image as PILImage   # <<< FIXED
import requests
import os
from datetime import datetime
from reportlab.lib.pagesizes import A4, letter
from reportlab.pdfgen import canvas
from reportlab.lib import colors
from reportlab.lib.units import inch, mm
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image as RLImage
)  # <<< FIXED
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.utils import ImageReader
from twilio.rest import Client
import json
from bson.objectid import ObjectId
from bson.errors import InvalidId
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

# -------------------- DATABASE --------------------
client = MongoClient("mongodb+srv://vishalsuresh_db:vishal1234@anemiaicluster.kgtsjjn.mongodb.net/?retryWrites=true&w=majority")
db = client["vishalsuresh_db"]
users_collection = db["users"]
records_collection = db["health_records"]

# -------------------- ML MODELS --------------------
model = tf.keras.models.load_model("model/anemia_model.h5", compile=False)
scaler = pickle.load(open("model/scaler.pkl", "rb"))
hb_scaler = pickle.load(open("model/hb_scaler.pkl", "rb"))

# YOLO model
yolo_model = YOLO("model/best (2).pt")
print("YOLO task type:", yolo_model.task)
print("YOLO classes:", yolo_model.names)

TARGET_CLASS = 0

# -------------------- AUTH ROUTES --------------------
@app.route("/signup", methods=["POST"])
def signup():
    data = request.json
    username = data.get("username")
    password = data.get("password")

    if users_collection.find_one({"username": username}):
        return jsonify({"message": "Username already exists"}), 400

    hashed_pw = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    users_collection.insert_one({"username": username, "password": hashed_pw})

    return jsonify({"message": "User created successfully"}), 201


@app.route("/login", methods=["POST"])
def login():
    data = request.json
    username = data.get("username")
    password = data.get("password")

    user = users_collection.find_one({"username": username})
    if user and bcrypt.checkpw(password.encode('utf-8'), user['password']):
        return jsonify({"message": "Login successful"}), 200

    return jsonify({"message": "Invalid username or password"}), 401


# -------------------- SEGMENT --------------------
@app.route("/segment", methods=["POST"])
def segment():
    try:
        req = request.get_json(silent=True) or {}
        image_data = req.get("image")

        if not image_data:
            return jsonify({"error": "No image received"}), 400

        if "," in image_data:
            image_data = image_data.split(",")[1]

        image_bytes = base64.b64decode(image_data)
        image = PILImage.open(BytesIO(image_bytes)).convert("RGB")  # <<< FIXED
        image_np = np.array(image)

        img_bgr = cv2.cvtColor(image_np, cv2.COLOR_RGB2BGR)

        results = yolo_model.predict(
            source=img_bgr,
            conf=0.25,
            iou=0.5,
            imgsz=1024,
            verbose=False
        )

        r = results[0]

        if r.masks is None:
            return jsonify({"segmented_image": None, "message": "No mask detected"}), 200

        masks = r.masks.data.cpu().numpy()
        classes = r.boxes.cls.cpu().numpy()

        selected_masks = [masks[i] for i, c in enumerate(classes) if int(c) == TARGET_CLASS]

        if len(selected_masks) == 0:
            selected_masks = masks

        areas = [np.sum(m) for m in selected_masks]
        mask = selected_masks[int(np.argmax(areas))]

        mask = cv2.resize(mask, (image_np.shape[1], image_np.shape[0]))
        mask = (mask > 0.35).astype(np.uint8)

        kernel = np.ones((5, 5), np.uint8)
        mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, kernel)
        mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, kernel)

        output = np.zeros_like(image_np)
        output[mask == 1] = image_np[mask == 1]

        output = PILImage.fromarray(output)  # <<< FIXED
        buffer = BytesIO()
        output.save(buffer, format="JPEG")
        segmented_base64 = base64.b64encode(buffer.getvalue()).decode()

        return jsonify({"segmented_image": segmented_base64, "message": "bottom eyelid isolated"}), 200

    except Exception as e:
        print("SEGMENT ERROR:", str(e))
        return jsonify({"error": str(e)}), 400


# -------------------- PREDICT --------------------
@app.route("/predict", methods=["POST"])
def predict():
    try:
        req = request.get_json(silent=True) or {}
        image_data = req.get("image")
        username = req.get("username")

        if "," in image_data:
            image_data = image_data.split(",")[1]

        image_bytes = base64.b64decode(image_data)
        image = PILImage.open(BytesIO(image_bytes)).convert("RGB")  # <<< FIXED
        cropped = np.array(image)

        pixels = cropped.reshape(-1, 3)

        r_mean = float(np.mean(pixels[:, 0]))
        g_mean = float(np.mean(pixels[:, 1]))
        b_mean = float(np.mean(pixels[:, 2]))

        features = np.array([[r_mean, g_mean, b_mean]])
        features_scaled = scaler.transform(features)

        pred_prob, pred_hb_scaled = model.predict(features_scaled, verbose=0)

        anaemia = "Yes" if pred_prob[0][0] > 0.5 else "No"
        hb = float(hb_scaler.inverse_transform(pred_hb_scaled)[0][0])

        records_collection.insert_one({
            "username": username,
            "anaemia": anaemia,
            "hemoglobin": hb,
            "created_at": datetime.utcnow()
        })

        return jsonify({"anaemia": anaemia, "hb": hb}), 200

    except Exception as e:
        print("PREDICTION ERROR:", str(e))
        return jsonify({"error": str(e)}), 400


# -------------------- GET RECORDS --------------------
@app.route("/records/<username>", methods=["GET"])
def get_records(username):
    records = list(records_collection.find({"username": username}).sort("created_at", -1))

    for r in records:
        r["_id"] = str(r["_id"])
        r["created_at"] = r["created_at"].strftime("%Y-%m-%d %H:%M:%S")

    return jsonify(records), 200


# -------------------- DELETE RECORD --------------------
@app.route("/records/delete/<record_id>", methods=["DELETE"])
def delete_record(record_id):
    try:
        if not ObjectId.is_valid(record_id):
            return jsonify({"error": "Invalid record id"}), 400

        result = records_collection.delete_one({"_id": ObjectId(record_id)})

        if result.deleted_count == 0:
            return jsonify({"error": "Record not found"}), 404

        return jsonify({"message": "Record deleted successfully"}), 200

    except Exception as e:
        print("DELETE ERROR:", str(e))
        return jsonify({"error": str(e)}), 400


# -------------------- CHAT ROUTE --------------------
@app.route("/chat", methods=["POST"])
def chat():
    try:
        user_msg = request.json.get("message")
        OPENROUTER_KEY = os.getenv("OPENROUTER_KEY")

        if not OPENROUTER_KEY:
            return jsonify({"reply": "Server API key not configured"}), 500

        url = "https://openrouter.ai/api/v1/chat/completions"

        headers = {
            "Authorization": f"Bearer {OPENROUTER_KEY}",
            "Content-Type": "application/json"
        }

        payload = {
            "model": "google/gemini-2.5-flash",
            "max_tokens": 1000,
            "messages": [
                {"role": "system", "content": "You are AnemAi, AI doctor for anemia support."},
                {"role": "user", "content": user_msg}
            ]
        }

        response = requests.post(url, json=payload, headers=headers)
        data = response.json()

        if "error" in data:
            return jsonify({"reply": "AI Error: " + str(data["error"])})

        reply = data["choices"][0]["message"]["content"]

        return jsonify({"reply": reply})

    except Exception as e:
        print("CHAT ERROR:", str(e))
        return jsonify({"reply": "Server Error: " + str(e)}), 400


@app.route("/download_report", methods=["POST"])
def download_report():
    try:
        data = request.json
        username = data.get("username")
        hb = float(data.get("hb"))
        anaemia = data.get("anaemia")

        profile = (
            db.patient_profiles.find_one({"username": username}) or
            db.patient_profile.find_one({"username": username}) or
            db.profiles.find_one({"username": username}) or
            {}
        )

        name = profile.get("name", "Not provided")
        age = profile.get("age", "Not provided")
        gender = profile.get("gender", "Not provided")
        phone = profile.get("phone", "Not provided")
        blood_group = profile.get("blood_group", "Not provided")
        address = profile.get("address", "Not provided")
        history = profile.get("medical_history", "Not provided")

        buffer = BytesIO()

        # ---------- CORRECT MARGINS ----------
        doc = SimpleDocTemplate(
            buffer,
            pagesize=A4,
            leftMargin=20 * mm,
            rightMargin=20 * mm,
            topMargin=20 * mm,
            bottomMargin=15 * mm
        )

        PAGE_WIDTH = A4[0] - (40 * mm)   # usable width after margins

        styles = getSampleStyleSheet()

        # ---------- Custom styles ----------
        title_style = ParagraphStyle(
            "Title",
            parent=styles["Heading1"],
            alignment=TA_CENTER,
            fontSize=18,
            spaceAfter=4
        )

        subtitle_style = ParagraphStyle(
            "Subtitle",
            alignment=TA_CENTER,
            fontSize=11,
            textColor=colors.HexColor("#6f6258"),
            spaceAfter=16
        )

        section_title = ParagraphStyle(
            "SectionTitle",
            parent=styles["Heading2"],
            fontSize=13,
            spaceBefore=10,
            spaceAfter=6
        )

        small_center = ParagraphStyle(
            "smallcenter",
            alignment=TA_CENTER,
            fontSize=9
        )

        elements = []

        # ---------- LOGO ----------
        try:
            logo = RLImage("logo.png", width=70, height=70)
            logo.hAlign = "CENTER"
            elements.append(logo)
            elements.append(Spacer(1, 5))
        except:
            pass

        # ---------- TITLES ----------
        elements.append(Paragraph("AnemiAI Hemoglobin Report", title_style))
        elements.append(Paragraph("AI-based Conjunctiva Anemia Screening", subtitle_style))

        # ---------- PATIENT DETAILS ----------
        elements.append(Paragraph("Patient Details", section_title))

        patient_table = Table(
            [
                ["Patient Name", name],
                ["Email", username],
                ["Age", str(age)],
                ["Gender", gender],
                ["Blood Group", blood_group],
                ["Phone", phone],
                ["Address", address]
            ],
            colWidths=[PAGE_WIDTH * 0.35, PAGE_WIDTH * 0.65]  # <-- FIXED FIT
        )

        patient_table.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#FFF7EB")),
            ("BOX", (0, 0), (-1, -1), 1, colors.HexColor("#c8a36a")),
            ("INNERGRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#c8a36a")),
            ("FONTNAME", (0, 0), (0, -1), "Helvetica-Bold"),
            ("ALIGN", (0, 0), (-1, -1), "LEFT"),
            ("LEFTPADDING", (0, 0), (-1, -1), 6),
            ("RIGHTPADDING", (0, 0), (-1, -1), 6),
        ]))

        elements.append(patient_table)
        elements.append(Spacer(1, 8))

        # ---------- MEDICAL HISTORY ----------
        elements.append(Paragraph("Medical History", section_title))

        history_table = Table(
            [[history if history else "No history provided"]],
            colWidths=[PAGE_WIDTH]
        )

        history_table.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#FFF2DD")),
            ("BOX", (0, 0), (-1, -1), 1, colors.HexColor("#c8a36a")),
            ("LEFTPADDING", (0, 0), (-1, -1), 6),
            ("RIGHTPADDING", (0, 0), (-1, -1), 6),
        ]))

        elements.append(history_table)
        elements.append(Spacer(1, 8))

        # ---------- TEST RESULTS ----------
        elements.append(Paragraph("Test Results", section_title))

        result_color = colors.green if anaemia == "No" else colors.red

        results_table = Table(
            [
                ["Hemoglobin (g/dL)", f"{hb:.2f}"],
                ["Anemia Status", anaemia]
            ],
            colWidths=[PAGE_WIDTH * 0.45, PAGE_WIDTH * 0.55]
        )

        results_table.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#FFF4E6")),
            ("BOX", (0, 0), (-1, -1), 1.2, colors.black),
            ("GRID", (0, 0), (-1, -1), 0.5, colors.black),
            ("TEXTCOLOR", (1, 1), (1, 1), result_color),
            ("ALIGN", (1, 0), (1, -1), "CENTER"),
            ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ]))

        elements.append(results_table)
        elements.append(Spacer(1, 8))

        # --------- Interpretation ----------
        if hb >= 12:
            interp = "Normal hemoglobin level."
        elif hb >= 10:
            interp = "Mild anemia indication."
        elif hb >= 8:
            interp = "Moderate anemia detected."
        else:
            interp = "Severe anemia — urgent medical care required."

        elements.append(Paragraph(f"<b>Interpretation:</b> {interp}", styles["Normal"]))
        elements.append(Spacer(1, 6))

        # ---------- Disclaimer ----------
        elements.append(Paragraph(
            "<i>This report is AI-assisted and not a replacement for laboratory blood investigation.</i>",
            small_center
        ))

        # ---------- FOOTER ----------
        rid = f"{username[:3].upper()}-{int(datetime.now().timestamp())%99999}"
        ts = datetime.now().strftime("%d %b %Y • %I:%M %p")

        elements.append(Spacer(1, 6))
        elements.append(Paragraph(f"Report ID: {rid} &nbsp;|&nbsp; Generated on {ts}", small_center))

        doc.build(elements)
        buffer.seek(0)

        return send_file(
            buffer,
            as_attachment=True,
            download_name="AnemiAI_Report.pdf",
            mimetype="application/pdf"
        )

    except Exception as e:
        print("PDF ERROR:", str(e))
        return jsonify({"error": str(e)}), 400


# -------------------- PROFILE ROUTES --------------------
@app.route("/profile/save", methods=["POST"])
def save_profile():
    data = request.json
    username = data.get("username")

    if not username:
        return jsonify({"error": "Username required"}), 400

    db.patient_profiles.update_one(
        {"username": username},
        {"$set": data},
        upsert=True
    )

    return jsonify({"message": "Profile saved successfully"}), 200


@app.route("/profile/<username>", methods=["GET"])
def get_profile(username):
    profile = db.patient_profiles.find_one({"username": username}, {"_id": 0})

    if not profile:
        return jsonify({"message": "No profile found"}), 404

    return jsonify(profile), 200


# -------------------- SEND WHATSAPP REPORT --------------------
@app.route("/send_whatsapp_report", methods=["POST"])
def send_whatsapp_report():
    try:
        data = request.json
        username = data.get("username")
        phone = data.get("phone")
        hb = data.get("hb")
        anaemia = data.get("anaemia")

        if not phone:
            return jsonify({"error": "Phone number required"}), 400

        pdf_response = requests.post(
            "http://127.0.0.1:5005/download_report",
            json={"username": username, "hb": hb, "anaemia": anaemia}
        )

        pdf_bytes = pdf_response.content

        files = {
            'file': ('AnemiAI_Report.pdf', pdf_bytes, 'application/pdf')
        }

        upload = requests.post("https://tmpfiles.org/api/v1/upload", files=files).json()
        pdf_url = upload["data"]["url"].replace(".org/", ".org/dl/")

        twilio_client = Client(
            os.getenv("TWILIO_ACCOUNT_SID"),
            os.getenv("TWILIO_AUTH_TOKEN")
        )

        message_body = (
            "AnemiAI - Digital Hemoglobin Report\n\n"
            "Dear Patient,\n\n"
            "Your AI-generated hemoglobin screening report is now ready.\n\n"
            "You can download your detailed PDF report using the link below:\n"
            f"{pdf_url}\n\n"
            "Important Note:\n"
            "- This report is generated using AI screening techniques.\n"
            "- Please consult a qualified doctor for clinical diagnosis and treatment advice.\n\n"
            "Thank you for using AnemiAI."
        )

        twilio_client.messages.create(
            from_=os.getenv("TWILIO_WHATSAPP_NUMBER"),
            to=f"whatsapp:{phone}",
            body=message_body
        )

        return jsonify({"message": "Report sent on WhatsApp", "link": pdf_url}), 200

    except Exception as e:
        print("WHATSAPP ERROR:", str(e))
        return jsonify({"error": str(e)}), 400

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5005))  # Render assigns PORT
    app.run(debug=False, host="0.0.0.0", port=port)