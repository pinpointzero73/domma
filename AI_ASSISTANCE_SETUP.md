# Domma AI Assistance Setup

This document explains how the AI assistance files are automatically distributed to users.

## What Was Implemented

We've added **automatic AI assistance** that deploys when users install Domma. This includes:

1. **CLAUDE.md** - Comprehensive framework reference
2. **.claude/** - Project settings & code snippets
3. **blueprints/** - 8 production-ready schemas
4. **types/** - TypeScript definitions

## Distribution Methods

### 1. Automatic: Post-Install Hook (Recommended)

When users run `npm install domma-js`, they'll see:

```
╭───────────────────────────────────────────╮
│  Domma AI Assistance Available             │
╰───────────────────────────────────────────╯

Domma includes AI assistance files for Claude Code:
  • CLAUDE.md - Framework reference guide
  • .claude/ - Settings & code snippets
  • blueprints/ - Reusable schemas (8 files)
  • types/ - TypeScript definitions

Copy AI assistance files to your project? (Y/n):
```

**Implementation:**
- `bin/postinstall.js` - Interactive postinstall script
- `package.json` - Includes `"postinstall": "node bin/postinstall.js"`
- Only runs when appropriate (not in CI, not during development)
- Silent failure (won't break installation)

### 2. Manual: CLI Command

Users can also run manually:

```bash
npx domma-js setup-ai
```

**Use Cases:**
- Skipped during postinstall
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
- **Automatic distribution** - No manual steps needed
- **Version control** - Files update with package
- **Safe implementation** - Won't break installations

## Testing

To test the postinstall hook:

```bash
# 1. Build Domma
npm run build

# 2. Create test project
mkdir test-project && cd test-project
npm init -y

# 3. Install Domma (will trigger postinstall)
npm install ../path/to/domma

# 4. Check files were copied
ls -la CLAUDE.md .claude/ blueprints/ types/
```

To test the manual command:

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
