# Future Improvements and Features

### Real-time & Performance

- WebSocket integration to automatically update the dashboard in real time (add WebSocket to frontend, listens to backend for certain updates to the database)
- Database integration (PostgreSQL/MongoDB) to replace static JSON files. Make use of pagination and virtualization for performance.
- API caching layer (Redis) for improved response times, and rate limiting for both security and performance
- Pagination/virtualization for large datasets (currently loading all sessions)

### Advanced Analytics

- Predictive analytics: forecast which users likely to struggle based on early performance
- Learning path recommendations: based on skill/department level averages, AI suggests personalized training sequences (if other training session types are available) in order to focus on weak points

### Export & Reporting

- PDF report generation with charts and insights for other team members or stakeholders. Can export with provided filters and legend toggles to have full control of what is exported.
- Scheduled email reports for managers e.g. weekly/monthly summaries (similar to real-time updates). Could even combine this with anomaly detection, and if there is a critical anomaly, alert managers via email.

#### Other misc minor improvements/todos

- move API url to .env
- API keys
- remove hardcoded skills, instead handle skill list dynamically (helps if skills change in the training simulation, better practice overall)
- scale chart axis based on min/max data points - currently hardcoded to "look good" based on current data set
- dark mode
