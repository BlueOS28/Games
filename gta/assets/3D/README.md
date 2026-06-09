This directory should contain the 3DENGINE submodule.

This change adds a .gitmodules entry pointing to https://github.com/ReplicaOS28201/3DENGINE.git at path `gta/assets/3D`.

Note: To initialize the submodule locally run:

    git submodule update --init --recursive

If you want this to be a proper git submodule (gitlink) tracked by the parent repository, ensure the submodule is added using `git submodule add` locally and pushed, or add the submodule commit reference before merging.
