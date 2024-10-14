#!/usr/bin/env bun

import { Command } from "commander"
import { existsSync, mkdirSync, writeFileSync, readFileSync } from "fs"
import { join } from "path"
import chalk from "chalk"
import inquirer from "inquirer"
import { execSync } from "child_process"
import semver from "semver"

chalk.level = 3 // Enable chalk with full color support

const hooksPackage = await import("@gibsonmurray/react-hooks") // Dynamically import your hooks package

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
        const hookPath = require.resolve(
            `@gibsonmurray/react-hooks/hooks/${hookName}`
        )
        const hookCode = readFileSync(hookPath, "utf-8")

        // Check for dependencies first
        const importRegex = /import\s+.*?{?\s*(use[A-Z]\w+).*?}?\s+from/g
        const importedDependencies = [...hookCode.matchAll(importRegex)].map(
            (match) => match[1]
        )

        // Add dependencies first
        for (const dep of importedDependencies) {
            if (
                dep !== hookName &&
                !addedHooks.has(dep) &&
                dep in hooksPackage
            ) {
                await addHook(dep, hooksDir, true)
            }
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
    const availableHooks = Object.keys(hooksPackage).filter(
        (key) =>
            typeof hooksPackage[key as keyof typeof hooksPackage] === "function"
    )

    const { selectedHooks } = await inquirer.prompt([
        {
            type: "checkbox",
            name: "selectedHooks",
            message: "Which hooks would you like to add?",
            choices: availableHooks.map((hook) => ({
                name: hook,
                value: hook,
            })),
            pageSize: 10,
        },
    ])

    return selectedHooks
}

const updateLibrary = async () => {
    try {
        const libraries = [
            "@gibsonmurray/react-hooks",
            "@gibsonmurray/ghooks-cli",
        ]

        for (const lib of libraries) {
            const packageJsonPath = require.resolve(`${lib}/package.json`)
            const packageJson = JSON.parse(
                readFileSync(packageJsonPath, "utf-8")
            )
            const currentVersion = packageJson.version
            console.log(
                chalk.blue(`Current version of ${lib}: ${currentVersion}`)
            )

            const latestVersion = execSync(`npm show ${lib} version`, {
                encoding: "utf8",
            }).trim()
            console.log(
                chalk.blue(`Latest version of ${lib}: ${latestVersion}`)
            )

            if (semver.gt(latestVersion, currentVersion)) {
                console.log(chalk.yellow(`Updating ${lib}...`))
                execSync(`npm install ${lib}@latest`, { stdio: "inherit" })
                console.log(chalk.green(`✅ ${lib} updated successfully!`))
            } else {
                console.log(chalk.green(`✅ ${lib} is already up to date!`))
            }
        }
    } catch (error) {
        console.error(
            chalk.red("❌ Error updating libraries:"),
            error instanceof Error ? error.message : String(error)
        )
    }
}

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
    .action(() => {
        const availableHooks = Object.keys(hooksPackage).filter(
            (key) =>
                typeof hooksPackage[key as keyof typeof hooksPackage] ===
                "function"
        )
        console.log(chalk.cyan("Available hooks:"))
        availableHooks.forEach((hook) => console.log(chalk.yellow(`- ${hook}`)))
    })

program
    .command("update")
    .description(
        "Update the @gibsonmurray/react-hooks library to the latest version"
    )
    .action(updateLibrary)

// Add a new command for installation success message
program
    .command("installed")
    .description(
        "Display a message indicating successful installation of the CLI"
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