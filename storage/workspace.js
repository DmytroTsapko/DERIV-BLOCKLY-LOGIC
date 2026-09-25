window.WorkspaceStorage = (() => {
  function save(workspace) {
    return Blockly.serialization.workspaces.save(workspace);
  }

  function load(workspace, state) {
    workspace.clear();
    Blockly.serialization.workspaces.load(state, workspace);
  }

  return { save, load };
})();