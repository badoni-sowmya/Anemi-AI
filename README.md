<div align = "center">
  <pre>
 █████╗ ███╗   ██╗███████╗███╗   ███╗██╗     █████╗ ██╗
██╔══██╗████╗  ██║██╔════╝████╗ ████║██║    ██╔══██╗██║
███████║██╔██╗ ██║█████╗  ██╔████╔██║██║    ███████║██║
██╔══██║██║╚██╗██║██╔══╝  ██║╚██╔╝██║██║    ██╔══██║██║
██║  ██║██║ ╚████║███████╗██║ ╚═╝ ██║██║    ██║  ██║██║
╚═╝  ╚═╝╚═╝  ╚═══╝╚══════╝╚═╝     ╚═╝╚═╝    ╚═╝  ╚═╝╚═╝
</pre>
</div>

> **Non-invasive anaemia screening and haemoglobin prediction using computer vision and deep learning.**

AnemiAI eliminates the need for blood draws in preliminary anaemia screening by analyzing RGB color features extracted from lower eyelid images — making clinical-grade screening accessible in low-resource environments where laboratory infrastructure is unavailable.

---

## The Problem

Over 1.6 billion people globally are affected by anaemia. Diagnosis traditionally requires invasive blood collection and laboratory equipment — creating a significant gap in access for rural, remote, and resource-constrained communities. AnemiAI bridges this gap with a camera, a machine learning model, and a web browser.

---

## How It Works

1. User captures an image of their lower eyelid via the web interface
2. The system extracts normalized RGB pixel intensity features from the palpebral conjunctiva
3. A dual-output feedforward neural network runs inference:
   - **Classifier** → Anaemic / Non-Anaemic
   - **Regressor** → Estimated haemoglobin (Hb) level in g/dL
4. Results are returned in real time via a REST API

---

## Architecture
<img width="2400" height="960" alt="anemia ai" src="https://github.com/user-attachments/assets/db2b8ae6-acfb-4625-95e3-58d453e898c1" />


**Model Inputs:** Red %, Green %, Blue % pixel intensities from eyelid ROI  
**Model Outputs:** Binary anaemia classification + continuous Hb regression  
**Loss Functions:** Binary Crossentropy (classification) · MSE (regression)  
**Optimizer:** Adam  
**Preprocessing:** StandardScaler + MinMaxScaler (serialized with the model)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js, Webcam API |
| Backend | Python, Flask |
| ML Framework | TensorFlow / Keras |
| Data Processing | NumPy, Scikit-learn |
| Database | MongoDB |

---

## API Reference

### `POST /predict`

Accepts normalized RGB percentages extracted from the eyelid region and returns anaemia classification and predicted haemoglobin level.

**Request**
```json
{
  "red": 45.2,
  "green": 29.1,
  "blue": 25.7
}
```

**Response**
```json
{
  "anaemia": "Yes",
  "hb": 9.8
}
```

---

## Getting Started

**Prerequisites:** Python 3.8+, Node.js 16+

```bash
# Clone the repository
git clone https://github.com/your-username/AnemiAI.git
cd AnemiAI

# Backend setup
pip install -r requirements.txt
python app.py

# Frontend setup (separate terminal)
npm install
npm start
```

The app will be available at `http://localhost:3000`. The Flask API runs on `http://localhost:5000`.

---

## Dataset

The training dataset includes per-sample records of:
- RGB pixel intensity percentages (extracted from lower eyelid images)
- Clinical haemoglobin levels (g/dL)
- Anaemia diagnosis label (Yes / No)

Data was normalized using StandardScaler and MinMaxScaler before training. The dataset was split into stratified train/test subsets to ensure balanced class representation.

---

## Results

| Metric | Value |
|---|---|
| Anaemia Classification | High accuracy on held-out test set |
| Hb Prediction | Within clinically acceptable range |
| Inference Latency | Real-time (sub-second per prediction) |

> Full evaluation metrics and confusion matrix available in `/notebooks/evaluation.ipynb`.

---

## Limitations & Disclaimer

- **Lighting sensitive:** Prediction accuracy degrades under inconsistent or low lighting conditions
- **Not a diagnostic tool:** This system is intended for preliminary screening only and is **not a replacement for laboratory blood tests**
- **Pending clinical validation:** The model has not yet been validated in a formal clinical trial setting

---

## License

This project is licensed under the [MIT License](LICENSE).
