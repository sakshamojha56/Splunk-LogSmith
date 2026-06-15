def get_total_tools_count(agent_version: dict) -> int:
    """
    Calculate the total number of tools in the agent version configuration.
    Counts all tools from MCPs and knowledge bases (each KB counts as one tool).

    Args:
        agent_version (dict): The agent version dictionary (single version from versions array).
    Returns:
        int: Total number of tools.
    """
    total_tools = 0
    tools_config = agent_version.get("tools", {})

    # Count tools from MCPs
    mcps = tools_config.get("mcps", [])
    for mcp in mcps:
        mcp_tools = mcp.get("tools", [])
        total_tools += len(mcp_tools)

    # Count knowledge bases (each KB counts as one tool)
    knowledge_bases = tools_config.get("knowledge_bases", [])
    total_tools += len(knowledge_bases)

    return total_tools
