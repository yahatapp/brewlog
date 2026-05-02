{
  description = "Coffee Profile LIFF App Development Environment";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    utils.url = "github:numtide/flake-utils";
  };

  outputs =
    {
      self,
      nixpkgs,
      utils,
    }:
    utils.lib.eachDefaultSystem (
      system:
      let
        pkgs = import nixpkgs {
          inherit system;
          config.allowUnfree = true;
        };
      in
      {
        devShells.default = pkgs.mkShell {
          buildInputs = with pkgs; [
            nodejs_24
            git
            pnpm
            terraform
          ];

          shellHook = ''
            export PATH="$PWD/node_modules/.bin:$PATH"
            echo "☕ Coffee Profile LIFF App Dev Environment"
            echo "Node.js: $(node --version)"
            echo "pnpm: $(pnpm --version)"
            echo "Terraform: $(terraform --version)"
          '';
        };
      }
    );
}
