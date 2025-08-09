# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## General Guidance

Unless there's a specific request, always refer to @PLAN.md when taking actions.

For each item in @PLAN.md, attempt to complete it using a Test-Driven Development (TDD) approach where applicable. Simpler tasks do not require TDD.
3 Steps:
Red: Write a failing test for the functionality you want to implement
Green: Write the minimal amount of code needed to make that test pass
Refactor: Clean up and improve the code while ensuring all tests still pass

IMPORTANT HYGIENE STEP: The final item in your list of Todos MUST be "Check off completed tasks in @PLAN.md"

## Important Notes

Do NOT under any circumstances deviate from @techContext.md

## Github

When working with github, you must use the GITHUB_TOKEN found in the .env file.

### Git Configuration

Git is already configured with:
- Credential helper enabled (`credential.helper=store`)
- GitHub username set for credentials
- Secure credential storage in ~/.git-credentials
- User identity configured for commits

Do NOT modify git remote URLs to include tokens directly, as this compromises security. The credential helper will automatically handle authentication.