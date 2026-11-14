const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

test("desktop bridge retains its old name while invoking the new channels", () => {
  const bridges = new Map();
  const calls = [];
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, "../preload.js"), "utf8"), {
    require(name) {
      assert.equal(name, "electron");
      return { contextBridge: { exposeInMainWorld: (name, api) => bridges.set(name, api) }, ipcRenderer: { invoke: channel => calls.push(channel), on() {} } };
    },
  });
  const current = bridges.get("northwritDesktop");
  assert.equal(current, bridges.get("mikeDesktop"));
  current.guestCredentials();
  current.startLocal();
  assert.deepEqual(calls, ["northwrit:guest-credentials", "northwrit:start-local"]);
});
