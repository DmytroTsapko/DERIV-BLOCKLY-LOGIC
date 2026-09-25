window.WorkspaceTests = {
  run(workspace) {
    const state = WorkspaceStorage.save(workspace);
    workspace.clear();
    WorkspaceStorage.load(workspace, state);
    return workspace.getAllBlocks(false).length > 0;
  }
};