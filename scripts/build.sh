#!/bin/bash

pkgVersion=$(grep -oE '"version":\s*"[^"]+' -m 1 ./package.json | grep -oE '[^"]+$')
pkgName=$(grep -oE '"name":\s*"[^"]+' -m 1 ./package.json | grep -oE '[^"]+$')

echo "Attention: This script should only be executed in generated deploy folder."


if [[ $# > 0 ]]; then
    export DOCKER_CLI_EXPERIMENTAL=enabled
    docker buildx build -t $pkgName:$pkgVersion --platform=$1 -o type=docker ./
else
    docker build -t $pkgName:$pkgVersion ./
fi
dockerTag=${pkgName}:${pkgVersion}
#docker tag $pkgName:$pkgVersion $dockerTag 
#docker push $dockerTag
