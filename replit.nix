{ pkgs }: {
  deps = [
    pkgs.nodejs-18_x
    pkgs.nodePackages.npm
    pkgs.postgresql
    pkgs.redis
    pkgs.python3
  ];
}
