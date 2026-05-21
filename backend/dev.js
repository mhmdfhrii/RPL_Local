import { spawn } from "node:child_process";

const isWindows = process.platform === "win32";
const processes = [];

function run(name, command, args) {
  const child = spawn(command, args, {
    stdio: "inherit",
    shell: isWindows,
  });

  processes.push(child);

  child.on("exit", (code) => {
    if (code && code !== 0) {
      console.error(`[${name}] berhenti dengan kode ${code}`);
    }
    shutdown();
  });
}

function shutdown() {
  for (const child of processes) {
    if (!child.killed) {
      child.kill();
    }
  }
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

run("backend", "node", ["backend/server.js"]);
run("vite", "npx", ["vite", "--host", "localhost", "--port", "5173"]);
