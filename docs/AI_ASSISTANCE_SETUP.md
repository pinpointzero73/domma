# Domma AI Assistance Setup

This document explains how the AI assistance files reach users.

## What Was Implemented

Domma ships **AI assistance files** that a project can copy in. They include:

1. **CLAUDE.md** - Comprehensive framework reference
2. **.claude/** - Project settings & code snippets
3. **blueprints/** - 8 production-ready schemas
4. **types/** - TypeScript definitions

## Distribution Methods

### 1. No install hook

There used to be an interactive `postinstall` prompt. It was removed in 0.54: npm 7+ hides
lifecycle-script output, so the question waited on a prompt nobody could see, and install
scripts are a supply-chain red flag that security scanners report. Installing Domma now runs
nothing.

### 2. CLI Command (Recommended)

Users can also run manually:

```bash
npx domma-js setup-ai
```

**Use Cases:**
- Adding to existing project
- Updating files to latest version

**Implementation:**
- Added `setup-ai` command to `bin/domma-cli.js`
- Interactive confirmation
- Shows what already exists vs. what will be copied

### 3. Manual: Direct Copy

For projects where npm isn't used:

```bash
cp -r node_modules/domma-js/templates/kickstart/CLAUDE.md .
cp -r node_modules/domma-js/templates/kickstart/.claude .
cp -r node_modules/domma-js/templates/kickstart/blueprints .
cp -r node_modules/domma-js/templates/kickstart/frontend/types ./types/
```

## How It Works

### Post-Install Flow

1. **Detection:** Checks if running in appropriate context
   - ✅ In node_modules (normal install)
   - ❌ In CI environment (skip)
   - ❌ In domma repo itself (development)

2. **Project Root:** Finds the actual project directory
   - Navigates up from `node_modules/domma-js/`
   - Verifies `package.json` exists

3. **User Prompt:** Interactive confirmation
   - User can accept (default) or decline
   - If declined, shows `npx domma-js setup-ai` for later

4. **File Copy:** Copies files that don't exist
   - Skips files that already exist
   - Shows progress for each file
   - Handles errors gracefully

### What Gets Copied

```
project-root/
├── CLAUDE.md                    # 300+ lines of framework reference
├── .claude/
│   ├── settings.json            # Project-specific settings
│   └── snippets.md              # 400+ lines of code patterns
├── blueprints/
│   ├── README.md
│   ├── common/                  # user, contact, settings
│   ├── forms/                   # login, registration
│   └── crud/                    # product, task
└── types/
    └── domma.d.ts              # 700+ lines of TypeScript definitions
```

## Files Included in NPM Package

The `package.json` already includes `"templates/"` in the `files` array, so all AI assistance files are automatically included when the package is published:

```json
{
  "files": [
    "bin/",
    "templates/",  // <-- Includes our new AI assistance files
    "public/dist/domma.min.js",
    // ...
  ]
}
```

## Benefits

### For New Users
- **Zero configuration** - Works out of the box
- **Immediate context** - Claude understands Domma from day one
- **Production-ready examples** - 8 blueprints ready to use
- **Type safety** - Full TypeScript support

### For Existing Projects
- **Easy addition** - Single command to add files
- **Non-destructive** - Won't overwrite existing files
- **Manual option** - Can copy files directly if needed

### For Maintainers
- **Version control** - Files update with package
- **Safe implementation** - Won't break installations

## Testing

To test the command:

```bash
# In any project with Domma installed
npx domma-js setup-ai
```

## Future Enhancements

Potential additions:
- `--update` flag to update existing files
- `--minimal` flag to copy only CLAUDE.md
- Integration with `npx domma-js init` (already done - template includes files)

## Documentation Updates Needed

Update the following documentation to mention AI assistance:

1. **README.md** - Add section on AI assistance
2. **docs/GettingStarted.md** - Mention automatic setup
3. **Website** - Add "AI-Assisted Development" page
4. **Release notes** - Highlight this feature

## Summary

✅ **Implemented:**
- Postinstall hook (automatic)
- CLI command (manual)
- All 12 AI assistance files
- Non-destructive copying
- Interactive prompts
- Error handling

✅ **Tested:**
- Postinstall detection logic
- File copying
- CLI command routing

✅ **Ready for release!**

Users installing Domma will now automatically get comprehensive AI assistance files that make Claude Code a powerful development companion for Domma projects.
