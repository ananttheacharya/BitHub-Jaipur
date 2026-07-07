# BitHuB Jaipur (Production Backend)

This repository serves as the **Official Production Backend** for the BitHuB Jaipur campus. 

## 🚀 Environments

- **Live Production API:** [https://bithub-jaipur.onrender.com](https://bithub-jaipur.onrender.com)
- **Live Frontend Site:** [https://bithub.co.in/bit-jaipur](https://bithub.co.in/bit-jaipur) (Hosted from the official `Suraj766325/BitHuB` repository).

## 🛠️ Workflows & Rules

1. **No Direct Development:** You should NOT use this repository for prototyping, breaking changes, or rapid bug fixing. Use the Development environment (`ananttheacharya/BitHuB-Jaipur-backup`) for that.
2. **Deployments:** Pushing or merging stable code into the `main` branch of this repository will **directly affect the live production systems**. 
3. **Branching:** Mid-deployment staging can be pushed to the `bit_jaipur` branch here before merging to `main`.
4. **Frontend Updates:** If there is any frontend update accompanying a backend change, make sure the updated `Front-End New` code is also tracked here for historical archiving.

## 📁 Repository Structure
- `Backend/`: The Node/Express backend codebase driving the production API.
- `Front-End New/`: The React frontend codebase (synced here for archiving).
- `Study Material/`: PDF and reference materials served by the backend.

*(Please read `context.md` for exhaustive architectural details and command workflows).*
