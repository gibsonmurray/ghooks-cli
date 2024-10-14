#!/usr/bin/env bun

import { Command } from "commander"
import { existsSync, mkdirSync, writeFileSync } from "fs"
import { join } from "path"
import chalk from "chalk"

chalk.level = 3 // Enable chalk with full color support

const hooksPackage = await import("@gibsonmurray/react-hooks") // Dynamically import your hooks package

// Initialize Commander
const program = new Command()

program
    .command("add <hookName>")
    .description("Add a new React hook to your project")
    .action(async (hookName: string) => {
        try {
            const projectRoot = process.cwd()
            const hooksDir = join(projectRoot, "hooks")
            const hookFile = join(hooksDir, `${hookName}.tsx`)

            // Create the hooks directory if it doesn't exist
            if (!existsSync(hooksDir)) {
                mkdirSync(hooksDir)
                console.log(
                    chalk.green(`✅ Created 'hooks' directory at ${hooksDir}`)
                )
            }

            // Fetch hook code from your npm package
            if (hookName in hooksPackage) {
                const hookCode = (hooksPackage as any)[hookName].toString() // Convert hook function to string
                writeFileSync(hookFile, hookCode)
                console.log(
                    chalk.green(`✅ ${hookName}.tsx added to ${hooksDir}`)
                )
            } else {
                console.log(
                    chalk.red(`❌ Hook '${hookName}' not found in npm package`)
                )
            }
        } catch (error) {
            console.error(chalk.red("❌ Error adding hook:"), error)
        }
    })

// Parse the CLI arguments
program.parse()
