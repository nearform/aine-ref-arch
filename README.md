Reference Architecture: AI Native SDLC


Reference Architecture: AI Native SDLC        1
Introduction        2
Enterprise wide rollout v.s. Pick a domain        2[a]
Phases AI can assist        2
Planning        2
Design        2
Implementation        2
Testing        2
Deployment        2
Maintenance        2
Tools        3
Foundation Models & Chat        3
Public LLM, Private Endpoints, Dedicated Model        3
Transcription        3
Rapid Prototyping        3
Spec-Driven Development        4
Next-generation IDEs        5
(Merge with above section?)        5
MCP Servers        5
Your Agents & Process - Steering the tools        5
Reference Architecture        5
Progressive Startup        5
Enterprise        5
Highly Regulated Industry        6
(slop - attempt at generating content from the diagram that I didn’t like)        7
Reference Architecture: AI-Enhanced Software Development Lifecycle (SDLC)        7
Introduction        7
1. Planning        7
2. Design        7
3. Implementation        8
4. Testing        8
5. Deployment        8
6. Maintenance        8
7. AI Tooling & Integration via MCP        8
8. Human-in-the-Loop Governance        9[b]
9. Autonomous Agent Roles        9
Conclusion        9


Introduction
This reference architecture outlines a strategic approach to an AI-Native Software Development Lifecycle (SDLC), emphasizing foundational techniques and methodologies enhanced by AI. 
Rather than prescribing a rigid set of specific tools, this document focuses on the capabilities AI can provide across the SDLC phases, illustrating these with examples of current and emerging tools. 
Designed for varying degrees of trust profile - progressive startup, large scale enterprise, enterprise with high data sovereignty needs


graph TD
AINE[AINE]
AINE --> CE[Context Engineering]
AINE --> DT[Design tools]
AINE --> BA[Brainstorming Agents]
AINE --> TA[Testing Agents]


CE --> SDD[SDD]
CE --> PM[Plan Mode]
CE --> EPCC[EPCC]
CE --> VC[Vibe Coding]



Approach to Rollout
By observation of a number of customers’ rollout of AI in their SDLC, we have seen:
* Marginal gains (but gains nonetheless) when applying AI tools uniformly across the enterprise.
These initiatives often focus on enabling copilots in IDEs, automated testing, or documentation summarization across teams. While the improvements are incremental - shaving minutes off tasks or slightly improving consistency - the cumulative effect across a large engineering organization is still meaningful.
* Substantial domain-level acceleration when focusing on a specific project or domain that is well-suited to an AI-native SDLC.
For example, tackling a modernization effort (e.g., upgrading a legacy Node.js codebase) or a greenfield build with spec-driven and agentic workflows can accelerate delivery by 3–5×, while simultaneously improving code quality and test coverage.
These focused pilots allow teams to go deeper - grounding AI models in relevant context, integrating tightly with DevOps pipelines, and creating measurable ROI.
In practice, the most effective rollout strategy tends to start narrow and deep: identify a “gnarly” or repetitive engineering challenge, prove value with AI-native tooling, then scale horizontally across teams once the practices and guardrails are established.
Phases AI Can Assist[c]
AI can now augment nearly every phase of the Software Development Lifecycle (SDLC), from ideation and planning through to ongoing maintenance. Below is a phase-by-phase breakdown of how AI assists teams, the types of tools used, and the kinds of gains realized.
Planning
AI enhances the planning phase by capturing, structuring, and transforming the collective intelligence of early project discussions:
   * Meeting assistance & transcription: Tools like Fireflies, Granola, or built-in transcription from Zoom/Teams automatically capture and annotate brainstorming sessions, ensuring no ideas are lost.
   * Context retention: Those transcripts can be summarized or transformed into structured artifacts such as product requirement documents (PRDs), user stories, or backlog items.
   * Sprint Zero automation: AI can generate technical specs and even seed an initial backlog, connecting early ideation with actionable work.
   * Collaboration grounding: Integrations between chat tools (Slack, Teams) and MCP-connected systems (e.g., Jira, Confluence) allow contextualized insights to feed into planning artifacts.



Design
AI accelerates and enriches the design phase:
      * Rapid prototyping: Generative design tools can instantly produce wireframes and prototypes from natural language descriptions or sketches, enabling earlier stakeholder feedback.
      * Architecture brainstorming: AI assistants can co-create and validate system architectures, suggesting service decomposition, data flow diagrams, and technology stacks.
      * Iteration speed: Visual design exploration and variation generation are dramatically faster, allowing more options to be tested early.



