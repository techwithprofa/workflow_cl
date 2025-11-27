# Project Architecture

## Overview
Multi-agent Claude system for collaborative development workflow.

## System Design

### Agent Architecture
- **Main Agent**: Central coordinator
- **Task Agent**: Task planning and decomposition
- **Fix Agent**: Error resolution and debugging
- **Coder Agent**: Code implementation
- **UI/UX Agent**: Frontend development
- **Tester Agent**: Quality assurance
- **Deployer Agent**: Deployment management
- **Documenter Agent**: Documentation
- **Reviewer Agent**: Code review
- **Web Search Agent**: Research and information gathering

### Communication Flow
- Agents communicate through context files
- Main agent coordinates task distribution
- Specialized agents handle domain-specific work
- Results flow back through main coordinator

### Data Management
- Context files for agent state
- Logs for activity tracking
- Metrics for performance monitoring
- History for decision tracking

## Technology Stack
- Next.js (Frontend framework)
- TypeScript (Type safety)
- Vercel (Deployment)
- Appwrite (Backend services)
