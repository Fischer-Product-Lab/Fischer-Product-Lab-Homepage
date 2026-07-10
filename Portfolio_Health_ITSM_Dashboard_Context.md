# Portfolio Health ITSM Dashboard — Project Context

**Owner:** Trevor Fischer  
**Product family:** Fischer Product Lab  
**Product:** Portfolio Health  
**Status:** Built, validated, and privately deployed  
**Last updated:** July 2026  
**Private site:** https://portfolio-health-itsm.t-fischer2.chatgpt.site

## 1. Purpose of This File

This file is the durable context handoff for the Portfolio Health ITSM dashboard. A future Codex task should read this file before changing the product.

It records:

- Why the dashboard exists and how it supports Trevor's portfolio-management mandate
- What has been implemented
- The fictional data model and honesty boundaries
- The Fischer Product Lab/VulnBoard design language
- The technical structure and validation process
- Known limitations and the recommended roadmap

This is a product and implementation context file, not a resume claims file.

## 2. Product Summary

Portfolio Health is an executive-grade IT service management operating dashboard. It presents fictional ServiceNow-style incident, problem, change, and release data as a consolidated leadership view.

The product is intended to answer five portfolio questions:

1. Where is operational risk accumulating?
2. Is the organization restoring service and eliminating root causes fast enough?
3. Are changes closing successfully, closing with issues, failing, or carrying over?
4. Which releases create near-term risk, collision, or approval pressure?
5. Which items require leadership awareness or intervention now?

The dashboard is intentionally more than a ticket-count report. It combines flow, outcomes, risk, ownership, trend, and release timing so a portfolio manager can move from awareness to accountability.

## 3. Connection to Trevor's Role Context

The dashboard reflects a leadership mandate Trevor received to bring portfolio-management discipline to an enterprise platform organization. Product-relevant expectations included:

- Consolidating operational, engineering, security, release, and innovation signals
- Tracking incidents, changes, problems, postmortems, RCA, and permanent resolution
- Providing leadership with a single view of status and progress
- Improving accountability without claiming ownership of the underlying SRE, QE, security, or release functions
- Beginning with biweekly reporting and designing toward weekly or near-real-time visibility
- Turning raw operational data into decision-ready information through automation

Important positioning boundary: the public/demo product shows Trevor's product thinking and dashboard-building capability. It must not imply that this fictional site is connected to an employer's production ServiceNow instance.

## 4. Product Positioning

**One-line description:**

> Operational health, in one decision-ready view.

**Portfolio thesis:**

> Fischer Product Lab builds governed, executive-ready systems that turn complex enterprise workflows into measurable operating decisions.

**Intended audience:**

- Portfolio and program leadership
- Technical product and delivery leaders
- Service owners
- SRE and operations partners
- Problem and change managers
- Release governance and CAB participants

**Desired impression:**

> A sophisticated operator with strong product taste who can translate technical operations into a leadership decision system.

## 5. Implemented Experience

### 5.1 Portfolio Overview

The landing view contains:

- Portfolio health score and simulated ServiceNow feed status
- Leadership watchlist
- Incident, problem, and change KPI cards
- Twelve-month mini-trends for opened versus closed records
- Interactive six-month/twelve-month operational-flow charts
- Change execution-quality analysis
- Prioritized attention queue
- Near-term release horizon

Headline fictional metrics currently include:

| Area | Metrics |
|---|---|
| Incidents | 47 open, 186 closed in 30 days, 2 active P1s, 8 at SLA risk, 3h 12m MTTR |
| Problems | 18 open, 11 closed in 30 days, 6 overdue RCAs, 9 known errors, 4 repeat drivers |
| Changes | 24 open, 80 closed in 30 days, 9 closed with issues, 3 failed, 2 carried over, 85% success rate |
| Change-caused incidents | 1 P1, 2 P2, and 3 P3 incidents |

### 5.2 Month-over-Month Line Charts

The overview includes separate incident and problem line charts.

Each chart provides:

- Opened and closed monthly series
- Six-month and twelve-month toggles
- July intake, closure, net-flow, and closure-ratio KPIs
- A short portfolio interpretation beneath the chart
- Click-through to the corresponding record table

The charts use an accessible HTML canvas implementation with responsive redraw behavior. The current historical range is August 2025 through July 2026.

### 5.3 Record Tables and Drill-Downs

Incidents, problems, and changes each have a dedicated record view.

Users can:

- Search by record ID, title, business service, or owner
- Filter by status
- Filter by priority
- Filter by business service
- Filter changes by outcome
- Clear active filters
- Click a record to open a detail drawer

