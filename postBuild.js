const fs = require("fs")
const path = require("path")
const fetch = require("node-fetch")

const Headers = fetch.Headers

const postBuild = async () => {
  console.log("sending static pages to cloudflare cache...")

  const fileItems = {}

  const url = process.env.CLOUDFLARE_BUILD_WORKER_URL
  const CUSTOM_AUTH_KEY = process.env.CUSTOM_CLOUDFLARE_WORKER_AUTH_KEY
  const CUSTOM_AUTH_KEY_HEADER = process.env.CUSTOM_AUTH_KEY_HEADER

  if (!url || !CUSTOM_AUTH_KEY_HEADER || !CUSTOM_AUTH_KEY) return

  const pagesFolderPath = path.resolve(__dirname, ".next/server/pages")
  if (!fs.existsSync(pagesFolderPath)) {
    throw new Error("Directory not found at pagesFolderPath")
  }

  const files = fs.readdirSync(pagesFolderPath, { withFileTypes: true })
  const staticPageFiles = files.filter((item) => item.isFile && path.extname(item.name) === ".html")

  staticPageFiles.forEach((item) => {
    const fileContent = fs.readFileSync(path.join(pagesFolderPath, item.name))
    if (!fileContent) return
    fileItems[item.name] = fileContent.toString()
    console.log("fileItem name: ", item.name)
  })

  try {
    const res = await fetch(url, {
      method: "POST",
      body: JSON.stringify(fileItems),
      headers: new Headers([
        ["content-type", "application/json"],
        [CUSTOM_AUTH_KEY_HEADER, CUSTOM_AUTH_KEY],
      ]),
    })

    console.log("res: ", res)
  } catch (error) {
    console.error(error)
    throw error
  }

  console.log("finished sending static pages to cloudflare cache...")
}

postBuild()
