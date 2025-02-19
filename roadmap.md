
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
Storing **raw data** in Memcache. `ship:$mmsi` stores raw ship data using the ships MMSI as a unique key. `ships:active` is a list of active ships.

### Approach:
- Design a **structured schema** for processed vessel data.
- Store only **relevant fields** in a `processed_data` collection for faster lookups.
- Update this collection periodically with cleaned and enriched data.

### Next Actions:
- Define what fields are important for your UI.
- Set up a processing script to clean and move data from `raw_data` → `processed_data` - this will be an SQL database.

---

## 3️⃣ Building API Endpoints for the UI

### Approach:
- Implement **querying and filtering** (e.g., find ships near a location, active vessels, specific MMSI).
- Consider **pagination** for large datasets.

### Next Actions:
- Add filters for `MMSI`, `shipName`, `location`, `time range`, etc.

---

## 4️⃣ Live Data Handling & Frontend Updates
### Approach:
- **Optimize polling intervals** to reduce load.

### Next Actions:
- Test how frequently ships update.
- Tune polling interval or evaluate WebSockets.

---

## 5️⃣ UI Enhancements & Visualization
- Add **filters and search** to explore ships by name, speed, location, etc.
- Display **historical movement** (past routes).
- Create **user accounts** so users can track ships.
- Add functionality to nav bar links

### Next Actions:
- Display historical data
- Nav bar functionality
- Create user accounts

---

## Final Thoughts
My **biggest priorities** are:
- Cleaning & processing raw data.
- Tune polling and test the frequency of ship updates.
- UI Enhancements

---
