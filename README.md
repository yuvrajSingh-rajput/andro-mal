# Android Malware Detection Platform

[![Python 3.11+](https://img.shields.io/badge/python-3.11+-blue.svg)](https://www.python.org/downloads/release/python-3110/)
[![React 18](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-1.0-green.svg)](https://fastapi.tiangolo.com/)

A high-performance, containerized Enterprise Dashboard for **Hybrid Static & Dynamic Analysis** of Android `.apk` files. Built on machine learning pipelines trained on the CIC-AndMal-2020 dataset to predict zero-day Android malware with deep statistical confidence.

---

## ⚡ Architecture

This system leverages a massively separated split-architecture for maximal performance isolation during heavy ML inferences.

1. **Frontend (Vite / React 18):** A beautiful, fluid interface offering drag-and-drop `.apk` uploading, live visual polling, telemetry data readouts, and probability meters.
2. **Backend (FastAPI / Scikit-Learn):** A headless heavy-lifting engine responsible for parsing binaries, stripping Dalvik opcodes via `Androguard`, and projecting matrices into high-dimensional XGBoost anomaly classifiers.
3. **Dynamic Sandbox (Android Emulator / Frida):** (Optional Module) Automatically launches Android Virtual Devices to orchestrate behavioral hooking of malware system-calls during live execution phases.

---

## 🚀 Quick Start (Production Setup)

The absolute heavily-recommended manner of spinning up the infrastructure is via standard Docker Desktop containerization bindings.

```bash
# 1. Clone the repository utilizing Git LFS for the massive ML parameters
git clone https://github.com/your-username/andromal.git

# 2. Enter workspace
cd andromal

# 3. Boot the unified cluster daemon natively across port 8000 & 80
docker-compose up --build -d
```

The React frontend instantly becomes accessible on standard `http://localhost`, heavily tunneling proxy requests explicitly bounded over internal network domains toward the `http://localhost:8000` FastAPI engines!

---

## ☁️ Deployment Specifications

The `.pkl` files contain serialized ASTs dictating the Machine Learning structures. These easily total hundreds of megabytes.

- You **MUST** use `Git LFS` (`git lfs install / track`) if operating branches directly.
- Standard deployments utilize **Render** (via our provided Dockerfile) connecting straight to the root backend structure over dynamic assigned `$PORT` hooks.

## 🛡 Disclaimer
This application is strictly for cybersecurity research, reverse engineering analytics, and heuristic classification environments. Do not reverse-engineer `.apk` distributions you don't possess express permission to test or execute.
