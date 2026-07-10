"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type View = "overview" | "services" | "incidents" | "problems" | "changes" | "releases";
type FilterState = { status?: string; outcome?: string; priority?: string; service?: string; search?: string; releaseId?: string };

type Ticket = {
  id: string;
  title: string;
  status: string;
  priority: string;
  service: string;
  owner: string;
  opened: string;
  age: string;
  outcome?: string;
  risk?: string;
};

type Release = {
  id: string;
  day: number;
  month: number;
  title: string;
  time: string;
  window: string;
  service: string;
  owner: string;
  risk: "Low" | "Moderate" | "High";
  type: "Standard" | "Normal" | "Emergency";
  status: "Scheduled" | "Ready" | "Pending approval" | "Complete";
  environment: string;
  summary: string;
  conditions: string[];
};

type ServiceHealth = {
  name: string;
  owner: string;
  score: number;
  status: "At risk" | "Watch" | "Healthy";
  availability: string;
  incidents: number;
  p1: number;
  mttr: string;
  sla: string;
  problems: number;
  overdueRca: number;
  changeSuccess: string;
  nextRelease: string;
  releaseRisk: "Low" | "Moderate" | "High";
  trend: number;
  decision: string;
};

type LineageItem = {
  label: string;
  id: string;
  view: Exclude<View, "overview" | "services">;
};

type Lineage = {
  title: string;
  service: string;
  impact: string;
  owner: string;
  due: string;
  decision: string;
  state: "Decision due" | "In remediation" | "Monitoring";
  items: LineageItem[];
};

const navItems: { id: View; label: string; short: string }[] = [
  { id: "overview", label: "Portfolio overview", short: "Overview" },
  { id: "services", label: "Service health", short: "Services" },
  { id: "incidents", label: "Incidents", short: "Incidents" },
  { id: "problems", label: "Problems", short: "Problems" },
  { id: "changes", label: "Changes", short: "Changes" },
  { id: "releases", label: "Release calendar", short: "Releases" },
];