Implementation
AI transforms the implementation phase across multiple dimensions:
         * Project bootstrapping: Foundation models can generate initial codebases - either from scratch or using enterprise or framework starter templates (e.g., front-end frameworks, REST API scaffolds).
Copilot-assisted coding: Tools like GitHub Copilot or Amazon CodeWhisperer incrementally improve developer productivity and reduce cognitive load.
         * Spec-driven development: Emerging paradigms like spec-driven development (e.g., Kiro, GitHub Spec Kit, Beam.AI) enable code generation directly from structured specifications.
         * Agentic teams: Early-stage autonomous agents can pick up backlog tasks - e.g., product agents drafting PRDs, technical director agents creating and reviewing specs, and developer agents generating implementation and unit tests - all with humans in the loop for validation.


Testing
AI strengthens testing through automation, resilience, and intelligence:
            * Automated test generation: AI tools can generate unit, integration, and end-to-end tests using frameworks like Playwright, leveraging MCP connectivity to contextual data.
            * Self-healing tests: Intelligent systems detect non-functional failures (e.g., a button moved 10px right) and auto-correct without manual intervention.
            * Security and static analysis: AI can not only run security scans but also suggest and apply remediations automatically.
            * Quality metrics: Tests can be generated to achieve target coverage levels (e.g., 80%) before modernization or migration work.
Deployment
AI streamlines deployment and infrastructure provisioning:
            * Infrastructure-as-code generation: LLMs generate Terraform or CloudFormation definitions grounded in organization-specific documentation and policies.
            * MCP integration: MCP servers enhance grounding for tools like AWS or GitHub, reducing hallucinations and increasing accuracy.
            * Automated environment management: AI can adjust configurations, detect drift, and ensure deployment consistency across environments.
Maintenance
AI redefines the maintenance phase with continuous, intelligent oversight:
            * Interactive runbooks: Engineers can query live data or logs conversationally to diagnose issues quickly.
            * RAG-enabled documentation: Retrieval-augmented generation allows natural-language queries over internal project documentation.
            * Automated dependency management: AI can detect vulnerabilities, patch code, update dependencies, and re-run tests to ensure no regressions.
            * Modernization and migration: AI is highly effective in upgrading legacy systems (e.g., Node 8 → Node 18 migrations), writing missing unit tests, and ensuring safe version transitions.
Tools
Foundation Models & Chat


Public LLM, Private Endpoints, Dedicated Model
This:
  
[d]
Transcription
Granola is king of the hill, note “train on your model” defaults & enterprise options for configuration
Limited “auto notify” capability
Discuss on-premise / within VPC options for transcription 
Rapid Prototyping
-Have we an interesting commentary on Bolt.new / Loveable within an enterprise? I’m not sure.. [e]
-Ingest their output and treat as brownfield? But meh.  
Spec-Driven Development
  
  

  

Next-generation IDEs
(Merge with above section?)
MCP Servers
Note on deployment behind VPC
Trust delegation
Vulnerability / attack surface


Lefteris: One topic that came up and X raised as a question/concern was how we utilise MCP servers in a secure way, as he is getting push back from his security teams. I talked about hosting MCP servers in your VPC etc but I mentioned that on Wednesday we might have a better view of challenges our clients face on this.


Cian: 


Your Agents & Process - Steering the tools 
How to codify (BMAd , Claude Code , ..)
CursorRules / IDE rules
Reference Architecture
How do we (if at all) provide an AWS v.s. Azure v.s. GCP view of this world?)
Progressive Startup
LLM: OpenAI public APIs
Development: Bolt/Loveable Rapid prototyping -> Kiro?
Coding model: Claude 4.5


Enterprise
LLM: Private endpoints (Bedrock/Azure) within VPC+VPN
Development: No Rapid prototyping? -> Curosr/VSCode
Coding model: Private endpoint to (Claude Code/Codex) within VPC+VPN


Highly Regulated Industry
LLM: Deploy OpenAI GPT-OSS-120B (optionally run during working hours)
Development: No rapid -> VSCode + On-prem coding model (which?)
Coding model: Which?



[a]In terms of flow, this could come after "Phases AI can assist" section.
[b]I suspect this will touch on trust, but can there be an explicit section on building trust throughout SDLC? I have started including trust mentions in some form or the other in proposition work, but don't believe we have much to back it up in case there is a question on it.
[c](This whole section was generated by passing my ~7m section of the SHAPE practice presentation transcript to ChatGPT and asking it to write the headings based on what i said)
[d]Either
-Pass to ChatGPT and ask it to write about this, or
-Reproduce the table inline here with some characterisation about what's best for enterprise v.s. startup v.s. in between
[e]If there isn't one, I can provide. Let's discuss.