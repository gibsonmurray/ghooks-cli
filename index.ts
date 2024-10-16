#!/usr/bin/env node

import { Command } from "commander"
import {
    existsSync,
    mkdirSync,
    writeFileSync,
    readFileSync,
    readdirSync,
} from "fs"
import { join } from "path"
import chalk from "chalk"
import inquirer from "inquirer"
import { execSync } from "child_process"
import semver from "semver"
import axios from "axios"

chalk.level = 3 // Enable chalk with full color support

const HOOKS_BASE_URL = `https://raw.githubusercontent.com/gibsonmurray/react-hooks/main/hooks`

const HOOKS_URL = `https://api.github.com/repos/gibsonmurray/react-hooks/contents/hooks`

// Initialize Commander
const program = new Command()

const addedHooks = new Set<string>()

const addHook = async (
    hookName: string,
    hooksDir: string,
    isDependency = false
) => {
    if (addedHooks.has(hookName)) return

    try {
        const hookUrl = `${HOOKS_BASE_URL}/${hookName}.tsx`
        const response = await axios.get(hookUrl)
        const hookCode = response.data

        // Check for custom hook dependencies
        const importRegex =
            /import\s+.*?{?\s*(use[A-Z]\w+).*?}?\s+from\s+['"]\.\/(\w+)['"]/g
        const importedDependencies = [...hookCode.matchAll(importRegex)]
            .map((match) => match[1])
            .filter((dep) => dep !== hookName && !addedHooks.has(dep))

        // Add dependencies first
        for (const dep of importedDependencies) {
            await addHook(dep, hooksDir, true)
        }

        // Now add the current hook
        const hookFile = join(hooksDir, `${hookName}.tsx`)
        writeFileSync(hookFile, hookCode)
        console.log(
            isDependency
                ? chalk.yellow(
                      `➕ Dependency ${hookName}.tsx added to ${hooksDir}`
                  )
                : chalk.green(`✅ ${hookName}.tsx added to ${hooksDir}`)
        )

        if (hookName === "useFlipGSAP") {
            console.log(
                chalk.yellow(
                    "⚠️  Note: useFlipGSAP requires gsap and @gsap/react libraries to work."
                )
            )
        }

        addedHooks.add(hookName)
    } catch (error) {
        console.log(
            chalk.red(
                `❌ Error adding ${
                    isDependency ? "dependency" : ""
                } hook '${hookName}': ${
                    error instanceof Error ? error.message : String(error)
                }`
            )
        )
    }
}

const selectHooks = async () => {
    try {
        const response = await axios.get(HOOKS_URL)
        const availableHooks = response.data
            .filter((file: { name: string }) => file.name.endsWith(".tsx"))
            .map((file: { name: string }) => file.name.replace(".tsx", ""))

        const { selectedHooks } = await inquirer.prompt([
            {
                type: "checkbox",
                name: "selectedHooks",
                message: "Which hooks would you like to add?",
                choices: availableHooks.map((hook: string) => ({
                    name:
                        hook === "useFlipGSAP"
                            ? `${hook} (Requires gsap and @gsap/react libraries)`
                            : hook,
                    value: hook,
                })),
                pageSize: 10,
                loop: false,
                required: true,
            },
        ])

        return selectedHooks
    } catch (error) {
        console.error(
            chalk.red("❌ Error fetching available hooks:"),
            error instanceof Error ? error.message : String(error)
        )
        return []
    }
}

const updateLibrary = async () => {
    try {
        const lib = "@gibsonmurray/ghooks-cli"

        const currentVersion = safeGetGlobalVersion()

        if (currentVersion === "unknown") {
            console.log(chalk.yellow(`⚠️ ${lib} is not installed globally.`))
            return
        }

        console.log(
            chalk.blue(`Current global version of ${lib}: ${currentVersion}`)
        )

        const latestVersion = execSync(`npm show ${lib} version`, {
            encoding: "utf8",
        }).trim()
        console.log(chalk.blue(`Latest version of ${lib}: ${latestVersion}`))

        if (semver.gt(latestVersion, currentVersion)) {
            console.log(chalk.yellow(`Updating ${lib} globally...`))
            execSync(`npm install -g ${lib}@latest`, { stdio: "inherit" })
            console.log(chalk.green(`✅ ${lib} updated successfully!`))
        } else {
            console.log(chalk.green(`✅ ${lib} is already up to date!`))
        }
    } catch (error) {
        console.error(chalk.red("❌ Error updating library:"), error)
    }
}

const updateHook = async (hookName: string, hooksDir: string) => {
    try {
        const hookUrl = `${HOOKS_BASE_URL}/${hookName}.tsx`
        const response = await axios.get(hookUrl)
        const newHookCode = response.data

        const hookFile = join(hooksDir, `${hookName}.tsx`)
        const currentHookCode = readFileSync(hookFile, "utf-8")

        if (newHookCode !== currentHookCode) {
            writeFileSync(hookFile, newHookCode)
            console.log(chalk.green(`✅ ${hookName}.tsx updated successfully`))
        } else {
            console.log(chalk.blue(`ℹ️ ${hookName}.tsx is already up to date`))
        }
    } catch (error) {
        console.log(
            chalk.red(
                `❌ Error updating hook '${hookName}': ${
                    error instanceof Error ? error.message : String(error)
                }`
            )
        )
    }
}

const updateHooks = async () => {
    try {
        const projectRoot = process.cwd()
        const hooksDir = join(projectRoot, "hooks")

        if (!existsSync(hooksDir)) {
            console.log(
                chalk.yellow(
                    "⚠️ No 'hooks' directory found in the current project."
                )
            )
            return
        }

        const hookFiles = readdirSync(hooksDir).filter((file) =>
            file.endsWith(".tsx")
        )

        if (hookFiles.length === 0) {
            console.log(
                chalk.yellow("⚠️ No hooks found in the 'hooks' directory.")
            )
            return
        }

        console.log(chalk.blue("Checking for updates to hooks..."))

        for (const hookFile of hookFiles) {
            const hookName = hookFile.replace(".tsx", "")
            await updateHook(hookName, hooksDir)
        }

        console.log(chalk.cyan("✨ Hook update process completed."))
    } catch (error) {
        console.error(
            chalk.red("❌ Error updating hooks:"),
            error instanceof Error ? error.message : String(error)
        )
    }
}

// Get the current version from the globally installed package.json
const getGlobalVersion = (): string | null => {
    try {
        const globalPath = execSync("npm root -g", { encoding: "utf8" }).trim()
        const packageJsonPath = join(
            globalPath,
            "@gibsonmurray/ghooks-cli",
            "package.json"
        )

        if (existsSync(packageJsonPath)) {
            const packageJson = JSON.parse(
                readFileSync(packageJsonPath, "utf-8")
            )
            return packageJson.version
        }
    } catch (error) {
        console.error(chalk.red("Error reading global package version:"), error)
    }
    return null
}

function safeGetGlobalVersion(): string {
    const currentVersion = getGlobalVersion()
    if (!currentVersion) {
        console.log(
            chalk.red(
                "❌ Error: @gibsonmurray/ghooks-cli is not installed globally."
            )
        )
        process.exit(1)
    }
    return currentVersion
}

// Add version option
const currentVersion = safeGetGlobalVersion()

program
    .version(
        currentVersion,
        "-v, -version, --version",
        "Output the current version"
    )
    .command("version")
    .description("Display the current version of the CLI")
    .action(() => {
        console.log(
            chalk.cyan(`@gibsonmurray/ghooks-cli version: ${currentVersion}`)
        )
    })

program
    .command("add [hookName]")
    .description("Add new React hook(s) to your project")
    .action(async (hookName?: string) => {
        try {
            const projectRoot = process.cwd()
            const hooksDir = join(projectRoot, "hooks")

            // Create the hooks directory if it doesn't exist
            if (!existsSync(hooksDir)) {
                mkdirSync(hooksDir)
                console.log(
                    chalk.blue(`🚀 Created 'hooks' directory at ${hooksDir}`)
                )
            }

            let hooksToAdd: string[]
            if (hookName) {
                hooksToAdd = [hookName]
            } else {
                hooksToAdd = await selectHooks()
            }

            for (const hook of hooksToAdd) {
                await addHook(hook, hooksDir, false)
            }

            console.log(
                chalk.cyan(`✨ Added ${addedHooks.size} hook(s) in total.`)
            )
        } catch (error) {
            console.error(
                chalk.red("❌ Error adding hooks:"),
                error instanceof Error ? error.message : String(error)
            )
        }
    })

program
    .command("list")
    .description("List all available hooks")
    .action(async () => {
        try {
            const response = await axios.get(
                "https://api.github.com/repos/gibsonmurray/react-hooks/contents/src/hooks"
            )
            const availableHooks = response.data
                .filter((file: { name: string }) => file.name.endsWith(".tsx"))
                .map((file: { name: string }) => file.name.replace(".tsx", ""))

            console.log(chalk.cyan("Available hooks:"))
            availableHooks.forEach((hook: string) =>
                console.log(chalk.yellow(`- ${hook}`))
            )
        } catch (error) {
            console.error(
                chalk.red("❌ Error fetching available hooks:"),
                error instanceof Error ? error.message : String(error)
            )
        }
    })

program
    .command("update")
    .description("Update hooks in the project")
    .action(async () => {
        await updateHooks()
    })

program
    .command("upgrade")
    .description("Upgrade the @gibsonmurray/ghooks-cli library")
    .action(async () => {
        await updateLibrary()
    })

// Add a new command for installation success message
program
    .command("installed")
    .description(
        "Display a message indicating successful installation of the CLI (development only)"
    )
    .action(() => {
        console.log(
            chalk.green(
                "✅ @gibsonmurray/ghooks-cli has been successfully installed!"
            )
        )
        console.log(
            chalk.cyan("Use 'ghooks --help' to see available commands.")
        )
    })

program.parse(process.argv)
