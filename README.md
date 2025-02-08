# EV Charging Planner Web Application

Web application for SREES-E5 course. Allows users to plan EV charging during trips. 

## User Roles & Features
### 1. Administrator:
- **Charger Management**: Add, remove, update, and maintain chargers.
- **User Management**: View, manage, and block users if necessary.
- **System Logs**: Monitor events and reports.

### 2. Registered User:
- **Charger Interaction**: View available chargers, reserve slots, and report issues.
- **Vehicle Management**: Add, remove, and track vehicles.
- **Trip Simulation**: Simulate battery depletion and travel planning.

### 3. Guest:
- **Limited Access**: View charger locations without reservation or interaction.

## Technologies Used
- **Backend**: Node.js (Express.js), MongoDB (Mongoose)
- **Frontend**: React.js, Leaflet, Mapbox
- **API**: RESTful API for client-server communication
- **External Services**: OpenRouteService for route planning
- **Authentication**: JWT-based authentication
