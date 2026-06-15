# Splunk LogSmith Architecture

This document outlines the architecture, data flow, and agentic integrations for the Splunk LogSmith (Agentic Log Analyzer) hackathon project.

## High-Level Architecture Diagram

```mermaid
flowchart TD
    %% Define Styles
    classDef frontend fill:#1e1e2e,stroke:#89b4fa,stroke-width:2px,color:#cdd6f4
    classDef backend fill:#181825,stroke:#f38ba8,stroke-width:2px,color:#cdd6f4
    classDef splunk fill:#11111b,stroke:#a6e3a1,stroke-width:2px,color:#cdd6f4
    classDef ai fill:#313244,stroke:#f9e2af,stroke-width:2px,color:#cdd6f4
    
    %% Components
    subgraph Client ["Client Layer"]
        UI["Frontend UI (Glassmorphism)"]:::frontend
    end
    
    subgraph AppServer ["FastAPI Backend"]
        API["REST API (/analyze, /generate-ta)"]:::backend
        Orchestrator["Agentic Orchestrator"]:::backend
        MCPClient["MCP Client Module"]:::backend
        RegexProposer["Gemini AI Proposer"]:::backend
    end
    
    subgraph ExternalServices ["External Integrations"]
        Gemini["Google Gemini 2.5 Flash API"]:::ai
        MCPServer["Splunk MCP Server"]:::splunk
        Splunk["Splunk Enterprise (Indexers)"]:::splunk
    end
    
    %% Relationships & Data Flow
    UI -- "1. Submits Log Sample & Config" --> API
    API -- "2. Triggers Analysis" --> Orchestrator
    
    Orchestrator -- "3. Requests Historical Context" --> MCPClient
    MCPClient -- "4. Executes SPL Queries via MCP" --> MCPServer
    MCPServer -- "5. Queries Live Data" --> Splunk
    Splunk -- "Returns 100+ Live Logs" --> MCPServer
    MCPServer -- "Historical Logs Context" --> Orchestrator
    
    Orchestrator -- "6. Sends Context & Sample" --> RegexProposer
    RegexProposer -- "7. Generates Regex Proposals" --> Gemini
    Gemini -- "Returns Isolated Regex Snippets" --> RegexProposer
    
    Orchestrator -- "8. Tests Regex via SPL (rex)" --> MCPClient
    MCPClient -- "Validates Match Rate > 95%" --> MCPServer
    
    RegexProposer -. "9. Refinement Loop (If < 95% Match)" .-> Orchestrator
    
    RegexProposer -- "10. Detects PII (IPs, Usernames)" --> Gemini
    Gemini -- "Returns PII Classifications" --> RegexProposer
    
    Orchestrator -- "11. Builds props.conf & SEDCMD" --> API
    API -- "12. Downloads .tar.gz TA Bundle" --> UI

```

## Key Architectural Highlights

### 1. Model Context Protocol (MCP) Integration
Instead of building a fragile, custom REST wrapper around Splunk, we heavily rely on the **Model Context Protocol (MCP)**. Our backend acts as an MCP Client that speaks directly to a local/remote Splunk MCP Server. 
- **Data Gathering:** It executes live `search index=main | head 100` queries to feed the AI true historical context.
- **Regex Validation:** It offloads the regex testing directly to the Splunk Search Head by running `| rex field=_raw "<ai_regex>"` and evaluating the real match rate without moving gigabytes of logs out of Splunk.

### 2. Autonomous Agentic Loop (The Orchestrator)
The backend does not just "ask an LLM and pray." It acts as a fully autonomous agent:
1. **Propose:** It asks Gemini 2.5 Flash to generate isolated, modular regex snippets for every field it detects in the log sample.
2. **Test:** It connects back to Splunk via MCP to mathematically test those regexes against 100 historical logs.
3. **Refine:** If a regex achieves less than a 95% match rate due to log formatting edge cases, the Orchestrator captures the exact log lines that *failed* to match, sends them back to Gemini, and commands it to refine the regex. It iterates until the 95% threshold is crossed.

### 3. Data Masking & TA Compilation
Once the fields are perfectly extracted, the Agent makes a final pass to Gemini to flag sensitive PII (e.g., classifying an `ip_address` or `userName` field). The backend then dynamically writes a complete, installable Splunk App (`.tar.gz`) containing:
- `props.conf` with `EXTRACT-` rules.
- `SEDCMD` rules for every flagged PII field to mask sensitive data with `[REDACTED]`.
- Proper `app.conf` and directory structures.

### 4. Standalone Fallback Engine
In cases where the MCP connection to Splunk is unavailable, or the Gemini API hits its daily free-tier quota (429 Resource Exhausted), the system gracefully degrades. It uses a local Python-based evaluation engine to validate regexes against the UI's sample, and falls back to a deterministic heuristic engine to keep the application 100% functional for users.