const trendMonths = ["Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];

const trends = {
  incidents: { opened: [238, 226, 241, 219, 232, 224, 201, 193, 218, 207, 229, 214], closed: [221, 230, 235, 227, 228, 231, 190, 205, 210, 221, 224, 186] },
  problems: { opened: [12, 14, 13, 11, 16, 14, 15, 13, 18, 17, 14, 16], closed: [10, 11, 15, 12, 13, 16, 11, 14, 12, 15, 15, 11] },
  changes: { opened: [68, 74, 77, 81, 75, 79, 72, 79, 83, 91, 88, 96], closed: [65, 72, 79, 78, 77, 82, 69, 76, 81, 86, 84, 80] },
};

const changeOutcomes = { successful: 68, withIssues: 9, failed: 3, carried: 2 };
const portfolioMetrics = {
  incidents: { open: 47, closed: trends.incidents.closed.at(-1) || 0, p1: 2, slaRisk: 8, mttr: "3h 12m" },
  problems: { open: 18, closed: trends.problems.closed.at(-1) || 0, overdueRca: 6, knownErrors: 9, repeatDrivers: 4 },
  changes: { open: 24, closed: trends.changes.closed.at(-1) || 0, ...changeOutcomes },
};
const changeSuccessRate = Math.round((changeOutcomes.successful / portfolioMetrics.changes.closed) * 1000) / 10;
const healthDimensions = [
  { label: "Availability", value: 88, weight: 20, definition: "Availability and critical-service disruption exposure" },
  { label: "Restoration", value: 78, weight: 25, definition: "Incident backlog, SLA risk, priority, and MTTR" },
  { label: "Root cause", value: 76, weight: 20, definition: "Problem aging, overdue RCA, and repeat drivers" },
  { label: "Change quality", value: 85, weight: 20, definition: "Successful closures adjusted for failures and change-caused incidents" },
  { label: "Release readiness", value: 84, weight: 15, definition: "Approval, validation, risk, and near-term release concentration" },
];
const portfolioScore = Math.round(healthDimensions.reduce((total, item) => total + item.value * (item.weight / 100), 0));
const demoAsOf = new Date(2026, 6, 9);
const currentMonthKey = demoAsOf.getMonth();
const dataThroughLabel = demoAsOf.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

const incidents: Ticket[] = [
  { id: "INC0091842", title: "Intermittent authentication failures", status: "In Progress", priority: "P1", service: "Client Identity", owner: "IAM Operations", opened: "Jul 9, 8:12 AM", age: "3h 18m", risk: "SLA at risk" },
  { id: "INC0091817", title: "Market data refresh delayed", status: "Open", priority: "P2", service: "Trading Platform", owner: "Market Data", opened: "Jul 9, 6:44 AM", age: "4h 46m", risk: "SLA at risk" },
  { id: "INC0091764", title: "Batch settlement job exceeded window", status: "Resolved", priority: "P2", service: "Clearing & Settlement", owner: "Batch Services", opened: "Jul 8, 9:27 PM", age: "8h 03m" },
  { id: "INC0091711", title: "Advisor portal document upload error", status: "In Progress", priority: "P2", service: "Advisor Portal", owner: "Digital Experience", opened: "Jul 8, 2:15 PM", age: "21h 15m", risk: "SLA at risk" },
  { id: "INC0091648", title: "Elevated API response latency", status: "Closed", priority: "P3", service: "Integration Gateway", owner: "API Platform", opened: "Jul 8, 9:10 AM", age: "1d 2h" },
  { id: "INC0091589", title: "Lower environment certificate warning", status: "Closed", priority: "P4", service: "DevOps Platform", owner: "Platform Engineering", opened: "Jul 7, 4:03 PM", age: "1d 19h" },
  { id: "INC0091544", title: "Reporting extract returned partial results", status: "Resolved", priority: "P3", service: "Data & Reporting", owner: "Data Operations", opened: "Jul 7, 11:22 AM", age: "2d" },
  { id: "INC0091490", title: "Entitlement sync queue backlog", status: "Closed", priority: "P3", service: "Client Identity", owner: "IAM Operations", opened: "Jul 6, 3:36 PM", age: "2d 20h" },
  { id: "INC0091422", title: "Notification delivery delay", status: "Closed", priority: "P4", service: "Communications", owner: "Messaging Services", opened: "Jul 5, 7:14 PM", age: "3d 16h" },
  { id: "INC0091386", title: "Cash-management export unavailable", status: "In Progress", priority: "P2", service: "Cash Management", owner: "Treasury Platforms", opened: "Jul 5, 10:08 AM", age: "4d 1h", risk: "SLA at risk" },
  { id: "INC0091344", title: "Client statement generation delay", status: "Resolved", priority: "P3", service: "Statements & Tax", owner: "Document Services", opened: "Jul 4, 6:31 PM", age: "4d 17h" },
  { id: "INC0091279", title: "Mobile push registration failures", status: "Closed", priority: "P3", service: "Mobile Experience", owner: "Digital Channels", opened: "Jul 3, 1:42 PM", age: "5d 22h" },
  { id: "INC0091198", title: "Reference-data reconciliation mismatch", status: "Closed", priority: "P3", service: "Data & Reporting", owner: "Data Operations", opened: "Jul 2, 8:15 AM", age: "7d 3h" },
  { id: "INC0091107", title: "Automated account-opening task stalled", status: "Closed", priority: "P4", service: "Account Opening", owner: "Workflow Operations", opened: "Jun 30, 3:20 PM", age: "8d 20h" },
];

const problems: Ticket[] = [
  { id: "PRB0012488", title: "Recurring token expiration under peak load", status: "RCA In Progress", priority: "P1", service: "Client Identity", owner: "IAM Engineering", opened: "Jun 29", age: "10d", risk: "RCA overdue" },
  { id: "PRB0012472", title: "Market data cache desynchronization", status: "Known Error", priority: "P2", service: "Trading Platform", owner: "Market Data", opened: "Jun 24", age: "15d" },
  { id: "PRB0012451", title: "Settlement batch contention", status: "Fix In Progress", priority: "P2", service: "Clearing & Settlement", owner: "Batch Services", opened: "Jun 17", age: "22d", risk: "Target at risk" },
  { id: "PRB0012439", title: "Document upload retry loop", status: "RCA In Progress", priority: "P2", service: "Advisor Portal", owner: "Digital Experience", opened: "Jun 11", age: "28d", risk: "RCA overdue" },
  { id: "PRB0012416", title: "API latency after connection pool recycle", status: "Known Error", priority: "P3", service: "Integration Gateway", owner: "API Platform", opened: "May 30", age: "40d" },
  { id: "PRB0012395", title: "Certificate renewal notification gap", status: "Closed", priority: "P3", service: "DevOps Platform", owner: "Platform Engineering", opened: "May 16", age: "54d" },
  { id: "PRB0012368", title: "Reporting partition skew", status: "Monitoring", priority: "P3", service: "Data & Reporting", owner: "Data Operations", opened: "Apr 28", age: "72d" },
  { id: "PRB0012311", title: "Entitlement queue poison message", status: "Closed", priority: "P3", service: "Client Identity", owner: "IAM Operations", opened: "Apr 4", age: "96d" },
  { id: "PRB0012294", title: "Cash export memory pressure", status: "RCA In Progress", priority: "P2", service: "Cash Management", owner: "Treasury Platforms", opened: "Mar 27", age: "104d", risk: "RCA overdue" },
  { id: "PRB0012262", title: "Statement rendering dependency timeout", status: "Known Error", priority: "P3", service: "Statements & Tax", owner: "Document Services", opened: "Mar 12", age: "119d" },
  { id: "PRB0012238", title: "Mobile registration token collision", status: "Fix In Progress", priority: "P3", service: "Mobile Experience", owner: "Digital Channels", opened: "Feb 21", age: "138d" },
  { id: "PRB0012181", title: "Account-opening workflow lock contention", status: "Monitoring", priority: "P3", service: "Account Opening", owner: "Workflow Operations", opened: "Jan 19", age: "171d" },
  { id: "PRB0012144", title: "Vendor reference file occasionally incomplete", status: "Closed", priority: "P4", service: "Data & Reporting", owner: "Data Operations", opened: "Dec 11", age: "210d" },
];

const changes: Ticket[] = [
  { id: "CHG0038412", title: "Identity gateway token cache update", status: "Scheduled", priority: "P2", service: "Client Identity", owner: "A. Shah", opened: "Jul 7", age: "2d", outcome: "Open", risk: "High" },
  { id: "CHG0038397", title: "Trading platform market-data patch", status: "Pending approval", priority: "P2", service: "Trading Platform", owner: "M. Rivera", opened: "Jul 6", age: "3d", outcome: "Open", risk: "Moderate" },
  { id: "CHG0038371", title: "Settlement database index optimization", status: "Ready", priority: "P3", service: "Clearing & Settlement", owner: "J. Wu", opened: "Jul 5", age: "4d", outcome: "Open", risk: "Moderate" },
  { id: "CHG0038324", title: "Advisor portal upload service release", status: "Closed", priority: "P3", service: "Advisor Portal", owner: "K. Patel", opened: "Jul 2", age: "7d", outcome: "Closed with issues", risk: "Moderate" },
  { id: "CHG0038299", title: "API gateway capacity increase", status: "Closed", priority: "P3", service: "Integration Gateway", owner: "S. Brooks", opened: "Jun 29", age: "10d", outcome: "Successful", risk: "Low" },
  { id: "CHG0038262", title: "Lower environment certificate rotation", status: "Closed", priority: "P4", service: "DevOps Platform", owner: "R. Chen", opened: "Jun 27", age: "12d", outcome: "Successful", risk: "Low" },
  { id: "CHG0038210", title: "Reporting cluster version update", status: "Closed", priority: "P2", service: "Data & Reporting", owner: "L. Martin", opened: "Jun 23", age: "16d", outcome: "Failed", risk: "High" },
  { id: "CHG0038184", title: "Entitlement service database migration", status: "Rescheduled", priority: "P2", service: "Client Identity", owner: "D. Kim", opened: "Jun 21", age: "18d", outcome: "Carried over", risk: "High" },
  { id: "CHG0038141", title: "Notification provider failover test", status: "Closed", priority: "P3", service: "Communications", owner: "P. Young", opened: "Jun 18", age: "21d", outcome: "Closed with issues", risk: "Moderate" },
  { id: "CHG0038106", title: "Cash export worker scaling", status: "Closed", priority: "P3", service: "Cash Management", owner: "E. Ford", opened: "Jun 16", age: "23d", outcome: "Successful", risk: "Low" },
  { id: "CHG0038073", title: "Statement renderer dependency update", status: "Closed", priority: "P3", service: "Statements & Tax", owner: "N. Hall", opened: "Jun 13", age: "26d", outcome: "Closed with issues", risk: "Moderate" },
  { id: "CHG0038027", title: "Mobile notification SDK rollout", status: "Closed", priority: "P3", service: "Mobile Experience", owner: "C. Evans", opened: "Jun 9", age: "30d", outcome: "Successful", risk: "Low" },
  { id: "CHG0037988", title: "Reference data ingestion redesign", status: "Closed", priority: "P2", service: "Data & Reporting", owner: "L. Martin", opened: "Jun 5", age: "34d", outcome: "Successful", risk: "Moderate" },
  { id: "CHG0037932", title: "Account-opening orchestration patch", status: "Closed", priority: "P2", service: "Account Opening", owner: "B. Lewis", opened: "May 30", age: "40d", outcome: "Failed", risk: "High" },
];

const releaseRecords: Release[] = [
  { id: "CHG0038299", day: 2, month: 6, title: "API gateway capacity increase", time: "10:00 PM", window: "10:00 PM–11:30 PM CT", service: "Integration Gateway", owner: "S. Brooks", risk: "Low", type: "Standard", status: "Complete", environment: "Production", summary: "Increase gateway worker capacity and tune autoscaling thresholds ahead of quarterly volume.", conditions: ["Synthetic checks green", "Error rate below 0.5%", "Rollback image retained 24h"] },
  { id: "CHG0038324", day: 6, month: 6, title: "Advisor portal upload release", time: "9:00 PM", window: "9:00 PM–11:00 PM CT", service: "Advisor Portal", owner: "K. Patel", risk: "Moderate", type: "Normal", status: "Complete", environment: "Production", summary: "Deploy retry-handling improvements for document uploads.", conditions: ["Post-deploy upload test required", "Support bridge held 60m", "Additional monitoring added after close"] },
  { id: "CHG0038371", day: 10, month: 6, title: "Settlement DB optimization", time: "11:00 PM", window: "11:00 PM–12:30 AM CT", service: "Clearing & Settlement", owner: "J. Wu", risk: "Moderate", type: "Normal", status: "Ready", environment: "Production", summary: "Apply index optimizations to reduce settlement batch contention.", conditions: ["DBA validation complete", "Batch baseline captured", "Rollback script tested"] },
  { id: "CHG0038397", day: 14, month: 6, title: "Market-data patch", time: "8:30 PM", window: "8:30 PM–10:30 PM CT", service: "Trading Platform", owner: "M. Rivera", risk: "Moderate", type: "Normal", status: "Pending approval", environment: "Production", summary: "Patch market-data cache synchronization and add drift telemetry.", conditions: ["CAB approval pending", "Vendor validation attached", "Trading smoke test assigned"] },
  { id: "CHG0038412", day: 17, month: 6, title: "Token cache update", time: "10:00 PM", window: "10:00 PM–12:00 AM CT", service: "Client Identity", owner: "A. Shah", risk: "High", type: "Normal", status: "Scheduled", environment: "Production", summary: "Update token caching behavior to address peak-load authentication failures.", conditions: ["P1 problem link required", "Rollback under 15 minutes", "War room staffed"] },
  { id: "CHG0038449", day: 21, month: 6, title: "Blue-green routing cutover", time: "9:30 PM", window: "9:30 PM–11:30 PM CT", service: "Advisor Portal", owner: "T. Green", risk: "High", type: "Normal", status: "Scheduled", environment: "Production", summary: "Move advisor traffic to the new green stack and validate end-to-end journeys.", conditions: ["NFR sign-off complete", "Observability dashboard live", "Rollback decision at +30m"] },
  { id: "CHG0038474", day: 24, month: 6, title: "Reporting cluster upgrade", time: "7:00 PM", window: "7:00 PM–11:00 PM CT", service: "Data & Reporting", owner: "L. Martin", risk: "Moderate", type: "Normal", status: "Ready", environment: "Production", summary: "Upgrade reporting compute nodes with phased validation.", conditions: ["Extract reconciliation complete", "Performance baseline attached", "Business validation by 10:30 PM"] },
  { id: "CHG0038501", day: 28, month: 6, title: "Messaging provider failover", time: "8:00 PM", window: "8:00 PM–9:30 PM CT", service: "Communications", owner: "P. Young", risk: "Low", type: "Standard", status: "Scheduled", environment: "Production", summary: "Exercise provider failover and confirm notification delivery paths.", conditions: ["Test recipient list approved", "Provider support notified", "Latency threshold below 90s"] },
  { id: "CHG0038538", day: 4, month: 7, title: "Identity datastore migration", time: "10:00 PM", window: "10:00 PM–1:00 AM CT", service: "Client Identity", owner: "D. Kim", risk: "High", type: "Normal", status: "Scheduled", environment: "Production", summary: "Migrate identity profile data to the resilient multi-region datastore.", conditions: ["Data reconciliation signed", "Failback tested", "Executive notification drafted"] },
  { id: "CHG0038572", day: 11, month: 7, title: "API contract release", time: "9:00 PM", window: "9:00 PM–10:30 PM CT", service: "Integration Gateway", owner: "S. Brooks", risk: "Moderate", type: "Normal", status: "Scheduled", environment: "Production", summary: "Publish backward-compatible API contracts for the portfolio reporting feed.", conditions: ["Consumer validation complete", "Schema registry updated", "Error budget healthy"] },
  { id: "CHG0038619", day: 18, month: 7, title: "Settlement resilience test", time: "11:30 PM", window: "11:30 PM–1:30 AM CT", service: "Clearing & Settlement", owner: "J. Wu", risk: "High", type: "Normal", status: "Pending approval", environment: "Production", summary: "Run controlled node-failure validation before peak processing season.", conditions: ["CAB approval pending", "Operations bridge booked", "Recovery checkpoint documented"] },
  { id: "CHG0038660", day: 25, month: 7, title: "Observability agent rollout", time: "8:00 PM", window: "8:00 PM–10:00 PM CT", service: "DevOps Platform", owner: "R. Chen", risk: "Low", type: "Standard", status: "Ready", environment: "Production", summary: "Deploy the standard observability agent across remaining production services.", conditions: ["Coverage report attached", "CPU overhead below 2%", "Dashboards pre-created"] },
  { id: "CHG0038704", day: 8, month: 8, title: "Emergency access hardening", time: "9:00 PM", window: "9:00 PM–10:00 PM CT", service: "Client Identity", owner: "A. Shah", risk: "Moderate", type: "Emergency", status: "Scheduled", environment: "Production", summary: "Harden break-glass access controls following quarterly review.", conditions: ["Security approval complete", "Access test scheduled", "Audit evidence retained"] },
  { id: "CHG0038756", day: 15, month: 8, title: "Trading release 26.9", time: "8:30 PM", window: "8:30 PM–11:30 PM CT", service: "Trading Platform", owner: "M. Rivera", risk: "High", type: "Normal", status: "Scheduled", environment: "Production", summary: "Deliver the September trading platform release train.", conditions: ["Regression suite green", "Business sign-off complete", "Rollback checkpoint at +45m"] },
  { id: "CHG0038812", day: 6, month: 9, title: "API gateway TLS refresh", time: "9:00 PM", window: "9:00 PM–10:30 PM CT", service: "Integration Gateway", owner: "S. Brooks", risk: "Low", type: "Standard", status: "Ready", environment: "Production", summary: "Rotate gateway certificates and validate downstream client trust chains.", conditions: ["Certificate chain validated", "Consumer notice complete", "Rollback bundle staged"] },
  { id: "CHG0038864", day: 20, month: 9, title: "Change-freeze readiness release", time: "8:00 PM", window: "8:00 PM–11:00 PM CT", service: "DevOps Platform", owner: "R. Chen", risk: "Moderate", type: "Normal", status: "Scheduled", environment: "Production", summary: "Complete platform tooling updates ahead of the year-end change freeze.", conditions: ["Freeze exception list reviewed", "Toolchain health green", "Support coverage confirmed"] },
  { id: "CHG0038919", day: 3, month: 10, title: "Tax processing capacity uplift", time: "10:00 PM", window: "10:00 PM–12:30 AM CT", service: "Statements & Tax", owner: "N. Hall", risk: "Moderate", type: "Normal", status: "Scheduled", environment: "Production", summary: "Add document-rendering capacity before year-end tax statement generation.", conditions: ["Load test target met", "Queue alarms validated", "Capacity rollback documented"] },
  { id: "CHG0038961", day: 17, month: 10, title: "Identity secondary-region activation", time: "9:30 PM", window: "9:30 PM–12:30 AM CT", service: "Client Identity", owner: "D. Kim", risk: "High", type: "Normal", status: "Pending approval", environment: "Production", summary: "Activate secondary-region identity services and validate controlled traffic failover.", conditions: ["Multi-region review approved", "Failback test complete", "Executive bridge staffed"] },
  { id: "CHG0039014", day: 9, month: 11, title: "Holiday freeze security exception", time: "11:00 PM", window: "11:00 PM–12:00 AM CT", service: "Client Identity", owner: "A. Shah", risk: "High", type: "Emergency", status: "Scheduled", environment: "Production", summary: "Deploy a narrowly scoped security fix during the year-end change freeze.", conditions: ["Emergency CAB approval", "Security validation attached", "Customer notification on standby"] },
  { id: "CHG0039077", day: 13, month: 12, title: "Annual certificate rotation", time: "8:00 PM", window: "8:00 PM–10:00 PM CT", service: "DevOps Platform", owner: "R. Chen", risk: "Low", type: "Standard", status: "Ready", environment: "Production", summary: "Rotate shared platform certificates across production services.", conditions: ["Inventory reconciliation complete", "Expiry alerts cleared", "Service-owner sign-off captured"] },
  { id: "CHG0039128", day: 27, month: 12, title: "Data-retention policy release", time: "9:00 PM", window: "9:00 PM–11:30 PM CT", service: "Data & Reporting", owner: "L. Martin", risk: "Moderate", type: "Normal", status: "Scheduled", environment: "Production", summary: "Apply updated retention policies and archive validation workflows.", conditions: ["Legal approval complete", "Archive restore tested", "Deletion evidence retained"] },
  { id: "CHG0039186", day: 10, month: 13, title: "Account-opening release 27.2", time: "8:30 PM", window: "8:30 PM–11:00 PM CT", service: "Account Opening", owner: "B. Lewis", risk: "Moderate", type: "Normal", status: "Scheduled", environment: "Production", summary: "Release workflow reliability and straight-through-processing improvements.", conditions: ["Journey regression green", "Operations playbook updated", "Conversion baseline captured"] },
  { id: "CHG0039231", day: 24, month: 13, title: "Advisor portal accessibility release", time: "9:00 PM", window: "9:00 PM–10:30 PM CT", service: "Advisor Portal", owner: "K. Patel", risk: "Low", type: "Standard", status: "Ready", environment: "Production", summary: "Deploy accessibility and navigation improvements across core advisor journeys.", conditions: ["Accessibility scan passed", "Keyboard testing complete", "Support notes published"] },
  { id: "CHG0039294", day: 7, month: 14, title: "Trading platform release 27.3", time: "8:00 PM", window: "8:00 PM–11:30 PM CT", service: "Trading Platform", owner: "M. Rivera", risk: "High", type: "Normal", status: "Scheduled", environment: "Production", summary: "Deliver the March trading release with routing and telemetry enhancements.", conditions: ["Trading certification complete", "Market-open rollback plan", "Business bridge staffed"] },
  { id: "CHG0039348", day: 21, month: 14, title: "Enterprise recovery exercise", time: "11:00 PM", window: "11:00 PM–2:00 AM CT", service: "Clearing & Settlement", owner: "J. Wu", risk: "High", type: "Normal", status: "Pending approval", environment: "Production", summary: "Exercise application recovery across settlement and identity dependencies.", conditions: ["Scenario approved", "Recovery checkpoints assigned", "Post-exercise review scheduled"] },
  { id: "CHG0039406", day: 4, month: 15, title: "Multi-region traffic cutover", time: "9:30 PM", window: "9:30 PM–1:00 AM CT", service: "Advisor Portal", owner: "T. Green", risk: "High", type: "Normal", status: "Scheduled", environment: "Production", summary: "Shift advisor traffic to the active-active regional architecture.", conditions: ["Regional readiness green", "NFR sign-off complete", "Failback under 20 minutes"] },
  { id: "CHG0039462", day: 18, month: 15, title: "QE automation framework update", time: "7:30 PM", window: "7:30 PM–9:00 PM CT", service: "DevOps Platform", owner: "R. Chen", risk: "Low", type: "Standard", status: "Ready", environment: "Production", summary: "Publish the shared test-automation framework and reporting integration.", conditions: ["Compatibility suite green", "Adoption guide published", "Pipeline rollback tagged"] },
  { id: "CHG0039524", day: 9, month: 16, title: "Observability standard rollout", time: "8:00 PM", window: "8:00 PM–10:00 PM CT", service: "Integration Gateway", owner: "S. Brooks", risk: "Moderate", type: "Normal", status: "Scheduled", environment: "Production", summary: "Complete mandatory service-level telemetry and alerting coverage.", conditions: ["Coverage threshold met", "Alert routing tested", "Runbooks linked"] },
  { id: "CHG0039581", day: 23, month: 16, title: "Settlement performance release", time: "10:30 PM", window: "10:30 PM–12:30 AM CT", service: "Clearing & Settlement", owner: "J. Wu", risk: "Moderate", type: "Normal", status: "Scheduled", environment: "Production", summary: "Deploy batch throughput and contention improvements.", conditions: ["Performance baseline approved", "Peak simulation passed", "DBA coverage confirmed"] },
  { id: "CHG0039643", day: 5, month: 17, title: "API platform version upgrade", time: "9:00 PM", window: "9:00 PM–12:00 AM CT", service: "Integration Gateway", owner: "S. Brooks", risk: "High", type: "Normal", status: "Pending approval", environment: "Production", summary: "Upgrade the shared API platform runtime with phased consumer validation.", conditions: ["Consumer matrix signed", "Canary thresholds defined", "Rollback image retained"] },
  { id: "CHG0039702", day: 19, month: 17, title: "Fiscal-year reporting release", time: "8:30 PM", window: "8:30 PM–11:00 PM CT", service: "Data & Reporting", owner: "L. Martin", risk: "Moderate", type: "Normal", status: "Scheduled", environment: "Production", summary: "Release fiscal-year reporting updates and executive portfolio extracts.", conditions: ["Finance validation complete", "Extract totals reconciled", "Business sign-off assigned"] },
];
const releases: Release[] = releaseRecords.map((release) => release.month > currentMonthKey ? { ...release, month: release.month - 12, status: "Complete" as const } : release);

const monthMeta = Array.from({ length: 12 }, (_, index) => {
  const key = currentMonthKey - 11 + index;
  const date = new Date(demoAsOf.getFullYear(), key, 1);
  return {
    key,
    label: date.toLocaleString("en-US", { month: "long", year: "numeric" }),
    short: date.toLocaleString("en-US", { month: "short" }),
    year: date.getFullYear(),
    days: new Date(2026, key + 1, 0).getDate(),
    start: date.getDay(),
  };
});

const serviceHealth: ServiceHealth[] = [
  { name: "Client Identity", owner: "IAM Engineering", score: 68, status: "At risk", availability: "99.71%", incidents: 12, p1: 1, mttr: "4h 08m", sla: "82%", problems: 3, overdueRca: 2, changeSuccess: "78%", nextRelease: "Jul 17", releaseRisk: "High", trend: -5, decision: "Approve token-cache rollback staffing and permanent-fix window" },
  { name: "Trading Platform", owner: "Market Data", score: 76, status: "Watch", availability: "99.89%", incidents: 8, p1: 0, mttr: "2h 41m", sla: "91%", problems: 2, overdueRca: 1, changeSuccess: "83%", nextRelease: "Jul 14", releaseRisk: "Moderate", trend: -2, decision: "Resolve CAB evidence before the market-data patch window" },
  { name: "Data & Reporting", owner: "Data Operations", score: 72, status: "Watch", availability: "99.82%", incidents: 9, p1: 0, mttr: "3h 26m", sla: "87%", problems: 3, overdueRca: 1, changeSuccess: "75%", nextRelease: "Jul 24", releaseRisk: "Moderate", trend: -4, decision: "Confirm validation owner after the failed cluster upgrade" },
  { name: "Clearing & Settlement", owner: "Batch Services", score: 81, status: "Watch", availability: "99.93%", incidents: 6, p1: 0, mttr: "2h 18m", sla: "94%", problems: 2, overdueRca: 1, changeSuccess: "88%", nextRelease: "Jul 10", releaseRisk: "Moderate", trend: 1, decision: "Validate batch baseline before index optimization" },
  { name: "Advisor Portal", owner: "Digital Experience", score: 84, status: "Healthy", availability: "99.95%", incidents: 5, p1: 0, mttr: "1h 54m", sla: "96%", problems: 2, overdueRca: 1, changeSuccess: "91%", nextRelease: "Jul 21", releaseRisk: "High", trend: 3, decision: "Confirm rollback checkpoint for blue-green cutover" },
  { name: "Integration Gateway", owner: "API Platform", score: 91, status: "Healthy", availability: "99.98%", incidents: 3, p1: 0, mttr: "1h 22m", sla: "99%", problems: 1, overdueRca: 0, changeSuccess: "96%", nextRelease: "Jul 28", releaseRisk: "Low", trend: 4, decision: "No leadership decision required" },
];

const lineages: Lineage[] = [
  {
    title: "Peak-load authentication failure",
    service: "Client Identity",
    impact: "P1 disruption with SLA exposure and repeat authentication failures",
    owner: "A. Shah",
    due: "Jul 10",
    decision: "Approve rollback staffing and the permanent-fix deployment window",
    state: "Decision due",
    items: [
      { label: "Incident", id: "INC0091842", view: "incidents" },
      { label: "Problem", id: "PRB0012488", view: "problems" },
      { label: "Fix change", id: "CHG0038412", view: "changes" },
      { label: "Release", id: "CHG0038412", view: "releases" },
    ],
  },
  {
    title: "Reporting cluster validation failure",
    service: "Data & Reporting",
    impact: "Failed change increased delivery risk for the July reporting release",
    owner: "L. Martin",
    due: "Jul 12",
    decision: "Confirm remediation evidence and a named business-validation owner",
    state: "In remediation",
    items: [
      { label: "Incident", id: "INC0091544", view: "incidents" },
      { label: "Problem", id: "PRB0012416", view: "problems" },
      { label: "Failed change", id: "CHG0038210", view: "changes" },
      { label: "Release", id: "CHG0038474", view: "releases" },
    ],
  },
  {
    title: "Settlement batch contention",
    service: "Clearing & Settlement",
    impact: "Recurring processing-window pressure with a permanent fix ready",
    owner: "J. Wu",
    due: "Jul 11",
    decision: "Review post-release batch performance against the captured baseline",
    state: "Monitoring",
    items: [
      { label: "Incident", id: "INC0091764", view: "incidents" },
      { label: "Problem", id: "PRB0012451", view: "problems" },
      { label: "Fix change", id: "CHG0038371", view: "changes" },
      { label: "Release", id: "CHG0038371", view: "releases" },
    ],
  },
];

function StatusPill({ value }: { value: string }) {
  const key = value.toLowerCase().replaceAll(" ", "-");
  return <span className={`status-pill status-${key}`}>{value}</span>;
}

function MiniTrend({ opened, closed }: { opened: number[]; closed: number[] }) {
  const max = Math.max(...opened, ...closed);
  return (
    <div className="mini-trend" aria-label="Twelve month opened versus closed trend">
      {trendMonths.map((month, index) => (
        <div className="trend-column" key={month}>
          <div className="trend-bars">
            <span className="bar opened" style={{ height: `${Math.max(14, (opened[index] / max) * 62)}px` }} />
            <span className="bar closed" style={{ height: `${Math.max(14, (closed[index] / max) * 62)}px` }} />
          </div>
          <span>{month}</span>
        </div>
      ))}
    </div>
  );
}

function TrendLineChart({ months, opened, closed, label }: { months: string[]; opened: number[]; closed: number[]; label: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const draw = () => {
      const width = canvas.clientWidth;
      const height = 250;
      const ratio = window.devicePixelRatio || 1;
      canvas.width = Math.max(1, Math.floor(width * ratio));
      canvas.height = Math.floor(height * ratio);
      const context = canvas.getContext("2d");
      if (!context) return;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      context.clearRect(0, 0, width, height);

      const styles = getComputedStyle(document.documentElement);
      const muted = styles.getPropertyValue("--muted").trim() || "#69717c";
      const line = styles.getPropertyValue("--line").trim() || "#ded7c9";
      const openedColor = styles.getPropertyValue("--amber").trim() || "#b88a3d";
      const closedColor = styles.getPropertyValue("--green").trim() || "#2f8564";
      const panel = styles.getPropertyValue("--surface").trim() || "#fffdf7";
      const padding = { top: 18, right: 14, bottom: 34, left: 38 };
      const plotWidth = width - padding.left - padding.right;
      const plotHeight = height - padding.top - padding.bottom;
      const rawMax = Math.max(...opened, ...closed);
      const interval = rawMax > 100 ? 50 : 5;
      const chartMax = Math.max(interval, Math.ceil(rawMax / interval) * interval);

      context.font = "10px Inter, system-ui, sans-serif";
      context.textBaseline = "middle";
      for (let gridIndex = 0; gridIndex <= 4; gridIndex += 1) {
        const y = padding.top + (plotHeight * gridIndex) / 4;
        const value = Math.round(chartMax - (chartMax * gridIndex) / 4);
        context.beginPath();
        context.strokeStyle = line;
        context.globalAlpha = .7;
        context.lineWidth = 1;
        context.moveTo(padding.left, y);
        context.lineTo(width - padding.right, y);
        context.stroke();
        context.globalAlpha = 1;
        context.fillStyle = muted;
        context.textAlign = "right";
        context.fillText(String(value), padding.left - 8, y);
      }

      const xFor = (index: number) => padding.left + (plotWidth * index) / Math.max(1, months.length - 1);
      const yFor = (value: number) => padding.top + plotHeight - (value / chartMax) * plotHeight;

      months.forEach((month, index) => {
        if (width < 520 && index % 2 !== 0 && index !== months.length - 1) return;
        context.fillStyle = muted;
        context.textAlign = "center";
        context.textBaseline = "top";
        context.fillText(month, xFor(index), height - 22);
      });

      const drawSeries = (values: number[], color: string) => {
        context.beginPath();
        values.forEach((value, index) => {
          const x = xFor(index);
          const y = yFor(value);
          if (index === 0) context.moveTo(x, y);
          else context.lineTo(x, y);
        });
        context.strokeStyle = color;
        context.lineWidth = 2.75;
        context.lineJoin = "round";
        context.lineCap = "round";
        context.stroke();
        values.forEach((value, index) => {
          context.beginPath();
          context.arc(xFor(index), yFor(value), 3.25, 0, Math.PI * 2);
          context.fillStyle = panel;
          context.fill();
          context.lineWidth = 2;
          context.strokeStyle = color;
          context.stroke();
        });
      };

      drawSeries(opened, openedColor);
      drawSeries(closed, closedColor);
    };

    draw();
    const observer = new ResizeObserver(draw);
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [months, opened, closed]);

  const accessibleSummary = months.map((month, index) => `${month}: ${opened[index]} opened and ${closed[index]} closed`).join("; ");
  return <canvas ref={canvasRef} className="line-chart-canvas" role="img" aria-label={`${label}. ${accessibleSummary}`} />;
}

function OperationalTrends({ openDetail }: { openDetail: (view: View, filter?: FilterState) => void }) {
  const [range, setRange] = useState<6 | 12>(12);
  const months = trendMonths.slice(-range);
  const incidentOpened = trends.incidents.opened.slice(-range);
  const incidentClosed = trends.incidents.closed.slice(-range);
  const problemOpened = trends.problems.opened.slice(-range);
  const problemClosed = trends.problems.closed.slice(-range);
  const currentLabel = trendMonths.at(-1) || "Current";
  const currentIncidentOpened = trends.incidents.opened.at(-1) || 0;
  const currentIncidentClosed = trends.incidents.closed.at(-1) || 0;
  const currentProblemOpened = trends.problems.opened.at(-1) || 0;
  const currentProblemClosed = trends.problems.closed.at(-1) || 0;

  return (
    <section className="trend-section" aria-label="Month-over-month operational trends">
      <div className="section-heading trend-section-heading">
        <div><span className="eyebrow">Operational flow</span><h2>Opened vs. closed month over month</h2><p>Volume trend through {dataThroughLabel}. Closure lines above intake indicate backlog burn-down.</p></div>
        <div className="range-toggle" role="group" aria-label="Trend period">
          <button className={range === 6 ? "active" : ""} onClick={() => setRange(6)}>6M</button>
          <button className={range === 12 ? "active" : ""} onClick={() => setRange(12)}>12M</button>
        </div>
      </div>
      <div className="line-chart-grid">
        <article className="panel line-chart-card">
          <div className="line-chart-header">
            <div><span className="eyebrow">Service restoration</span><h3>Incident flow</h3></div>
            <button className="text-link" onClick={() => openDetail("incidents")}>View records →</button>
          </div>
          <div className="line-chart-kpis"><div><span>{currentLabel} opened</span><strong>{currentIncidentOpened}</strong></div><div><span>{currentLabel} closed</span><strong>{currentIncidentClosed}</strong></div><div className="negative"><span>Net flow</span><strong>{currentIncidentOpened - currentIncidentClosed > 0 ? "+" : ""}{currentIncidentOpened - currentIncidentClosed}</strong></div><div><span>Closure ratio</span><strong>{Math.round((currentIncidentClosed / currentIncidentOpened) * 100)}%</strong></div></div>
          <div className="line-chart-legend"><span><i className="legend-opened" /> Opened</span><span><i className="legend-closed" /> Closed</span></div>
          <TrendLineChart months={months} opened={incidentOpened} closed={incidentClosed} label="Incident opened and closed trend" />
          <div className="chart-insight"><span>Watch</span><p>July intake outpaced closures after five months of near-parity or burn-down.</p></div>
        </article>
        <article className="panel line-chart-card">
          <div className="line-chart-header">
            <div><span className="eyebrow">Root-cause elimination</span><h3>Problem flow</h3></div>
            <button className="text-link" onClick={() => openDetail("problems")}>View records →</button>
          </div>
          <div className="line-chart-kpis"><div><span>{currentLabel} opened</span><strong>{currentProblemOpened}</strong></div><div><span>{currentLabel} closed</span><strong>{currentProblemClosed}</strong></div><div className="negative"><span>Net flow</span><strong>{currentProblemOpened - currentProblemClosed > 0 ? "+" : ""}{currentProblemOpened - currentProblemClosed}</strong></div><div><span>Closure ratio</span><strong>{Math.round((currentProblemClosed / currentProblemOpened) * 100)}%</strong></div></div>
          <div className="line-chart-legend"><span><i className="legend-opened" /> Opened</span><span><i className="legend-closed" /> Closed</span></div>
          <TrendLineChart months={months} opened={problemOpened} closed={problemClosed} label="Problem opened and closed trend" />
          <div className="chart-insight"><span>Action</span><p>Problem creation is accelerating while overdue RCA volume remains concentrated in identity and digital services.</p></div>
        </article>
      </div>
    </section>
  );
}

function MetricMethodology() {
  return (
    <details className="metric-methodology">
      <summary>
        <span><strong>How Portfolio Health is calculated</strong><small>Five weighted operating dimensions · synthetic demonstration</small></span>
        <b>{portfolioScore}/100</b>
      </summary>
      <div className="methodology-grid">
        {healthDimensions.map((dimension) => (
          <div key={dimension.label}>
            <span>{dimension.label}<small>{dimension.weight}% weight</small></span>
            <strong>{dimension.value}</strong>
            <i><b style={{ width: `${dimension.value}%` }} /></i>
            <p>{dimension.definition}</p>
          </div>
        ))}
      </div>
      <p className="methodology-note">The score is a weighted synthetic index for this demo. It is not a native ServiceNow measure and should be recalibrated to an organization&apos;s targets before production use.</p>
    </details>
  );
}

function ServiceHealthPreview({ openDetail }: { openDetail: (view: View, filter?: FilterState) => void }) {
  return (
    <section className="panel service-preview">
      <div className="panel-heading">
        <div><span className="eyebrow">Portfolio by business service</span><h2>Service health and accountability</h2></div>
        <button className="text-link" onClick={() => openDetail("services")}>Open service portfolio →</button>
      </div>
      <div className="service-preview-grid">
        {serviceHealth.slice(0, 4).map((service) => (
          <article key={service.name}>
            <div className="service-score"><strong>{service.score}</strong><StatusPill value={service.status} /></div>
            <h3>{service.name}</h3>
            <p>{service.owner}</p>
            <dl>
              <div><dt>Incidents</dt><dd>{service.incidents}</dd></div>
              <div><dt>SLA</dt><dd>{service.sla}</dd></div>
              <div><dt>RCA due</dt><dd>{service.overdueRca}</dd></div>
              <div><dt>Change success</dt><dd>{service.changeSuccess}</dd></div>
            </dl>
            <button onClick={() => openDetail("incidents", { service: service.name })}>Review service records <span>→</span></button>
          </article>
        ))}
      </div>
    </section>
  );
}

function LineagePanel({ openDetail }: { openDetail: (view: View, filter?: FilterState) => void }) {
  const openItem = (item: LineageItem) => {
    if (item.view === "releases") openDetail("releases", { releaseId: item.id });
    else openDetail(item.view, { search: item.id });
  };

  return (
    <section className="lineage-section" aria-label="Linked operational record lineage">
      <div className="section-heading">
        <div><span className="eyebrow">Cause to permanent resolution</span><h2>Linked record lineage</h2><p>Trace disruption through root cause, remediation, release, and operating decision.</p></div>
      </div>
      <div className="lineage-grid">
        {lineages.map((lineage) => (
          <article className="panel lineage-card" key={lineage.title}>
            <div className="lineage-heading"><div><StatusPill value={lineage.state} /><h3>{lineage.title}</h3><p>{lineage.service} · {lineage.impact}</p></div><span>{lineage.due}</span></div>
            <div className="lineage-track">
              {lineage.items.map((item, index) => (
                <div key={`${lineage.title}-${item.label}`}>
                  <button onClick={() => openItem(item)}><span>{item.label}</span><strong>{item.id}</strong></button>
                  {index < lineage.items.length - 1 && <i aria-hidden="true">→</i>}
                </div>
              ))}
            </div>
            <div className="decision-row"><span>Decision / exit criterion</span><strong>{lineage.decision}</strong><small>Accountable: {lineage.owner}</small></div>
          </article>
        ))}
      </div>
    </section>
  );
}

function ServicePortfolio({ openDetail }: { openDetail: (view: View, filter?: FilterState) => void }) {
  return (
    <section className="service-view">
      <div className="detail-header service-header">
        <div><span className="eyebrow">Portfolio operating model</span><h1>Service health</h1><p>Compare operational exposure, remediation debt, change quality, and accountable decisions by business service.</p></div>
        <div className="summary-chip"><span>Services at risk</span><strong>{serviceHealth.filter((service) => service.status === "At risk").length}</strong></div>
      </div>
      <div className="service-scorecard-grid">
        {serviceHealth.map((service) => (
          <article className="panel service-scorecard" key={service.name}>
            <div className="service-scorecard-heading">
              <div><span className="eyebrow">{service.owner}</span><h2>{service.name}</h2></div>
              <div className="service-score"><strong>{service.score}</strong><StatusPill value={service.status} /></div>
            </div>
            <div className="service-score-track"><i style={{ width: `${service.score}%` }} /></div>
            <dl className="service-kpis">
              <div><dt>Availability</dt><dd>{service.availability}</dd></div>
              <div><dt>Incidents</dt><dd>{service.incidents}{service.p1 > 0 && <small>{service.p1} P1</small>}</dd></div>
              <div><dt>MTTR</dt><dd>{service.mttr}</dd></div>
              <div><dt>SLA</dt><dd>{service.sla}</dd></div>
              <div><dt>Open problems</dt><dd>{service.problems}</dd></div>
              <div><dt>RCA overdue</dt><dd>{service.overdueRca}</dd></div>
              <div><dt>Change success</dt><dd>{service.changeSuccess}</dd></div>
              <div><dt>Next release</dt><dd>{service.nextRelease}<small>{service.releaseRisk} risk</small></dd></div>
            </dl>
            <div className="service-decision"><span>Leadership action</span><p>{service.decision}</p></div>
            <div className="service-actions"><button onClick={() => openDetail("incidents", { service: service.name })}>Incidents</button><button onClick={() => openDetail("problems", { service: service.name })}>Problems</button><button onClick={() => openDetail("changes", { service: service.name })}>Changes</button></div>
          </article>
        ))}
      </div>
      <LineagePanel openDetail={openDetail} />
      <MetricMethodology />
    </section>
  );
}

function PortfolioCard({
  eyebrow,
  title,
  opened,
  closed,
  trend,
  children,
  onOpen,
}: {
  eyebrow: string;
  title: string;
  opened: string;
  closed: string;
  trend: { opened: number[]; closed: number[] };
  children: React.ReactNode;
  onOpen: () => void;
}) {
  return (
    <article className="portfolio-card">
      <div className="card-heading">
        <div>
          <span className="eyebrow">{eyebrow}</span>
          <h2>{title}</h2>
        </div>
        <button className="icon-button" aria-label={`Open ${title}`} onClick={onOpen}>↗</button>
      </div>
      <div className="volume-row">
        <div><span>Open</span><strong>{opened}</strong></div>
        <div><span>Closed · 30d</span><strong>{closed}</strong></div>
      </div>
      <MiniTrend {...trend} />
      <div className="trend-legend"><span><i className="legend-opened" /> Opened</span><span><i className="legend-closed" /> Closed</span></div>
      <div className="card-footer">{children}</div>
    </article>
  );
}

function Overview({ openDetail }: { openDetail: (view: View, filter?: FilterState) => void }) {
  return (
    <>
      <section className="hero-band">
        <div>
          <div className="hero-kicker"><span className="live-dot" /> Simulated ServiceNow portfolio feed</div>
          <h1>Operational health, in one decision-ready view.</h1>
          <p>Track service disruption, root-cause progress, change execution, and release risk across the portfolio.</p>
        </div>
        <div className="hero-aside">
          <span>Portfolio health</span>
          <strong>{portfolioScore}</strong>
          <div className="score-track"><i style={{ width: `${portfolioScore}%` }} /></div>
          <small>Weighted synthetic index · 5 dimensions</small>
        </div>
      </section>

      <section className="watch-strip" aria-label="Portfolio watchlist">
        <div className="watch-title"><span className="watch-icon">!</span><div><strong>Leadership watchlist</strong><small>Signals requiring action or awareness</small></div></div>
        <button onClick={() => openDetail("incidents", { priority: "P1" })}><strong>2</strong><span>Major incidents</span><small>1 change-related</small></button>
        <button onClick={() => openDetail("incidents", { status: "SLA at risk" })}><strong>8</strong><span>SLAs at risk</span><small>+2 since yesterday</small></button>
        <button onClick={() => openDetail("problems", { status: "RCA overdue" })}><strong>6</strong><span>RCA overdue</span><small>Oldest: 18 days</small></button>
        <button onClick={() => openDetail("changes", { outcome: "Failed / carried over" })}><strong>5</strong><span>Failed / carried</span><small>Rolling 30 days</small></button>
      </section>

      <MetricMethodology />

      <section className="section-heading">
        <div><span className="eyebrow">Core ITSM signals</span><h2>Flow and outcomes</h2></div>
        <div className="as-of">Data through {dataThroughLabel} · <span>Synthetic demo dataset</span></div>
      </section>

      <section className="portfolio-grid">
        <PortfolioCard eyebrow="Service restoration" title="Incidents" opened={String(portfolioMetrics.incidents.open)} closed={String(portfolioMetrics.incidents.closed)} trend={trends.incidents} onOpen={() => openDetail("incidents")}>
          <button onClick={() => openDetail("incidents", { priority: "P1" })}><strong className="critical-text">{portfolioMetrics.incidents.p1}</strong><span>P1 active</span></button>
          <button onClick={() => openDetail("incidents", { status: "SLA at risk" })}><strong>{portfolioMetrics.incidents.slaRisk}</strong><span>SLA risk</span></button>
          <div><strong>{portfolioMetrics.incidents.mttr}</strong><span>MTTR</span></div>
        </PortfolioCard>
        <PortfolioCard eyebrow="Root-cause elimination" title="Problems" opened={String(portfolioMetrics.problems.open)} closed={String(portfolioMetrics.problems.closed)} trend={trends.problems} onOpen={() => openDetail("problems")}>
          <button onClick={() => openDetail("problems", { status: "RCA overdue" })}><strong className="warning-text">{portfolioMetrics.problems.overdueRca}</strong><span>RCA overdue</span></button>
          <button onClick={() => openDetail("problems", { status: "Known Error" })}><strong>{portfolioMetrics.problems.knownErrors}</strong><span>Known errors</span></button>
          <div><strong>{portfolioMetrics.problems.repeatDrivers}</strong><span>Repeat drivers</span></div>
        </PortfolioCard>
        <PortfolioCard eyebrow="Release execution" title="Changes" opened={String(portfolioMetrics.changes.open)} closed={String(portfolioMetrics.changes.closed)} trend={trends.changes} onOpen={() => openDetail("changes")}>
          <button onClick={() => openDetail("changes", { outcome: "Closed with issues" })}><strong className="warning-text">{portfolioMetrics.changes.withIssues}</strong><span>With issues</span></button>
          <button onClick={() => openDetail("changes", { outcome: "Failed / carried over" })}><strong className="critical-text">{portfolioMetrics.changes.failed + portfolioMetrics.changes.carried}</strong><span>Failed / carried</span></button>
          <div><strong>{changeSuccessRate}%</strong><span>Success rate</span></div>
        </PortfolioCard>
      </section>

      <ServiceHealthPreview openDetail={openDetail} />

      <OperationalTrends openDetail={openDetail} />

      <section className="insights-grid">
        <article className="panel change-health">
          <div className="panel-heading"><div><span className="eyebrow">Change outcomes · 30 days</span><h2>Execution quality</h2></div><button className="text-link" onClick={() => openDetail("changes")}>Review changes →</button></div>
          <div className="health-content">
            <div className="donut" role="img" aria-label={`Change success rate ${changeSuccessRate} percent`}><div><strong>{changeSuccessRate}%</strong><span>successful</span></div></div>
            <div className="outcome-list">
              <button onClick={() => openDetail("changes", { outcome: "Successful" })}><i className="dot-success" /><span>Successful</span><strong>{changeOutcomes.successful}</strong></button>
              <button onClick={() => openDetail("changes", { outcome: "Closed with issues" })}><i className="dot-warning" /><span>Closed with issues</span><strong>{changeOutcomes.withIssues}</strong></button>
              <button onClick={() => openDetail("changes", { outcome: "Failed" })}><i className="dot-danger" /><span>Failed</span><strong>{changeOutcomes.failed}</strong></button>
              <button onClick={() => openDetail("changes", { outcome: "Carried over" })}><i className="dot-muted" /><span>Carried over</span><strong>{changeOutcomes.carried}</strong></button>
            </div>
          </div>
          <div className="caused-row"><span>Incidents caused by change</span><div><b>P1</b><strong>1</strong></div><div><b>P2</b><strong>2</strong></div><div><b>P3</b><strong>3</strong></div></div>
        </article>

        <article className="panel attention-panel">
          <div className="panel-heading"><div><span className="eyebrow">Prioritized by business impact</span><h2>Needs attention</h2></div><span className="count-badge">4 items</span></div>
          <button onClick={() => openDetail("incidents", { priority: "P1" })}><span className="priority-box p1">P1</span><div><strong>Authentication failures remain active</strong><small>Client Identity · INC0091842 · 3h 18m</small></div><span>→</span></button>
          <button onClick={() => openDetail("problems", { status: "RCA overdue" })}><span className="priority-box overdue">RCA</span><div><strong>Token expiration root cause overdue</strong><small>Client Identity · PRB0012488 · 4 days late</small></div><span>→</span></button>
          <button onClick={() => openDetail("changes", { outcome: "Failed" })}><span className="priority-box failed">CHG</span><div><strong>Reporting upgrade failed validation</strong><small>Data & Reporting · CHG0038210</small></div><span>→</span></button>
          <button onClick={() => openDetail("releases")}><span className="priority-box cab">CAB</span><div><strong>Market-data patch awaits approval</strong><small>Deploys Jul 14 · Moderate risk</small></div><span>→</span></button>
        </article>
      </section>

      <section className="panel release-preview">
        <div className="panel-heading"><div><span className="eyebrow">Next 14 days</span><h2>Release horizon</h2></div><button className="text-link" onClick={() => openDetail("releases")}>Open full calendar →</button></div>
        <div className="release-track">
          {releases.filter((item) => item.month === currentMonthKey && item.day > demoAsOf.getDate() && item.day <= demoAsOf.getDate() + 14).map((release) => (
            <button key={release.id} onClick={() => openDetail("releases", { releaseId: release.id })}>
              <span className="release-date"><b>{monthMeta.at(-1)?.short.toUpperCase()}</b><strong>{release.day}</strong></span>
              <div><strong>{release.title}</strong><small>{release.service} · {release.time}</small></div>
              <StatusPill value={release.risk} />
            </button>
          ))}
        </div>
      </section>
    </>
  );
}

function DetailTable({ view, initialFilter }: { view: Exclude<View, "overview" | "services" | "releases">; initialFilter: FilterState }) {
  const source = view === "incidents" ? incidents : view === "problems" ? problems : changes;
  const [search, setSearch] = useState(initialFilter.search || "");
  const [status, setStatus] = useState(initialFilter.status || "All");
  const [outcome, setOutcome] = useState(initialFilter.outcome || "All");
  const [priority, setPriority] = useState(initialFilter.priority || "All");
  const [service, setService] = useState(initialFilter.service || "All");
  const [selected, setSelected] = useState<Ticket | null>(null);

  const filtered = source.filter((item) => {
    const matchesSearch = `${item.id} ${item.title} ${item.service} ${item.owner}`.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = status === "All" || item.status === status || (status === "SLA at risk" && item.risk === "SLA at risk") || (status === "RCA overdue" && item.risk === "RCA overdue");
    const matchesOutcome = outcome === "All" || item.outcome === outcome || (outcome === "Failed / carried over" && ["Failed", "Carried over"].includes(item.outcome || ""));
    return matchesSearch && matchesStatus && matchesOutcome && (priority === "All" || item.priority === priority) && (service === "All" || item.service === service);
  });

  const labels = { incidents: { title: "Incident records", subtitle: "Service restoration, ownership, and SLA exposure" }, problems: { title: "Problem records", subtitle: "Root-cause progress, known errors, and permanent resolution" }, changes: { title: "Change records", subtitle: "Release readiness, execution quality, and closure outcomes" } }[view];
  const statuses = Array.from(new Set(source.map((item) => item.status)));
  const outcomes = Array.from(new Set(source.map((item) => item.outcome).filter(Boolean))) as string[];
  const services = Array.from(new Set(source.map((item) => item.service))).sort();

  return (
    <section className="detail-view">
      <div className="detail-header">
        <div><span className="eyebrow">Synthetic ServiceNow-style record view</span><h1>{labels.title}</h1><p>{labels.subtitle}</p></div>
        <div className="summary-chip"><span>Portfolio total</span><strong>{view === "incidents" ? portfolioMetrics.incidents.open + portfolioMetrics.incidents.closed : view === "problems" ? portfolioMetrics.problems.open + portfolioMetrics.problems.closed : portfolioMetrics.changes.open + portfolioMetrics.changes.closed}</strong></div>
      </div>
      <div className="filter-bar">
        <label className="search-field"><span>⌕</span><input aria-label="Search records" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search ID, title, service, or owner" /></label>
        <label><span>Status</span><select value={status} onChange={(event) => setStatus(event.target.value)}><option>All</option>{statuses.map((item) => <option key={item}>{item}</option>)}{view === "incidents" && <option>SLA at risk</option>}{view === "problems" && <option>RCA overdue</option>}</select></label>
        {view === "changes" && <label><span>Outcome</span><select value={outcome} onChange={(event) => setOutcome(event.target.value)}><option>All</option><option>Failed / carried over</option>{outcomes.map((item) => <option key={item}>{item}</option>)}</select></label>}
        <label><span>Priority</span><select value={priority} onChange={(event) => setPriority(event.target.value)}><option>All</option><option>P1</option><option>P2</option><option>P3</option><option>P4</option></select></label>
        <label><span>Business service</span><select value={service} onChange={(event) => setService(event.target.value)}><option>All</option>{services.map((item) => <option key={item}>{item}</option>)}</select></label>
        {(status !== "All" || outcome !== "All" || priority !== "All" || service !== "All" || search) && <button className="clear-button" onClick={() => { setStatus("All"); setOutcome("All"); setPriority("All"); setService("All"); setSearch(""); }}>Clear filters</button>}
      </div>
      <div className="table-meta"><span>Showing {filtered.length} representative records</span><small>Synthetic data · Snapshot through {dataThroughLabel}</small></div>
      <div className="table-shell">
        <table>
          <thead><tr><th>Record</th><th>Status</th><th>{view === "changes" ? "Outcome" : "Priority"}</th><th>Business service</th><th>Owner / group</th><th>Opened</th><th>Age</th><th aria-label="Open record" /></tr></thead>
          <tbody>
            {filtered.map((item) => (
              <tr key={item.id} onClick={() => setSelected(item)}>
                <td><button className="record-link" onClick={() => setSelected(item)}><strong>{item.id}</strong><span>{item.title}</span></button></td>
                <td><StatusPill value={item.status} />{item.risk && !["Low", "Moderate", "High"].includes(item.risk) && <small className="risk-note">{item.risk}</small>}</td>
                <td>{view === "changes" ? <StatusPill value={item.outcome || "Open"} /> : <span className={`priority-text ${item.priority.toLowerCase()}`}>{item.priority}</span>}</td>
                <td>{item.service}</td><td>{item.owner}</td><td>{item.opened}</td><td>{item.age}</td><td><button className="row-arrow" aria-label={`Open ${item.id}`} onClick={() => setSelected(item)}>→</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div className="empty-state"><strong>No records match these filters.</strong><span>Try widening the status or priority selection.</span></div>}
      </div>
      {selected && <RecordDrawer item={selected} view={view} onClose={() => setSelected(null)} />}
    </section>
  );
}

function useModalDialog(onClose: () => void) {
  const dialogRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    const dialog = dialogRef.current;
    document.body.style.overflow = "hidden";
    window.requestAnimationFrame(() => dialog?.querySelector<HTMLElement>("[data-dialog-close]")?.focus());

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab" || !dialog) return;
      const focusable = Array.from(dialog.querySelectorAll<HTMLElement>("button:not(:disabled), [href], input, select, textarea, [tabindex]:not([tabindex='-1'])"));
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, [onClose]);

  return dialogRef;
}

function RecordDrawer({ item, view, onClose }: { item: Ticket; view: string; onClose: () => void }) {
  const dialogRef = useModalDialog(onClose);
  const titleId = `record-drawer-${item.id}`;
  return (
    <div className="drawer-backdrop" onClick={onClose} role="presentation">
      <aside ref={dialogRef} className="record-drawer" onClick={(event) => event.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby={titleId} tabIndex={-1}>
        <div className="drawer-top"><div><span className="eyebrow">{view.slice(0, -1)} record</span><h2 id={titleId}>{item.id}</h2></div><button data-dialog-close className="close-button" onClick={onClose} aria-label="Close details">×</button></div>
        <h3>{item.title}</h3>
        <div className="drawer-status"><StatusPill value={item.status} /><span className={`priority-text ${item.priority.toLowerCase()}`}>{item.priority}</span>{item.outcome && <StatusPill value={item.outcome} />}</div>
        <dl className="detail-list"><div><dt>Business service</dt><dd>{item.service}</dd></div><div><dt>Assignment</dt><dd>{item.owner}</dd></div><div><dt>Opened</dt><dd>{item.opened}</dd></div><div><dt>Current age</dt><dd>{item.age}</dd></div></dl>
        <div className="drawer-section"><span>Portfolio context</span><p>{view === "incidents" ? "Service restoration is active. Track SLA exposure and link any repeat pattern to a problem record." : view === "problems" ? "Root-cause ownership is established. Permanent-resolution evidence and linked incident reduction remain the exit criteria." : "Readiness, execution evidence, and post-implementation validation determine the final change outcome."}</p></div>
        <div className="activity"><span>Recent activity</span><div><i /><p><strong>Record updated</strong><small>12 minutes ago · {item.owner}</small></p></div><div><i /><p><strong>Portfolio signal recalculated</strong><small>2 hours ago · Automated feed</small></p></div><div><i /><p><strong>Leadership view synchronized</strong><small>Today · Portfolio automation</small></p></div></div>
        <button className="demo-action" disabled>ServiceNow link unavailable in demo</button>
      </aside>
    </div>
  );
}

function ReleaseCalendar({ requestedId }: { requestedId?: string }) {
  const initialMonth = requestedId ? releases.find((item) => item.id === requestedId)?.month ?? currentMonthKey : currentMonthKey;
  const [month, setMonth] = useState(initialMonth);
  const [selected, setSelected] = useState<Release | null>(requestedId ? releases.find((item) => item.id === requestedId) || null : null);
  const [display, setDisplay] = useState<"calendar" | "agenda">("calendar");
  const monthData = monthMeta.find((item) => item.key === month) || monthMeta[0];
  const monthReleases = releases.filter((item) => item.month === month).sort((left, right) => left.day - right.day);
  const totalCells = Math.ceil((monthData.start + monthData.days) / 7) * 7;
  const cells = Array.from({ length: totalCells }, (_, index) => {
    const day = index - monthData.start + 1;
    return day > monthData.days ? 0 : day;
  });

  return (
    <section className="calendar-view">
      <div className="detail-header calendar-header">
        <div><span className="eyebrow">Change & release management</span><h1>Release calendar</h1><p>Trailing 12-month view of production deployments, readiness, risk, and validation conditions.</p></div>
        <div className="calendar-stats"><div><span>This month</span><strong>{monthReleases.length}</strong></div><div><span>High risk</span><strong>{monthReleases.filter((item) => item.risk === "High").length}</strong></div><div><span>Awaiting approval</span><strong>{monthReleases.filter((item) => item.status === "Pending approval").length}</strong></div></div>
      </div>
      <div className="calendar-toolbar">
        <div className="month-control"><button disabled={month === monthMeta[0].key} onClick={() => setMonth(month - 1)} aria-label="Previous month">←</button><strong>{monthData.label}</strong><button disabled={month === monthMeta.at(-1)?.key} onClick={() => setMonth(month + 1)} aria-label="Next month">→</button></div>
        <div className="month-tabs">{monthMeta.map((item) => <button className={month === item.key ? "active" : ""} key={item.key} onClick={() => setMonth(item.key)}><span>{item.short}</span><small>{String(item.year).slice(-2)}</small></button>)}</div>
        <div className="calendar-toolbar-actions">
          <div className="calendar-view-toggle" role="group" aria-label="Release display"><button className={display === "calendar" ? "active" : ""} onClick={() => setDisplay("calendar")}>Calendar</button><button className={display === "agenda" ? "active" : ""} onClick={() => setDisplay("agenda")}>Agenda</button></div>
          <div className="calendar-legend"><span><i className="risk-low" /> Low</span><span><i className="risk-moderate" /> Moderate</span><span><i className="risk-high" /> High risk</span></div>
        </div>
      </div>
      {display === "calendar" && <div className="calendar-shell">
        <div className="weekday-row">{["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => <div key={day}>{day}</div>)}</div>
        <div className="calendar-grid">
          {cells.map((day, index) => {
            if (day < 1) return <div className="calendar-cell muted-cell" key={`empty-${index}`} />;
            const items = monthReleases.filter((item) => item.day === day);
            const isToday = month === currentMonthKey && day === demoAsOf.getDate();
            return <div className={`calendar-cell ${isToday ? "today" : ""}`} key={day}><div className="day-number"><span>{day}</span>{isToday && <b>Today</b>}</div>{items.map((item) => <button className={`calendar-event risk-${item.risk.toLowerCase()}`} key={item.id} onClick={() => setSelected(item)}><span>{item.time}</span><strong>{item.title}</strong><small>{item.id}</small></button>)}</div>;
          })}
        </div>
      </div>}
      {display === "agenda" && <div className="release-agenda">
        {monthReleases.map((item) => (
          <button key={item.id} onClick={() => setSelected(item)}>
            <span className="agenda-date"><strong>{monthData.short} {item.day}</strong><small>{item.time}</small></span>
            <span className="agenda-detail"><strong>{item.title}</strong><small>{item.service} · {item.id} · {item.environment}</small></span>
            <span className="agenda-status"><StatusPill value={item.risk} /><StatusPill value={item.status} /></span>
            <b aria-hidden="true">→</b>
          </button>
        ))}
        {monthReleases.length === 0 && <div className="empty-state"><strong>No production releases in this month.</strong><span>Select another month to review the trailing twelve-month record.</span></div>}
      </div>}
      {selected && <ReleaseDrawer item={selected} onClose={() => setSelected(null)} />}
    </section>
  );
}

function ReleaseDrawer({ item, onClose }: { item: Release; onClose: () => void }) {
  const releaseMonth = monthMeta.find((month) => month.key === item.month) || monthMeta[0];
  const dialogRef = useModalDialog(onClose);
  const titleId = `release-drawer-${item.id}`;
  return (
    <div className="drawer-backdrop" onClick={onClose} role="presentation">
      <aside ref={dialogRef} className="record-drawer release-drawer" onClick={(event) => event.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby={titleId} tabIndex={-1}>
        <div className="drawer-top"><div><span className="eyebrow">Production change</span><h2 id={titleId}>{item.id}</h2></div><button data-dialog-close className="close-button" onClick={onClose} aria-label="Close details">×</button></div>
        <h3>{item.title}</h3>
        <div className="drawer-status"><StatusPill value={item.status} /><StatusPill value={item.risk} /><StatusPill value={item.type} /></div>
        <div className="release-time-card"><span>Deployment window</span><strong>{releaseMonth.short} {item.day}, {releaseMonth.year}</strong><small>{item.window}</small></div>
        <p className="release-summary">{item.summary}</p>
        <dl className="detail-list"><div><dt>Business service</dt><dd>{item.service}</dd></div><div><dt>Change owner</dt><dd>{item.owner}</dd></div><div><dt>Environment</dt><dd>{item.environment}</dd></div><div><dt>Change type</dt><dd>{item.type}</dd></div></dl>
        <div className="drawer-section conditions"><span>Closure & validation conditions</span>{item.conditions.map((condition) => <div key={condition}><i>✓</i><p>{condition}</p></div>)}</div>
        <div className="drawer-actions"><button className="secondary-action" onClick={onClose}>Back to calendar</button><button className="demo-action" disabled>Change link unavailable in demo</button></div>
      </aside>
    </div>
  );
}

function readRouteState() {
  const params = new URLSearchParams(window.location.search);
  const requestedView = params.get("view") as View | null;
  const view = requestedView && navItems.some((item) => item.id === requestedView) ? requestedView : "overview";
  const filter: FilterState = {};
  (["status", "outcome", "priority", "service", "search", "releaseId"] as const).forEach((key) => {
    const value = params.get(key);
    if (value) filter[key] = value;
  });
  return { view, filter };
}

export default function Home() {
  const [view, setView] = useState<View>("overview");
  const [filter, setFilter] = useState<FilterState>({});
  const [lastSync, setLastSync] = useState("2 min ago");

  const activeLabel = useMemo(() => navItems.find((item) => item.id === view)?.label || "Portfolio overview", [view]);

  useEffect(() => {
    const applyRoute = () => {
      const route = readRouteState();
      setView(route.view);
      setFilter(route.filter);
    };
    applyRoute();
    window.addEventListener("popstate", applyRoute);
    return () => window.removeEventListener("popstate", applyRoute);
  }, []);

  function openDetail(nextView: View, nextFilter: FilterState = {}) {
    setFilter(nextFilter);
    setView(nextView);
    const params = new URLSearchParams();
    if (nextView !== "overview") params.set("view", nextView);
    Object.entries(nextFilter).forEach(([key, value]) => { if (value) params.set(key, value); });
    const nextUrl = params.size > 0 ? `/?${params.toString()}` : "/";
    window.history.pushState(null, "", nextUrl);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><div className="brand-mark">F</div><div><strong>Fischer</strong><span>Product Lab</span></div></div>
        <div className="product-chip"><span>Current product</span><strong>Portfolio Health</strong></div>
        <nav aria-label="Primary navigation">{navItems.map((item) => <button key={item.id} className={view === item.id ? "active" : ""} onClick={() => openDetail(item.id)}><span className={`nav-glyph glyph-${item.id}`} />{item.label}</button>)}</nav>
        <div className="sidebar-footer"><div><span className="live-dot" /><div><strong>Simulated ServiceNow feed</strong><small>Synthetic snapshot · no live connection</small></div></div><span className="demo-badge">DEMO</span></div>
      </aside>
      <div className="main-column">
        <header className="topbar">
          <div className="mobile-brand"><div className="brand-mark">F</div><div><span>Fischer Product Lab</span><strong>{activeLabel}</strong></div></div>
          <nav className="mobile-nav" aria-label="Mobile navigation">{navItems.map((item) => <button key={item.id} className={view === item.id ? "active" : ""} onClick={() => openDetail(item.id)}>{item.short}</button>)}</nav>
          <div className="topbar-context"><span>Fischer Product Lab</span><b>/</b><span>Portfolio Health</span><b>/</b><strong>{activeLabel}</strong></div>
          <div className="topbar-actions"><button className="sync-button" aria-label="Refresh synthetic demo snapshot" onClick={() => { setLastSync("just now"); window.setTimeout(() => setLastSync("1 min ago"), 60000); }}><span className="sync-icon">↻</span><span><b>Demo snapshot</b><small>Refreshed {lastSync}</small></span></button><span className="avatar" role="img" aria-label="Trevor Fischer demo profile">TF</span></div>
        </header>
        <main>
          {view === "overview" && <Overview openDetail={openDetail} />}
          {view === "services" && <ServicePortfolio openDetail={openDetail} />}
          {view === "incidents" && <DetailTable key={`incidents-${JSON.stringify(filter)}`} view="incidents" initialFilter={filter} />}
          {view === "problems" && <DetailTable key={`problems-${JSON.stringify(filter)}`} view="problems" initialFilter={filter} />}
          {view === "changes" && <DetailTable key={`changes-${JSON.stringify(filter)}`} view="changes" initialFilter={filter} />}
          {view === "releases" && <ReleaseCalendar key={filter.releaseId || "calendar"} requestedId={filter.releaseId} />}
        </main>
      </div>
    </div>
  );
}