Clicking a KPI on the overview carries a relevant filter into the record view. Examples:

- Clicking closed-with-issues opens the change table filtered to that outcome
- Clicking active P1s opens incidents filtered to P1
- Clicking overdue RCA opens problems filtered to overdue RCA records
- Clicking failed/carried changes opens a combined outcome view

The record arrays are representative fictional records. Headline totals describe the fictional portfolio population and are not calculated from the smaller representative arrays.

### 5.4 Change Outcome Model

The change view distinguishes:

- Open
- Successful
- Closed with issues
- Failed
- Carried over

The overview also tracks incidents caused by change by priority. This structure was informed by ServiceNow's Change Success Score model, which distinguishes successful, unsuccessful, successful-with-issues, and change-caused incident indicators.

### 5.5 Rolling Release Calendar

The release calendar is a trailing twelve-month view covering August 2025 through July 2026. It opens on the current month and navigates backward through completed historical releases.

It includes:

- Previous/next month controls
- Direct month selection
- Complete calendar grids with leading and trailing blank days
- Monthly deployment count
- High-risk deployment count
- Awaiting-approval count
- Low, moderate, and high-risk event styling
- Release detail drawers

Release detail includes:

- Change ID and title
- Deployment date and window
- Business service
- Owner
- Environment
- Change type
- Status and risk
- Summary
- Closure and validation conditions

All release records are fictional.

## 6. Fictional Data Model

The current prototype stores synthetic data directly in `app/page.tsx`.

### Ticket fields

- `id`
- `title`
- `status`
- `priority`
- `service`
- `owner`
- `opened`
- `age`
- Optional `outcome`
- Optional `risk`

### Release fields

- `id`
- `day`
- `month`
- `title`
- `time`
- `window`
- `service`
- `owner`
- `risk`
- `type`
- `status`
- `environment`
- `summary`
- `conditions`

### Trend fields

Each core ITSM area has monthly `opened` and `closed` arrays aligned to a shared month array.

Current representative business services include:

- Client Identity
- Trading Platform
- Clearing & Settlement
- Advisor Portal
- Integration Gateway
- DevOps Platform
- Data & Reporting
- Communications
- Cash Management
- Statements & Tax
- Mobile Experience
- Account Opening

## 7. Honesty and Security Boundaries

These boundaries are mandatory:

- All displayed data is synthetic.
- The ServiceNow connection and refresh indicator are simulated.
- There is no production ServiceNow API integration.
- There is no employer, customer, or personal data in the product.
- The site is read-only.
- There are no public write endpoints.
- There are no browser-exposed API credentials.
- Do not claim that the demo changed decisions, reduced incidents, improved availability, or achieved adoption.
- Do not present fictional metrics as LPL Financial or any other employer's operating data.

If a real ServiceNow feed is added later, credentials must remain server-side, secrets must be managed through deployment environment variables, inputs and query parameters must be validated, and the product must retain a clear demo-versus-production boundary.

## 8. Fischer Product Lab / VulnBoard Design System

The product was redesigned to align with the VulnBoard visual language and the Fischer Product Lab brand.

### Visual direction

- Premium CISO command center
- Luxury finance dashboard
- Black/navy navigation shell
- Warm paper canvas
- Ivory cards
- Restrained gold accents
- Muted operational colors
- Serious enterprise credibility rather than futuristic or gimmicky styling

### Core color tokens

| Token | Value | Use |
|---|---:|---|
| Navy | `#141c2e` | Navigation, executive headers, primary actions |
| Paper | `#f3f0e8` | Application canvas |
| Panel | `#fffdf7` | Cards, tables, drawers |
| Ink | `#161a22` | Primary text |
| Muted | `#69717c` | Supporting text |
| Line | `#ded7c9` | Borders and dividers |
| Soft gold | `#d7b56d` | Brand and premium accents |
| Amber | `#b88a3d` | Opened trends and warning states |
| Blue | `#426b9a` | Informational states and links |
| Teal | `#3d7f93` | Supporting operational accents |
| Green | `#2f8564` | Closed/successful states |
| Red | `#b84a35` | Failures, P1, and critical risk |
| Plum | `#6f4d7c` | Carried-over/rescheduled states |

### Brand hierarchy

- Sidebar brand: Fischer / Product Lab
- Current product: Portfolio Health
- Product metadata: `Portfolio Health | Fischer Product Lab`
- Social/share image: `public/og.png`

Preserve this visual system unless Trevor explicitly asks for a new direction.

## 9. Technical Structure

The project is a Vinext/Next-compatible React application configured for Sites and Cloudflare Worker deployment.

### Main files

