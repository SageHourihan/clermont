
# Project Roadmap

## 1️⃣ Data Validation & Cleanup
- **Ensure Data Integrity**
  - Check for duplicate entries based on `MMSI`, `timestamp`, or another unique identifier.
  - Filter out incomplete or malformed data.
- **Normalize Data**
  - Ensure consistent data types (e.g., `latitude/longitude` as floats, `MMSI` as integers).

### Next Actions:
- Implement basic validation rules.
- Decide how to handle duplicate or inconsistent data.

---

## 2️⃣ Storing & Structuring Processed Data
Right now, you're storing **raw data** in MongoDB's `raw_data` collection. You need a **processed** dataset for efficient querying.

### Approach:
- Design a **structured schema** for processed vessel data.
- Store only **relevant fields** in a `processed_data` collection for faster lookups.
- Update this collection periodically with cleaned and enriched data.

### Next Actions:
- Define what fields are important for your UI.
- Set up a processing script to clean and move data from `raw_data` → `processed_data`.

---

## 3️⃣ Building API Endpoints for the UI
Now that data is stored, your frontend needs to **access and display it**.

### Approach:
- **Create API endpoints** to fetch relevant vessel data.
- Implement **querying and filtering** (e.g., find ships near a location, active vessels, specific MMSI).
- Consider **pagination** for large datasets.

### Next Actions:
- Build a `getVessels.php` API to return vessel data.
- Add filters for `MMSI`, `shipName`, `location`, `time range`, etc.

---

## 4️⃣ Live Data Handling & Frontend Updates
- Right now, you’re using **AJAX polling** for live updates.
- **Optimize polling intervals** to reduce load.
- Consider **websockets or event-driven updates** for real-time tracking.

### Next Actions:
- Test how frequently ships update.
- Tune polling interval or evaluate WebSockets.

---

## 5️⃣ UI Enhancements & Visualization
- Use **Leaflet.js** or **Google Maps API** to show vessel positions.
- Add **filters and search** to explore ships by name, speed, location, etc.
- Display **historical movement** (past routes).

### Next Actions:
- Display ships on a map.
- Add real-time updates to vessel positions.

---

## Final Thought
Right now, your **biggest priority** should be:
- Cleaning & processing raw data.
- Creating an API for the frontend.
- Building a simple UI to display ships.

---
