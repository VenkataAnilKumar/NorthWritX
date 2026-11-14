const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

test("desktop bridge exposes the NorthWrit name once and invokes NorthWrit channels", () => {
  const bridges = new Map();
  const calls = [];
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, "../preload.js"), "utf8"), {
    require(name) {
      assert.equal(name, "electron");
      return { contextBridge: { exposeInMainWorld: (name, api) => { assert.equal(bridges.has(name), false); bridges.set(name, api); } }, ipcRenderer: { invoke: channel => calls.push(channel), on() {} } };
    },
  });
  const current = bridges.get("northwritDesktop");
  assert.ok(current);
  assert.equal(bridges.size, 1);
  current.guestCredentials();
  current.startLocal();
  assert.deepEqual(calls, ["northwrit:guest-credentials", "northwrit:start-local"]);
});