- `app/page.tsx` — Product UI, fictional data, filtering, drawers, calendar, and canvas charts
- `app/globals.css` — Responsive layout and Fischer Product Lab visual system
- `app/layout.tsx` — Metadata and dynamic social-image URL
- `public/og.png` — Fischer Product Lab share card
- `tests/rendered-html.test.mjs` — Production-render and product-presence checks
- `.openai/hosting.json` — Sites project binding; no D1 or R2 bindings are active

### Runtime characteristics

- React client state controls product tabs, filters, drawers, and chart range
- Canvas line charts redraw through `ResizeObserver`
- The URL is updated with a `view` query string when switching sections
- No database is currently used
- No API route is currently used
- No persistent user state is currently used

### Common commands

```text
npm run dev
npm run build
npm test
npm run lint
```

The required Node version is 22.13 or newer.

## 10. Validation and Deployment Status

The product has passed:

- Production compilation
- Server-render verification
- Product-content assertions
- Starter-asset removal assertions
- Metadata and share-image checks
- Responsive CSS presence checks

Current deployment is private and uses the existing Sites URL:

https://portfolio-health-itsm.t-fischer2.chatgpt.site

The repository history contains three principal product milestones:

1. Initial ITSM dashboard build
2. Fischer Product Lab/VulnBoard visual alignment
3. Expanded data, twelve-month trends, and trailing twelve-month release calendar

## 11. Known Limitations

- The ServiceNow feed is simulated.
- Headline totals and representative table rows are maintained separately.
- Charts do not yet provide hover tooltips or selectable data points.
- The `view` query parameter is written to the URL but is not yet read on initial page load.
- Tables do not yet support sorting, pagination, saved filters, or export.
- Record drawers show product context but not true linked-record lineage.
- Release conflict and blackout-window detection are not implemented.
- Portfolio health score calculation is currently illustrative rather than formula-driven.
- No service-level scorecard view exists yet.
- No automated leadership narrative is generated yet.

## 12. Recommended Roadmap

### Highest-value next iteration

1. **Service health scorecards**
   - Availability
   - Incident rate
   - MTTR
   - SLA compliance
   - Open problem and RCA debt
   - Change success rate
   - Release risk
   - Named owner

2. **Linked record lineage**
   - Incident caused by change
   - Incident linked to problem
   - Problem linked to permanent-resolution change
   - Change linked to release
   - Business service and dependency context

Together, these features would move the product from operational reporting toward a true portfolio decision system.

### Subsequent improvements

3. Target and threshold overlays on charts
4. Release collision, blackout, and dependency warnings
5. Portfolio-level service heatmap
6. Sorting, pagination, export, and saved filter views
7. Data-quality and feed-freshness monitoring
8. Weekly leadership narrative and decision brief
9. Real ServiceNow server-side integration
10. Role-based access and audit controls if write workflows are ever added

## 13. Product Principles for Future Changes

Every new feature should answer:

- Who is the user?
- What decision does this enable?
- What signal or workflow supports the decision?
- What risk or failure mode exists?
- What control makes the feature safe and credible?
- What measurable outcome would prove value?

Maintain these rules:

- Prefer decision-ready signals over decorative metrics.
- Preserve click-through from summary to evidence.
- Show trends and targets, not isolated counts.
- Distinguish activity from outcomes.
- Keep ownership and business-service context visible.
- Preserve synthetic, read-only demo posture until a secure integration is explicitly requested.
- Avoid adding speculative features that do not support a portfolio decision.

## 14. Recommended Prompt for a Future Task

```text
Read Portfolio_Health_ITSM_Dashboard_Context.md before making changes.

Continue building Portfolio Health as a Fischer Product Lab product. Preserve the VulnBoard navy, ivory, warm-paper, and gold visual system; the synthetic-data and read-only boundaries; and all existing incident, problem, change, table-filter, line-chart, drawer, and trailing twelve-month release-calendar behavior.

The next recommended product increment is service health scorecards plus linked incident/problem/change/release lineage. Inspect app/page.tsx and app/globals.css, implement the increment, validate the production build, and update the existing private Sites deployment.
```

## 15. Reference Material

The metric model was informed by official ServiceNow material, including:

- ITSM Analytics coverage for incident, problem, change, request, major incident, and related dashboards
- Change Success Score indicators for successful, unsuccessful, successful-with-issues, and change-caused incident outcomes
- Problem Management concepts for root cause, known errors, workarounds, and permanent resolution

The role-expectation context supplied separately remains authoritative for resume claims, outcomes, adoption, and leadership-mandate wording. This dashboard context file is authoritative for the demo product itself.
